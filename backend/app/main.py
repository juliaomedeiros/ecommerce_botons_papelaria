from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, products, stock, orders, config_router

app = FastAPI(
    title="Tuta's Paper API",
    description="API RESTful de Alta Performance em Python FastAPI",
    version="2.0.0"
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar tabelas de banco de dados
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Registrar Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(stock.router)
app.include_router(orders.router)
app.include_router(config_router.router)

@app.get("/api/health")
async def health_check():
    return {"status": "online", "framework": "Python 3.12 / FastAPI 0.111", "version": "2.0.0"}
