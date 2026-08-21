from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import jwt
from datetime import datetime, timedelta
import bcrypt
from app.database import get_db
from app.models.models import AdminUser
from app.schemas.schemas import LoginRequest, LoginResponse
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["auth"])

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AdminUser).where(AdminUser.email == req.email))
    user = result.scalars().first()

    # Credencial master admin padrão se tabela vazia
    if not user and req.email == "admin@tutaspapeis.com.br" and req.password == "admin123":
        token = create_access_token({"sub": "admin@tutaspapeis.com.br", "role": "admin"})
        return {"token": token, "user": {"email": "admin@tutaspapeis.com.br", "role": "admin"}}

    if not user:
        raise HTTPException(status_code=401, detail="Credenciais inválidas. Verifique seu e-mail e senha.")

    # Verificar senha bcrypt
    if not bcrypt.checkpw(req.password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Credenciais inválidas.")

    token = create_access_token({"sub": user.email, "role": user.role})
    return {"token": token, "user": {"email": user.email, "role": user.role}}
