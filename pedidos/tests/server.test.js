const request = require("supertest");
const app = require("../src/server");

describe("Serviço de Pedidos", () => {
    test("GET /health deve retornar status 200", async () => {
        const response = await request(app).get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("ok");
    });

    test("GET /pedidos deve retornar uma lista", async () => {
        const response = await request(app).get("/pedidos");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    test("POST /pedidos deve criar um pedido", async () => {
        const response = await request(app)
            .post("/pedidos")
            .send({
                cliente: "João",
                produto: "Notebook",
                quantidade: 1
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.status).toBe("criado");
    });
});