# Instalação

1- Rode npm install em menvio-api
2- Rode npm install em menvio-application
3- Navegue até a pasta ./database e rode o comando: (Considerando que já esteja rodando a instância do mongoDB)

```
  mongorestore -d menvio ./menvio

```

4 - Inicie os serviços:
  API -> npm start
  application -> npm run dev


# API Routes

POST http://localhost:3000/v1/calculator

  BODY {
    origin: Number,
    destiny: Number,
    weight: Number,
    oWidth: Number,
    oHeight: Number,
    oLength: Number,
    service: ['express', 'economic'],
    delivery: Boolean,
    receipt: Boolean,
    extimate: String
  }

  Responses:
  200 - Ok
    Retorno do Frete Calculado.

  400 - Bad Request
    Caso haja algum erro de digitação.
