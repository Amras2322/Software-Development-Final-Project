// register / login / logout
const request = require("supertest");
const app = require("../src/server");
const { sequelize, User } = require("../src/models");

describe("authentication", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test("register hashes the password and logs the user in", async () => {
        const res = await request(app).post("/register").type("form").send({
            email: "a@b.com",
            password: "secret123",
        });

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/dashboard");

        const user = await User.findOne({ where: { email: "a@b.com" } });
        expect(user.passwordHash).not.toBe("secret123");
        expect(user.passwordHash).toMatch(/^\$2/); // looks like a bcrypt hash
    });

    test("register rejects an email that is already taken", async () => {
        await request(app).post("/register").type("form").send({ email: "a@b.com", password: "secret123" });
        const res = await request(app).post("/register").type("form").send({ email: "a@b.com", password: "secret123" });

        expect(res.status).toBe(400);
    });

    test("register rejects missing fields", async () => {
        const res = await request(app).post("/register").type("form").send({ email: "", password: "" });

        expect(res.status).toBe(400);
    });

    test("login works with the right password", async () => {
        await request(app).post("/register").type("form").send({ email: "a@b.com", password: "secret123" });
        const res = await request(app).post("/login").type("form").send({ email: "a@b.com", password: "secret123" });

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/dashboard");
    });

    test("login fails with the wrong password", async () => {
        await request(app).post("/register").type("form").send({ email: "a@b.com", password: "secret123" });
        const res = await request(app).post("/login").type("form").send({ email: "a@b.com", password: "nope" });

        expect(res.status).toBe(400);
    });

    test("login fails for an unknown email", async () => {
        const res = await request(app).post("/login").type("form").send({ email: "nobody@b.com", password: "secret123" });

        expect(res.status).toBe(400);
    });

    test("logout sends the user back to the login page", async () => {
        const agent = request.agent(app);
        await agent.post("/register").type("form").send({ email: "a@b.com", password: "secret123" });

        await agent.post("/logout");
        const res = await agent.get("/dashboard");

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("/login");
    });
});
