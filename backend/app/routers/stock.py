from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
import uuid
from app.database import get_db
from app.models.models import RawMaterialStock, StockMovement
from app.schemas.schemas import StockMovementCreate

router = APIRouter(prefix="/api/admin/raw-materials-stock", tags=["stock"])

INITIAL_RAW_MATERIALS = [
    {"code": "25mm_alfinete", "name": "Matéria-Prima Botton 25mm com Alfinete", "category": "Insumos Físicos", "min_quantity": 10},
    {"code": "25mm_chaveiro", "name": "Matéria-Prima Botton 25mm com Chaveiro 2 Faces", "category": "Insumos Físicos", "min_quantity": 10},
    {"code": "25mm_ima", "name": "Matéria-Prima Botton 25mm com Ímã de Geladeira", "category": "Insumos Físicos", "min_quantity": 10},
    {"code": "38mm_alfinete", "name": "Matéria-Prima Botton 38mm com Alfinete", "category": "Insumos Físicos", "min_quantity": 10},
    {"code": "38mm_chaveiro", "name": "Matéria-Prima Botton 38mm com Chaveiro 2 Faces", "category": "Insumos Físicos", "min_quantity": 10},
    {"code": "38mm_ima", "name": "Matéria-Prima Botton 38mm com Ímã de Geladeira", "category": "Insumos Físicos", "min_quantity": 10}
]

@router.get("")
async def get_raw_materials_stock(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RawMaterialStock))
    items = result.scalars().all()
    if not items:
        # Semear automaticamente as 6 matérias-primas físicas centrais se vazio
        created_list = []
        for raw in INITIAL_RAW_MATERIALS:
            raw_id = f"raw_{raw['code']}"
            item = RawMaterialStock(
                id=raw_id,
                category=raw["category"],
                code=raw["code"],
                name=raw["name"],
                quantity=100,
                min_quantity=raw["min_quantity"]
            )
            db.add(item)
            created_list.append(item)
        await db.commit()
        return [{
            "id": i.id, "category": i.category, "code": i.code, "name": i.name, "quantity": i.quantity, "min_quantity": i.min_quantity
        } for i in created_list]
    
    return [{
        "id": i.id, "category": i.category, "code": i.code, "name": i.name, "quantity": i.quantity, "min_quantity": i.min_quantity
    } for i in items]

@router.get("/movements")
async def get_stock_movements(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StockMovement).order_by(StockMovement.created_at.desc()))
    movements = result.scalars().all()
    return [{
        "id": m.id,
        "movement_type": m.movement_type,
        "raw_material_code": m.raw_material_code,
        "quantity": m.quantity,
        "previous_quantity": m.previous_quantity,
        "new_quantity": m.new_quantity,
        "total_cost": float(m.total_cost or 0.0),
        "unit_cost": float(m.unit_cost or 0.0),
        "supplier_info": m.supplier_info,
        "notes": m.notes,
        "order_id": m.order_id,
        "created_at": m.created_at.isoformat() if m.created_at else None
    } for m in movements]

@router.post("/movements")
async def create_stock_movement(req: StockMovementCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RawMaterialStock).where(RawMaterialStock.code == req.raw_material_code))
    stock_item = result.scalars().first()

    if not stock_item:
        raise HTTPException(status_code=404, detail="Matéria-prima não encontrada.")

    prev_qty = stock_item.quantity
    qty = req.quantity
    movement_type = req.movement_type

    if movement_type in ["ENTRADA", "AJUSTE"]:
        new_qty = prev_qty + qty
    elif movement_type in ["SAIDA_VENDA", "PERDA_PRENSA"]:
        new_qty = max(0, prev_qty - qty)
    else:
        new_qty = prev_qty

    stock_item.quantity = new_qty
    unit_cost = (req.total_cost / qty) if qty > 0 and req.total_cost else 0.0

    movement = StockMovement(
        id=f"mov_{uuid.uuid4().hex[:10]}",
        movement_type=movement_type,
        raw_material_code=req.raw_material_code,
        quantity=qty,
        previous_quantity=prev_qty,
        new_quantity=new_qty,
        total_cost=req.total_cost or 0.0,
        unit_cost=unit_cost,
        supplier_info=req.supplier_info,
        notes=req.notes
    )

    db.add(movement)
    await db.commit()
    await db.refresh(stock_item)

    return {
        "message": "Movimentação registrada com sucesso!",
        "new_quantity": new_qty,
        "movement_type": movement_type
    }
