from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.models import StoreConfig
from app.schemas.schemas import StoreConfigSchema

router = APIRouter(prefix="/api", tags=["config"])

@router.get("/config")
async def get_store_config(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StoreConfig).where(StoreConfig.id == 1))
    config = result.scalars().first()
    if not config:
        config = StoreConfig(id=1, modo_24h=False, modo_evento_24h=False)
        db.add(config)
        await db.commit()
        await db.refresh(config)

    return {
        "modo_24h": config.modo_24h,
        "modo_evento_24h": config.modo_evento_24h,
        "mp_environment": config.mp_environment,
        "mp_public_key": config.mp_public_key or "APP_USR-mock-public-key",
        "mercadopago_token": config.mercadopago_token,
        "evolution_api_url": config.evolution_api_url or "http://localhost:8080",
        "evolution_api_key": config.evolution_api_key or "tutas_evolution_key",
        "admin_phone": config.admin_phone or "11999999999",
        "hero_phrase": config.hero_phrase,
        "default_delivery_days": 24 if config.modo_24h else 5
    }

@router.post("/admin/config")
async def update_store_config(req: StoreConfigSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(StoreConfig).where(StoreConfig.id == 1))
    config = result.scalars().first()
    if not config:
        config = StoreConfig(id=1)
        db.add(config)

    if req.modo_24h is not None:
        config.modo_24h = req.modo_24h
    if req.modo_evento_24h is not None:
        config.modo_evento_24h = req.modo_evento_24h
    if req.mp_environment is not None:
        config.mp_environment = req.mp_environment
    if req.mp_public_key is not None:
        config.mp_public_key = req.mp_public_key
    if req.mercadopago_token is not None:
        config.mercadopago_token = req.mercadopago_token
    if req.evolution_api_url is not None:
        config.evolution_api_url = req.evolution_api_url
    if req.evolution_api_key is not None:
        config.evolution_api_key = req.evolution_api_key
    if req.admin_phone is not None:
        config.admin_phone = req.admin_phone
    if req.hero_phrase is not None:
        config.hero_phrase = req.hero_phrase

    await db.commit()
    return {"message": "Configurações salvas com sucesso!"}
