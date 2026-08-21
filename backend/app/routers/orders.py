from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import uuid
from app.database import get_db
from app.models.models import Order, OrderItem, Customer, Product, RawMaterialStock, StockMovement
from app.schemas.schemas import OrderCreate

router = APIRouter(prefix="/api", tags=["orders"])

@router.post("/checkout")
async def create_checkout(req: OrderCreate, db: AsyncSession = Depends(get_db)):
    if not req.items:
        raise HTTPException(status_code=400, detail="O carrinho está vazio.")

    order_id = f"ord_{uuid.uuid4().hex[:10]}"
    total = sum(item.quantity * item.unit_price for item in req.items)

    order = Order(
        id=order_id,
        customer_name=req.customer_name,
        customer_phone=req.customer_phone,
        customer_cpf=req.customer_cpf,
        total_amount=total,
        payment_status="pending",
        production_status="pending",
        shipping_deadline="5 dias úteis"
    )
    db.add(order)

    # Registrar / Atualizar cliente
    cust_res = await db.execute(select(Customer).where(Customer.phone == req.customer_phone))
    customer = cust_res.scalars().first()
    if not customer:
        customer = Customer(
            id=f"cust_{uuid.uuid4().hex[:8]}",
            name=req.customer_name,
            phone=req.customer_phone,
            cpf=req.customer_cpf
        )
        db.add(customer)

    # Registrar itens do pedido
    for item in req.items:
        order_item = OrderItem(
            id=f"item_{uuid.uuid4().hex[:10]}",
            order_id=order_id,
            product_id=item.product_id,
            product_name=item.product_name,
            diameter=item.diameter,
            finish=item.finish,
            quantity=item.quantity,
            unit_price=item.unit_price,
            custom_image_preview=item.custom_image_preview,
            original_image_url=item.original_image_url
        )
        db.add(order_item)

    await db.commit()
    await db.refresh(order)

    return {
        "order_id": order_id,
        "total_amount": total,
        "status": "pending",
        "qr_code": "00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540515.005802BR5913TUTAS PAPER6008SAO PAULO62070503***6304E2CA",
        "qr_code_base64": ""
    }

@router.put("/admin/orders/{order_id}/production-status")
async def update_production_status(order_id: str, payload: dict, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalars().first()
    if not order:
        raise HTTPException(status_code=404, detail="Pedido não encontrado.")

    status_val = payload.get("production_status", "pending")
    order.production_status = status_val
    await db.commit()
    await db.refresh(order)
    return {"message": f"Status atualizado para {status_val}", "order_id": order_id}

@router.get("/admin/production-queue")
async def get_production_queue(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Order).order_by(Order.created_at.desc()))
    orders = result.scalars().all()
    queue = []
    for o in orders:
        items_res = await db.execute(select(OrderItem).where(OrderItem.order_id == o.id))
        items = items_res.scalars().all()
        for i in items:
            queue.append({
                "order_id": o.id,
                "customer_name": o.customer_name,
                "customer_phone": o.customer_phone,
                "product_name": i.product_name,
                "diameter": i.diameter,
                "finish": i.finish,
                "quantity": i.quantity,
                "custom_image_preview": i.custom_image_preview,
                "original_image_url": i.original_image_url,
                "production_status": o.production_status,
                "shipping_deadline": o.shipping_deadline,
                "created_at": o.created_at.isoformat() if o.created_at else None
            })
    return queue

@router.get("/admin/dashboard-stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    sales_res = await db.execute(select(func.sum(Order.total_amount), func.count(Order.id)))
    sales_row = sales_res.first()
    total_sales = float(sales_row[0] or 0.0)
    total_orders = int(sales_row[1] or 0)

    pending_res = await db.execute(select(func.count(Order.id)).where(Order.production_status == "pending"))
    pending_orders = pending_res.scalar() or 0

    prod_res = await db.execute(select(func.count(Product.id)).where(Product.is_active == True))
    total_products = prod_res.scalar() or 0

    stock_res = await db.execute(select(func.sum(RawMaterialStock.quantity)))
    stock_total = stock_res.scalar() or 0

    cmv_res = await db.execute(select(func.sum(StockMovement.total_cost)).where(StockMovement.movement_type == "SAIDA_VENDA"))
    total_cmv = float(cmv_res.scalar() or 0.0)

    loss_res = await db.execute(select(func.sum(StockMovement.total_cost)).where(StockMovement.movement_type == "PERDA_PRENSA"))
    total_loss = float(loss_res.scalar() or 0.0)

    cust_res = await db.execute(select(func.count(Customer.id)))
    total_customers = cust_res.scalar() or 0

    net_profit = total_sales - total_cmv - total_loss

    return {
        "total_sales": total_sales,
        "monthly_sales": total_sales,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_products": total_products,
        "total_cmv": total_cmv,
        "total_loss": total_loss,
        "net_profit": net_profit,
        "stock_monetary_value": 0.0,
        "stock_total_items": stock_total,
        "low_stock": 0,
        "total_customers": total_customers
    }

@router.get("/admin/customers")
async def get_customers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).order_by(Customer.created_at.desc()))
    customers = result.scalars().all()
    return [{
        "id": c.id, "name": c.name, "phone": c.phone, "cpf": c.cpf, "created_at": c.created_at.isoformat() if c.created_at else None
    } for c in customers]
