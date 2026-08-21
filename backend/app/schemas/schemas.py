from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    token: str
    user: dict

class CategorySchema(BaseModel):
    id: str
    name: str
    description: Optional[str] = None

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    base_price: float = 15.00
    stock: int = 20
    category_id: Optional[str] = None
    image_url: Optional[str] = None
    is_limited_edition: bool = False
    max_limit: Optional[int] = None

class RawMaterialStockSchema(BaseModel):
    id: str
    category: str
    code: str
    name: str
    quantity: int
    min_quantity: int

class StockMovementCreate(BaseModel):
    raw_material_code: str
    movement_type: str # ENTRADA, SAIDA_VENDA, PERDA_PRENSA, AJUSTE
    quantity: int
    total_cost: Optional[float] = 0.0
    supplier_info: Optional[str] = None
    notes: Optional[str] = None

class OrderItemCreate(BaseModel):
    product_id: Optional[str] = None
    product_name: str
    diameter: str
    finish: str
    quantity: int
    unit_price: float
    custom_image_preview: Optional[str] = None
    original_image_url: Optional[str] = None

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_cpf: Optional[str] = None
    items: List[OrderItemCreate]

class StoreConfigSchema(BaseModel):
    modo_24h: Optional[bool] = False
    modo_evento_24h: Optional[bool] = False
    mp_environment: Optional[str] = "sandbox"
    mp_public_key: Optional[str] = None
    mercadopago_token: Optional[str] = None
    evolution_api_url: Optional[str] = "http://localhost:8080"
    evolution_api_key: Optional[str] = "tutas_evolution_key"
    admin_phone: Optional[str] = None
    hero_phrase: Optional[str] = None
