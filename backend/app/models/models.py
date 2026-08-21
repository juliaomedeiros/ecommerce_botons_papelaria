from sqlalchemy import Column, String, Integer, Numeric, Boolean, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    base_price = Column(Numeric(10, 2), nullable=False, default=15.00)
    stock = Column(Integer, nullable=False, default=20)
    image_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    category_id = Column(String, ForeignKey("categories.id"), nullable=True)
    is_limited_edition = Column(Boolean, default=False)
    max_limit = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RawMaterialStock(Base):
    __tablename__ = "raw_materials_stock"

    id = Column(String, primary_key=True)
    category = Column(String, nullable=False, default="Insumos Físicos")
    code = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    min_quantity = Column(Integer, nullable=False, default=10)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(String, primary_key=True)
    movement_type = Column(String, nullable=False) # ENTRADA, SAIDA_VENDA, PERDA_PRENSA, AJUSTE
    raw_material_code = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    previous_quantity = Column(Integer, nullable=False)
    new_quantity = Column(Integer, nullable=False)
    total_cost = Column(Numeric(10, 2), default=0.00)
    unit_cost = Column(Numeric(10, 2), default=0.00)
    supplier_info = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    order_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    cpf = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True)
    customer_name = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    customer_cpf = Column(String, nullable=True)
    total_amount = Column(Numeric(10, 2), nullable=False)
    payment_status = Column(String, default="pending") # pending, approved, cancelled
    production_status = Column(String, default="pending") # pending, in_production, ready, completed
    shipping_deadline = Column(String, default="5 dias úteis")
    mercadopago_id = Column(String, nullable=True)
    qr_code = Column(Text, nullable=True)
    qr_code_base64 = Column(Text, nullable=True)
    stock_deducted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    product_id = Column(String, nullable=True)
    product_name = Column(String, nullable=False)
    diameter = Column(String, nullable=False) # 25mm, 38mm
    finish = Column(String, nullable=False) # Alfinete, Chaveiro, Ímã
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    custom_image_preview = Column(Text, nullable=True)
    original_image_url = Column(Text, nullable=True)

    order = relationship("Order", back_populates="items")

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="admin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class StoreConfig(Base):
    __tablename__ = "store_config"

    id = Column(Integer, primary_key=True, default=1)
    modo_24h = Column(Boolean, default=False)
    modo_evento_24h = Column(Boolean, default=False)
    mp_environment = Column(String, default="sandbox")
    mp_public_key = Column(Text, nullable=True)
    mercadopago_token = Column(Text, nullable=True)
    mp_webhook_secret = Column(Text, nullable=True)
    evolution_api_url = Column(Text, default="http://localhost:8080")
    evolution_api_key = Column(Text, default="tutas_evolution_key")
    evolution_instance_name = Column(Text, default="tutaspaper")
    admin_phone = Column(String, nullable=True)
    hero_phrase = Column(Text, default="Escolha seu botton no catálogo ou personalize um modelo exclusivo com a sua imagem.")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
