from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import uuid
from app.database import get_db
from app.models.models import Product, Category
from app.schemas.schemas import ProductCreate

router = APIRouter(prefix="/api", tags=["products"])

@router.get("/categories")
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category))
    categories = result.scalars().all()
    if not categories:
        default_cats = [
            {"id": "cat_bottons", "name": "Bottons, Chaveiros & Ímãs", "description": "Linha Fast-Food 25mm e 38mm"},
            {"id": "cat_religiosos", "name": "Artigos Religiosos", "description": "Terços, Medalhas e Imagens"},
            {"id": "cat_papelaria", "name": "Materiais de Papelaria", "description": "Cadernos e Itens de Papelaria"}
        ]
        return default_cats
    return [{"id": c.id, "name": c.name, "description": c.description} for c in categories]

@router.post("/admin/categories")
async def create_category(cat: dict, db: AsyncSession = Depends(get_db)):
    cat_id = f"cat_{uuid.uuid4().hex[:8]}"
    category = Category(
        id=cat_id,
        name=cat.get("name", "Nova Categoria"),
        description=cat.get("description", "")
    )
    db.add(category)
    await db.commit()
    await db.refresh(category)
    return {"message": "Categoria criada com sucesso!", "category": {"id": category.id, "name": category.name}}

@router.post("/admin/upload-product-image")
async def upload_product_image(file: UploadFile = File(...)):
    import os, uuid
    upload_dir = "/app/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    filename = f"prod_{uuid.uuid4().hex[:8]}_{file.filename}"
    filepath = os.path.join(upload_dir, filename)
    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)
    return {"url": f"/uploads/{filename}"}

@router.get("/products")
async def get_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).where(Product.is_active == True))
    products = result.scalars().all()
    return [{
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "base_price": float(p.base_price or 15.00),
        "stock": p.stock,
        "image_url": p.image_url,
        "is_active": p.is_active,
        "category_id": p.category_id,
        "is_limited_edition": p.is_limited_edition,
        "max_limit": p.max_limit
    } for p in products]

@router.post("/admin/products")
async def create_product(req: ProductCreate, db: AsyncSession = Depends(get_db)):
    prod_id = f"prod_{uuid.uuid4().hex[:8]}"
    product = Product(
        id=prod_id,
        name=req.name,
        description=req.description,
        base_price=req.base_price,
        stock=req.stock,
        category_id=req.category_id,
        image_url=req.image_url,
        is_limited_edition=req.is_limited_edition,
        max_limit=req.max_limit
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return {"message": "Produto cadastrado com sucesso!", "product_id": prod_id}
