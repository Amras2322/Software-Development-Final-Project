const request = require("supertest");
const app = require("../src/server.js");

describe("landing page", () => {
  test("GET / returns the home page", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toContain("IT Asset");
  });

  test("GET /styles.css returns the stylesheet", async () => {
    const res = await request(app).get("/styles.css");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/css/);
  });
});