# Contrato de Interface: Admin & Store API

> Identificador: `002-admin-estoque-seguranca`
> Contrato: `admin-api`
> Tipo: HTTP REST / JSON

## 1. Endpoints de Produtos (`/api/products`)

### `GET /api/products`
- **Acesso**: Público (E-commerce e Admin).
- **Response `200 OK`**:
```json
[
  {
    "id": 1,
    "name": "Botton Artigo Religioso N. Sra. Aparecida",
    "description": "Botton 4.5cm impresso em papel fotográfico de alta qualidade",
    "category": "Religiosos",
    "price": 12.50,
    "customization_fee": 0.00,
    "image_url": "/uploads/botton-religioso.jpg",
    "stock_quantity": 45,
    "active": true
  }
]
```

### `POST /api/admin/products`
- **Acesso**: Privado (`admin` e `funcionario`).
- **Request (Multipart Form Data / JSON)**:
```json
{
  "name": "Botton Personalizado EJC",
  "description": "Botton especial com arte do evento",
  "category": "Eventos",
  "price": 15.00,
  "stock_quantity": 100,
  "image_url": "/uploads/ejc-botton.png"
}
```

---

## 2. Endpoints de Clientes (`/api/admin/customers`)

### `GET /api/admin/customers`
- **Acesso**: Privado (`admin` e `funcionario`).
- **Response `200 OK`**:
```json
[
  {
    "id": 10,
    "name": "Julião Medeiros",
    "phone": "83999998888",
    "cpf": "123.456.789-00",
    "street": "Rua das Flores",
    "number": "123",
    "neighborhood": "Centro",
    "city": "João Pessoa",
    "state": "PB",
    "zip_code": "58000-000",
    "created_at": "2026-08-03T20:00:00Z"
  }
]
```

---

## 3. Endpoints de Configuração (`/api/admin/config`)

### `GET /api/store/config`
- **Acesso**: Público.
- **Response `200 OK`**:
```json
{
  "modo_24h": true,
  "hero_phrase": "Modo Entrega Rápida 24h: Escolha seu botton diretamente no nosso catálogo."
}
```

### `PUT /api/admin/config`
- **Acesso**: Privado (`admin` apenas).
- **Request**:
```json
{
  "modo_24h": false,
  "mp_environment": "sandbox"
}
```
