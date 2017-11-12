# Instalação

1. Rode **npm install** em menvio-api
2. Rode **npm install** em menvio-application
3. Navegue até a pasta ./database e rode o comando: **mongorestore -d menvio ./menvio** (Considerando que já esteja rodando a instância do mongoDB)
4. Inicie os serviços:
  * API: **npm start**
  * APP: **npm run dev**


# API Routes

  ## Rotas
  POST http://localhost:3000/v1/calculator

  
  ### Request - body 
  ```
  {
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
  ```

  ### Response - Status
  
   **200 - Ok**: Retorno do Frete Calculado.

   **400 - Bad Request**: Caso haja algum erro de digitação.
