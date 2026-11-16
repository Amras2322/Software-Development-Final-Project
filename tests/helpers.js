// shared bits for the test files
const request = require("supertest");
const app = require("../src/server");

// a supertest "agent" keeps cookies, so this registers and stays logged in
async function loggedInAgent(email = "user@example.com") {
    const agent = request.agent(app);
    await agent.post("/register").type("form").send({ email, password: "secret123" });
    return agent;
}

module.exports = { loggedInAgent };
