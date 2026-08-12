const request = require("supertest");
const app = require("../src/server");

describe("Serviço de Pagamentos", () => {
    test("GET /health deve retornar status 200", async () => {
        const response = await request(app).get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("ok");
    });

    test("GET /pagamentos deve retornar uma lista", async () => {
        const response = await request(app).get("/pagamentos");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("POST /pagamentos deve criar um pagamento", async () => {
        const response = await request(app)
            .post("/pagamentos")
            .send({
                pedidoId: 1,
                valor: 100
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("aprovado");
    });
});