const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "pagamentos"
    });
});

app.get("/pagamentos", (req, res) => {
    res.status(200).json([
        {
            id: 1,
            pedidoId: 1,
            valor: 100,
            status: "aprovado"
        }
    ]);
});

app.post("/pagamentos", (req, res) => {
    const { pedidoId, valor } = req.body;

    if (!pedidoId || !valor) {
        return res.status(400).json({
            erro: "pedidoId e valor são obrigatórios"
        });
    }

    const pagamento = {
        id: Date.now(),
        pedidoId,
        valor,
        status: "aprovado"
    };

    res.status(201).json(pagamento);
});

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Serviço de pagamentos executando na porta ${PORT}`);
    });
}

module.exports = app;