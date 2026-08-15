# Pedidos Veloz

Plataforma de pedidos baseada em arquitetura de microsserviços, com containerização, Kubernetes, escalabilidade automática, observabilidade, CI/CD e Infrastructure as Code.

## 1. Visão geral

O projeto **Pedidos Veloz** foi desenvolvido como uma aplicação distribuída composta por quatro serviços principais:

- **Gateway** — ponto de entrada das requisições.
- **Pedidos** — gerenciamento de pedidos.
- **Pagamentos** — processamento de pagamentos.
- **Estoque** — consulta e reserva de produtos.
- **PostgreSQL** — banco de dados persistente utilizado pela aplicação.

A aplicação foi desenvolvida inicialmente com execução local e Docker Compose e, posteriormente, implantada em um cluster Kubernetes local utilizando Docker Desktop.

## 2. Arquitetura


                         Cliente
                            |
                            v
                   +------------------+
                   |   API Gateway    |
                   |      :8080       |
                   +--------+---------+
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
        +-----------+ +-----------+ +-----------+
        |  Pedidos  | |Pagamentos | |  Estoque  |
        |   :3000   | |   :3001   | |   :3002   |
        +-----+-----+ +-----+-----+ +-----+-----+
              |             |             |
              +-------------+-------------+
                            |
                            v
                     +-------------+
                     | PostgreSQL  |
                     |    :5432    |
                     +-------------+


No Kubernetes, a comunicação entre os componentes ocorre por meio de Services internos e DNS do cluster.

## 3. Tecnologias utilizadas

- Node.js
- Express
- Jest
- Docker
- Docker Compose
- PostgreSQL
- Kubernetes
- Helm
- Prometheus
- Grafana
- Alertmanager
- kube-state-metrics
- OpenTelemetry
- Jaeger
- GitHub Actions
- GitHub Container Registry (GHCR)
- Terraform

## 4. Estrutura do projeto


pedidos-veloz/
├── gateway/
├── pedidos/
├── pagamentos/
├── estoque/
├── database/
├── kubernetes/
├── terraform/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── docker-compose.yml
└── README.md


## 5. Execução local com Docker Compose

Na raiz do projeto:


docker compose up -d --build


Verificar os serviços:


docker compose ps


Parar o ambiente:


docker compose down


O PostgreSQL utiliza volume persistente para preservar os dados:


postgres-data


O arquivo `database/init.sql` é utilizado para inicialização do banco.

## 6. Serviços da aplicação

### Gateway

Porta:


8080


Health check:


GET /health


Rotas principais:


/api/pedidos
/api/pagamentos
/api/estoque


### Pedidos

Porta:


3000


Health check:


GET /health


### Pagamentos

Porta:


3001


Health check:


GET /health


### Estoque

Porta:


3002


Health check:


GET /health


## 7. Kubernetes

O namespace utilizado para a aplicação é:


pedidos-veloz


Criar/aplicar os recursos:


kubectl apply -f kubernetes/


Verificar os Pods:


kubectl get pods -n pedidos-veloz


Verificar os Deployments:


kubectl get deployments -n pedidos-veloz


Verificar os Services:


kubectl get services -n pedidos-veloz


### Componentes implantados


Gateway
Pedidos
Pagamentos
Estoque
PostgreSQL


Os serviços da aplicação utilizam duas réplicas inicialmente.

O PostgreSQL utiliza:


PersistentVolumeClaim: postgres-pvc


## 8. Configuração

Os valores de configuração são separados por meio de ConfigMaps.

Exemplos:


pedidos-config
pagamentos-config
estoque-config
gateway-config
postgres-config


Credenciais do banco são armazenadas em Kubernetes Secrets.

O repositório não mantém as credenciais dos Secrets versionadas.

## 9. Segurança no Kubernetes

O namespace da aplicação utiliza Pod Security Admission:


enforce=restricted
audit=restricted
warn=restricted


Os containers da aplicação utilizam práticas de hardening, incluindo:


runAsNonRoot: true
allowPrivilegeEscalation: false
capabilities:
  drop:
    - ALL
seccompProfile:
  type: RuntimeDefault


O PostgreSQL também foi configurado com usuário não-root compatível com a imagem utilizada.

A política `restricted` foi validada com um Pod propositalmente inseguro, que foi rejeitado pelo Kubernetes.

## 10. Readiness e Liveness

Os serviços possuem:

- `readinessProbe`
- `livenessProbe`

Essas verificações utilizam principalmente o endpoint:


/health


No PostgreSQL, são utilizadas verificações com:


pg_isready


## 11. Rolling Update

Os Deployments utilizam:


strategy:
  type: RollingUpdate


Com a configuração utilizada, novas versões podem ser disponibilizadas gradualmente sem remover todas as réplicas existentes simultaneamente.

## 12. HPA

O serviço de **Pedidos** possui um Horizontal Pod Autoscaler:


