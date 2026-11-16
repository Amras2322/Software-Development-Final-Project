// asset pages
const request = require("supertest");
const app = require("../src/server");
const { sequelize, Asset } = require("../src/models");
const { loggedInAgent } = require("./helpers");

describe("assets", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("needs a login", async () => {
        const res = await request(app).get("/assets");

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/login");
    });

    test("creates an asset", async () => {
        const agent = await loggedInAgent();
        const res = await agent.post("/assets").type("form").send({
            name: "Front desk laptop",
            type: "laptop",
            serialNumber: "ABC123",
        });

        expect(res.status).toBe(302);
        expect(await Asset.count()).toBe(1);
    });

    test("lists the assets", async () => {
        const agent = await loggedInAgent();
        await Asset.create({ name: "Switch A", type: "switch" });

        const res = await agent.get("/assets");

        expect(res.status).toBe(200);
        expect(res.text).toContain("Switch A");
    });

    test("rejects an asset with no name", async () => {
        const agent = await loggedInAgent();
        const res = await agent.post("/assets").type("form").send({ name: "", type: "laptop" });

        expect(res.status).toBe(400);
    });

    test("updates an asset", async () => {
        const agent = await loggedInAgent();
        const asset = await Asset.create({ name: "Old name", type: "laptop" });

        await agent.post("/assets/" + asset.id).type("form").send({ name: "New name", type: "laptop" });

        expect((await Asset.findByPk(asset.id)).name).toBe("New name");
    });

    test("deletes an asset", async () => {
        const agent = await loggedInAgent();
        const asset = await Asset.create({ name: "Old name", type: "laptop" });

        await agent.post("/assets/" + asset.id + "/delete");

        expect(await Asset.count()).toBe(0);
    });

    test("returns 404 for a missing asset", async () => {
        const agent = await loggedInAgent();
        const res = await agent.get("/assets/999/edit");

        expect(res.status).toBe(404);
    });

    test("renders the new asset form", async () => {
        const agent = await loggedInAgent();

        const res = await agent.get("/assets/new");

        expect(res.status).toBe(200);
        expect(res.text).toContain("New asset");
    });

    test("rejects an update with no name", async () => {
        const agent = await loggedInAgent();
        const asset = await Asset.create({ name: "Switch A", type: "switch" });

        const res = await agent.post("/assets/" + asset.id).type("form").send({ name: "", type: "switch" });

        expect(res.status).toBe(400);
    });
});
