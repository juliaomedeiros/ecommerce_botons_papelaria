# Contrato: Consulta e Autopreenchimento de Cliente por WhatsApp

> Identificador: `customer-lookup`  
> Protocolo: HTTP REST  

## 1. Requisição (`GET /api/customers/lookup`)

- **Query Parameters:** `phone` (string contendo número de telefone sanitizado)
- **Exemplo de URL:** `GET /api/customers/lookup?phone=8399887766`

## 2. Resposta de Sucesso (200 OK - Cliente Encontrado)

```json
{
  "found": true,
  "customer": {
    "name": "Maria Silva",
    "phone": "8399887766",
    "cpf": "123.456.789-00",
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "João Pessoa",
    "state": "PB",
    "zip_code": "58000-000",
    "complement": "Apto 101"
  }
}
```

## 3. Resposta de Cliente Não Encontrado (200 OK - Não Encontrado)

```json
{
  "found": false,
  "message": "Nenhum cadastro prévio encontrado para este WhatsApp."
}
```
