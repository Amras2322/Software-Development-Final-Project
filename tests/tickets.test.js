// ticket pages, the observer, and the dashboard
const request = require("supertest");
const app = require("../src/server");
const { sequelize, Asset, Ticket, AuditLog } = require("../src/models");
const { loggedInAgent } = require("./helpers");

// the observer writes the audit row just after the response, so give it a moment
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("tickets", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("creates a ticket linked to an asset", async () => {
        const agent = await loggedInAgent();
        const asset = await Asset.create({ name: "Switch A", type: "switch" });

        const res = await agent.post("/tickets").type("form").send({
            title: "Switch is down",
            priority: "High",
            assetId: asset.id,
        });

        expect(res.status).toBe(302);
        const ticket = await Ticket.findOne();
        expect(ticket.title).toBe("Switch is down");
        expect(ticket.assetId).toBe(asset.id);
    });

    test("rejects a ticket with no title", async () => {
        const agent = await loggedInAgent();
        const res = await agent.post("/tickets").type("form").send({ title: "" });

        expect(res.status).toBe(400);
    });

    test("shows a ticket with its linked asset", async () => {
        const agent = await loggedInAgent();
        const asset = await Asset.create({ name: "Switch A", type: "switch" });
        const ticket = await Ticket.create({ title: "Down", assetId: asset.id });

        const res = await agent.get("/tickets/" + ticket.id);

        expect(res.status).toBe(200);
        expect(res.text).toContain("Switch A");
    });

    test("updates a ticket", async () => {
        const agent = await loggedInAgent();
        const ticket = await Ticket.create({ title: "Old title" });

        await agent.post("/tickets/" + ticket.id).type("form").send({ title: "New title", priority: "Low" });

        const updated = await Ticket.findByPk(ticket.id);
        expect(updated.title).toBe("New title");
        expect(updated.priority).toBe("Low");
    });

    test("resolving a ticket sets it Resolved and the observer logs it", async () => {
        const agent = await loggedInAgent();
        const ticket = await Ticket.create({ title: "Down" });

        const res = await agent.post("/tickets/" + ticket.id + "/resolve");
        expect(res.status).toBe(302);
        expect((await Ticket.findByPk(ticket.id)).status).toBe("Resolved");

        await wait(100);
        const logs = await AuditLog.findAll();
        expect(logs).toHaveLength(1);
        expect(logs[0].action).toBe("status_changed");
        expect(logs[0].detail).toBe("Open -> Resolved");
    });

    test("deletes a ticket", async () => {
        const agent = await loggedInAgent();
        const ticket = await Ticket.create({ title: "Down" });

        await agent.post("/tickets/" + ticket.id + "/delete");

        expect(await Ticket.count()).toBe(0);
    });

    test("the dashboard groups open tickets by priority and hides resolved ones", async () => {
        const agent = await loggedInAgent();
        await Ticket.create({ title: "High one", priority: "High" });
        await Ticket.create({ title: "Low one", priority: "Low" });
        const done = await Ticket.create({ title: "Finished one", priority: "High" });
        await done.update({ status: "Resolved" });

        const res = await agent.get("/dashboard");

        expect(res.status).toBe(200);
        expect(res.text).toContain("High one");
        expect(res.text).toContain("Low one");
        expect(res.text).not.toContain("Finished one");
    });

    test("lists the tickets", async () => {
        const agent = await loggedInAgent();
        await Ticket.create({ title: "Printer jam" });

        const res = await agent.get("/tickets");

        expect(res.status).toBe(200);
        expect(res.text).toContain("Printer jam");
    });

    test("renders the new ticket form", async () => {
        const agent = await loggedInAgent();

        const res = await agent.get("/tickets/new");

        expect(res.status).toBe(200);
        expect(res.text).toContain("New ticket");
    });

    test("renders the edit ticket form", async () => {
        const agent = await loggedInAgent();
        const ticket = await Ticket.create({ title: "Printer jam" });

        const res = await agent.get("/tickets/" + ticket.id + "/edit");

        expect(res.status).toBe(200);
        expect(res.text).toContain("Printer jam");
    });

    test("404s for a ticket that does not exist", async () => {
        const agent = await loggedInAgent();

        const res = await agent.get("/tickets/9999");

        expect(res.status).toBe(404);
    });

    test("rejects an update with no title", async () => {
        const agent = await loggedInAgent();
        const ticket = await Ticket.create({ title: "Printer jam" });

        const res = await agent.post("/tickets/" + ticket.id).type("form").send({ title: "" });

        expect(res.status).toBe(400);
    });
});
