CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente VARCHAR(100) NOT NULL,
    produto VARCHAR(100) NOT NULL,
    quantidade INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pagamentos (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pagamento_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id)
);

CREATE TABLE IF NOT EXISTS estoque (
    id SERIAL PRIMARY KEY,
    produto VARCHAR(100) NOT NULL,
    quantidade INTEGER NOT NULL
);

INSERT INTO estoque (produto, quantidade)
SELECT 'Notebook', 10
WHERE NOT EXISTS (
    SELECT 1 FROM estoque WHERE produto = 'Notebook'
);

INSERT INTO estoque (produto, quantidade)
SELECT 'Mouse', 25
WHERE NOT EXISTS (
    SELECT 1 FROM estoque WHERE produto = 'Mouse'
);