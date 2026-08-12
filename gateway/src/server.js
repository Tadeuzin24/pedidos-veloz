const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const PORT = process.env.PORT || 8080;

const PEDIDOS_URL = process.env.PEDIDOS_URL || "http://localhost:3000";
const PAGAMENTOS_URL =
    process.env.PAGAMENTOS_URL || "http://localhost:3001";
const ESTOQUE_URL =
    process.env.ESTOQUE_URL || "http://localhost:3002";

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        service: "gateway"
    });
});

app.use(
    "/api/pedidos",
    createProxyMiddleware({
        target: PEDIDOS_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/api/pedidos": "/pedidos"
        },
        on: {
            proxyReq: (proxyReq, req) => {
                if (req.body) {
                    const bodyData = JSON.stringify(req.body);

                    proxyReq.setHeader("Content-Type", "application/json");
                    proxyReq.setHeader(
                        "Content-Length",
                        Buffer.byteLength(bodyData)
                    );

                    proxyReq.write(bodyData);
                }
            }
        }
    })
);

app.use(
    "/api/pagamentos",
    createProxyMiddleware({
        target: PAGAMENTOS_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/api/pagamentos": "/pagamentos"
        },
        on: {
            proxyReq: (proxyReq, req) => {
                if (req.body) {
                    const bodyData = JSON.stringify(req.body);

                    proxyReq.setHeader("Content-Type", "application/json");
                    proxyReq.setHeader(
                        "Content-Length",
                        Buffer.byteLength(bodyData)
                    );

                    proxyReq.write(bodyData);
                }
            }
        }
    })
);

app.use(
    "/api/estoque",
    createProxyMiddleware({
        target: ESTOQUE_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/api/estoque": "/estoque"
        },
        on: {
            proxyReq: (proxyReq, req) => {
                if (req.body) {
                    const bodyData = JSON.stringify(req.body);

                    proxyReq.setHeader("Content-Type", "application/json");
                    proxyReq.setHeader(
                        "Content-Length",
                        Buffer.byteLength(bodyData)
                    );

                    proxyReq.write(bodyData);
                }
            }
        }
    })
);

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`API Gateway executando na porta ${PORT}`);
    });
}

module.exports = app;