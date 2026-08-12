const request = require("supertest");
const app = require("../src/server");

describe("API Gateway", () => {
    test("GET /health deve retornar status 200", async () => {
        const response = await request(app).get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("ok");
        expect(response.body.service).toBe("gateway");
    });
});