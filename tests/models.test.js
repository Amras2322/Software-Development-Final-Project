// model rules and relationships
const { sequelize, User, Asset, Ticket, AuditLog } = require("../src/models");

describe("models", () => {
    beforeEach(async () => {
        // start each test with empty tables
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("a user keeps an email and a password hash", async () => {
        const user = await User.create({ email: "a@b.com", passwordHash: "hash" });

        expect(user.id).toBeDefined();
        expect(user.email).toBe("a@b.com");
    });

    test("a user needs a real looking email", async () => {
        await expect(User.create({ email: "not-an-email", passwordHash: "hash" })).rejects.toThrow();
    });

    test("a user needs a unique email", async () => {
        await User.create({ email: "a@b.com", passwordHash: "hash" });

        await expect(User.create({ email: "a@b.com", passwordHash: "hash" })).rejects.toThrow();
    });

    test("a new ticket is Open and Medium by default", async () => {
        const ticket = await Ticket.create({ title: "Printer jam" });

        expect(ticket.status).toBe("Open");
        expect(ticket.priority).toBe("Medium");
    });

    test("a ticket rejects an unknown priority", async () => {
        await expect(Ticket.create({ title: "x", priority: "Urgent" })).rejects.toThrow();
    });

    test("a ticket can be linked to an asset", async () => {
        const asset = await Asset.create({ name: "Switch A", type: "switch" });
        const ticket = await Ticket.create({ title: "Down", assetId: asset.id });

        const loaded = await Ticket.findByPk(ticket.id, { include: [Asset] });

        expect(loaded.Asset.name).toBe("Switch A");
    });

    test("an audit log entry points at a ticket", async () => {
        const ticket = await Ticket.create({ title: "Down" });

        await AuditLog.create({ ticketId: ticket.id, action: "status_changed", detail: "Open -> Resolved" });

        const logs = await AuditLog.findAll({ where: { ticketId: ticket.id } });
        expect(logs).toHaveLength(1);
        expect(logs[0].detail).toBe("Open -> Resolved");
    });
});