Minimum replicas: 2
Maximum replicas: 5
Target CPU: 70%


Verificar:


kubectl get hpa -n pedidos-veloz


Durante o teste de carga, o serviço aumentou de:


2 → 4 réplicas


Após a redução da carga, o HPA reduziu novamente as réplicas de forma gradual.

## 13. Metrics Server

O Metrics Server foi configurado no cluster para fornecer métricas utilizadas pelo HPA.

Verificar:


kubectl top nodes


e:


kubectl top pods -n pedidos-veloz


## 14. Observabilidade

A stack de observabilidade utiliza:


Prometheus
Grafana
Alertmanager
kube-state-metrics
Jaeger
OpenTelemetry


### Prometheus

Responsável pela coleta e armazenamento de métricas.

### Grafana

Utilizado para visualização das métricas e dashboards.

### Jaeger

Utilizado para visualização de traces distribuídos.

### OpenTelemetry

Os serviços Node.js utilizam auto-instrumentação para geração e envio de traces via OTLP.

O endpoint utilizado dentro do cluster é:


http://jaeger.monitoring.svc.cluster.local:4318


Os serviços instrumentados são:


gateway
pedidos
pagamentos
estoque


## 15. Acesso ao Grafana

Para acesso local:


kubectl port-forward service/monitoring-grafana 3000:80 -n monitoring


Depois:


http://localhost:3000


## 16. Acesso ao Jaeger


kubectl port-forward service/jaeger 16686:16686 -n monitoring


Depois:


http://localhost:16686


## 17. CI/CD

O pipeline está em:


.github/workflows/ci-cd.yml


O workflow é executado em:


push → main
pull request → main


O pipeline executa:


Checkout
   ↓
Node.js
   ↓
npm ci
   ↓
Testes
   ↓
Build das imagens Docker
   ↓
Publicação no GHCR


Os quatro serviços são testados individualmente:


pedidos
pagamentos
estoque
gateway


A publicação das imagens ocorre após a aprovação dos testes.

As imagens são publicadas no GitHub Container Registry com tags baseadas no SHA do commit e `latest`.

## 18. GitHub Container Registry

As imagens são publicadas no formato:


ghcr.io/tadeuzin24/pedidos-veloz-pedidos
ghcr.io/tadeuzin24/pedidos-veloz-pagamentos
ghcr.io/tadeuzin24/pedidos-veloz-estoque
ghcr.io/tadeuzin24/pedidos-veloz-gateway


## 19. Terraform

A pasta de Infrastructure as Code é:


terraform/


Com arquivos como:


main.tf
variables.tf
outputs.tf
README.md


Inicialização:


terraform init


Validação:


terraform validate


Planejamento:


terraform plan


O `terraform plan` foi executado com sucesso, indicando que a configuração declarada está consistente com o estado gerenciado pelo Terraform.

## 20. Testes

Os serviços utilizam Jest para testes automatizados.

Para executar os testes de um serviço:


npm test


Exemplo:


cd pedidos
npm test


O pipeline CI/CD executa os testes automaticamente para os quatro serviços.

## 21. Principais evidências de validação

Durante a implementação foram realizados os seguintes testes:

- execução dos microsserviços;
- comunicação através do API Gateway;
- persistência do PostgreSQL;
- deploy dos componentes no Kubernetes;
- funcionamento de Services;
- readiness e liveness;
- rejeição de Pod inseguro pelo Pod Security Admission;
- escalabilidade automática do HPA;
- coleta de métricas pelo Metrics Server;
- funcionamento do Prometheus e Grafana;
- envio e visualização de traces no Jaeger;
- execução do pipeline GitHub Actions;
- build e publicação das imagens no GHCR;
- `terraform validate`;
- `terraform plan`.

## 22. Conclusão

O projeto implementa uma plataforma de pedidos baseada em microsserviços, com separação de responsabilidades entre os componentes e uma arquitetura preparada para execução conteinerizada e orquestrada.

A utilização de Docker Compose fornece um ambiente local reproduzível, enquanto o Kubernetes fornece recursos de implantação, descoberta de serviços, persistência, segurança, escalabilidade e atualizações graduais.

A aplicação também possui uma camada de observabilidade baseada em métricas e tracing distribuído, além de um pipeline de CI/CD para automatização de testes e publicação das imagens.

Por fim, o uso de Terraform demonstra a adoção de Infrastructure as Code e a organização declarativa da infraestrutura.

## 23. Principais comandos

### Docker

docker compose up -d --build
docker compose ps
docker compose down


### Kubernetes

kubectl get pods -n pedidos-veloz
kubectl get deployments -n pedidos-veloz
kubectl get services -n pedidos-veloz
kubectl get hpa -n pedidos-veloz
kubectl top pods -n pedidos-veloz


### Helm

helm list -n monitoring


### Terraform

terraform init
terraform validate
terraform plan