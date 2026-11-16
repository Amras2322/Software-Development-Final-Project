// basic pages and the public front end
const request = require("supertest");
const app = require("../src/server");

describe("app", () => {
    test("serves the landing page", async () => {
        const res = await request(app).get("/");

        expect(res.status).toBe(200);
        expect(res.text).toContain("IT Asset");
    });

    test("serves the stylesheet", async () => {
        const res = await request(app).get("/styles.css");

        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/css/);
    });

    test("shows the log in link when logged out", async () => {
        const res = await request(app).get("/");

        expect(res.text).toContain('href="/login"');
        expect(res.text).not.toContain('href="/dashboard"');
    });

    test("does not expose source files", async () => {
        const res = await request(app).get("/db.js");

        expect(res.status).toBe(404);
    });
});
