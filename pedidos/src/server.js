const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "pedidos"
    });
});

app.get("/pedidos", (req, res) => {
    res.status(200).json([
        {
            id: 1,
            cliente: "João",
            produto: "Notebook",
            quantidade: 1,
            status: "criado"
        }
    ]);
});

app.post("/pedidos", (req, res) => {
    const { cliente, produto, quantidade } = req.body;

    if (!cliente || !produto || !quantidade) {
        return res.status(400).json({
            erro: "cliente, produto e quantidade são obrigatórios"
        });
    }

    const pedido = {
        id: Date.now(),
        cliente,
        produto,
        quantidade,
        status: "criado"
    };

    res.status(201).json(pedido);
});

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Serviço de pedidos executando na porta ${PORT}`);
    });
}

module.exports = app;