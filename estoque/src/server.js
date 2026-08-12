const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3002;

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "estoque"
    });
});

// Consultar estoque
app.get("/estoque", (req, res) => {
    res.status(200).json([
        {
            produto: "Notebook",
            quantidade: 10
        },
        {
            produto: "Mouse",
            quantidade: 25
        }
    ]);
});

// Reservar produto
app.post("/estoque/reservar", (req, res) => {
    const { produto, quantidade } = req.body;

    if (!produto || !quantidade) {
        return res.status(400).json({
            erro: "produto e quantidade são obrigatórios"
        });
    }

    const reserva = {
        id: Date.now(),
        produto,
        quantidade,
        status: "reservado"
    };

    res.status(201).json(reserva);
});

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Serviço de estoque executando na porta ${PORT}`);
    });
}

module.exports = app;