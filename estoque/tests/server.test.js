const request = require("supertest");
const app = require("../src/server");

describe("Serviço de Estoque", () => {
    test("GET /health deve retornar status 200", async () => {
        const response = await request(app).get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("ok");
    });

    test("GET /estoque deve retornar uma lista", async () => {
        const response = await request(app).get("/estoque");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("POST /estoque/reservar deve criar uma reserva", async () => {
        const response = await request(app)
            .post("/estoque/reservar")
            .send({
                produto: "Notebook",
                quantidade: 1
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("reservado");
    });
});