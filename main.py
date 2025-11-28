from datetime import datetime, timedelta
import secrets
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Session, relationship
from passlib.context import CryptContext

# ===========================================
# Import da pasta smtp
# ===========================================

from smtp.config_smtp import send_reset_email

# ===========================================
# Import da pasta db
# ===========================================

from db.config_db import Base, engine, get_db
from db.tables import Usuario, PasswordResetToken

# ===========================================
# Configuração de senha (hashing)
# ===========================================
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

# ===========================================
# Aplicação FastAPI
# ===========================================
app = FastAPI()

# ===========================================
# CORS
# ===========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # em desenvolvimento, pode deixar "*"
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cria as tabelas se ainda não existirem
Base.metadata.create_all(bind=engine)


# ===========================================
# SCHEMAS (Pydantic)
# ===========================================
class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    password: str


class UsuarioOut(BaseModel):
    id: int
    nome: str
    email: EmailStr

    class Config:
        orm_mode = True


class LoginData(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


# ===========================================
# Função auxiliar para criar usuário
# ===========================================
def _criar_usuario_impl(dados: UsuarioCreate, db: Session) -> Usuario:
    usuario_existente = db.query(Usuario).filter(Usuario.email == dados.email).first()
    if usuario_existente:
        raise HTTPException(
            status_code=400,
            detail="Já existe um usuário cadastrado com esse e-mail.",
        )

    senha_hash = pwd_context.hash(dados.password)

    novo_usuario = Usuario(
        nome=dados.nome,
        email=dados.email,
        senha_hash=senha_hash,
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return novo_usuario


# ===========================================
# ENDPOINT: Cadastro de usuário
# ===========================================
@app.post("/api/register", response_model=UsuarioOut)
def criar_usuario(dados: UsuarioCreate, db: Session = Depends(get_db)):
    return _criar_usuario_impl(dados, db)

# ===========================================
# ENDPOINT: Login
# ===========================================
@app.post("/api/login", response_model=UsuarioOut)
def login(dados: LoginData, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter(Usuario.email == dados.email).first()

    if not usuario or not pwd_context.verify(dados.password, usuario.senha_hash):
        raise HTTPException(status_code=400, detail="E-mail ou senha inválidos.")

    return usuario


# ===========================================
# ENDPOINT: Esqueci minha senha (gera token + envia e-mail)
# ===========================================
@app.post("/api/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Recebe o e-mail, verifica se existe, gera um token de redefinição com validade de 10 minutos
    e envia o link para o endereço informado.
    """
    usuario = db.query(Usuario).filter(Usuario.email == payload.email).first()

    if not usuario:
        raise HTTPException(status_code=404, detail="Este e-mail não está cadastrado.")

    # Remove tokens antigos desse usuário (opcional)
    db.query(PasswordResetToken).filter(PasswordResetToken.user_id == usuario.id).delete()

    # Gera token e define expiração (10 minutos) usando horário local (naive)
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now() + timedelta(minutes=10)

    reset_token = PasswordResetToken(
        user_id=usuario.id,
        token=token,
        expires_at=expires_at,
    )

    db.add(reset_token)
    db.commit()

    # Ajuste a URL para o endereço real onde o seu front está hospedado
    reset_link = f"http://localhost:5173/reset-password?token={token}"

    try:
        send_reset_email(usuario.email, reset_link)
        return {"detail": "Enviamos um e-mail com instruções para redefinir sua senha."}
    except Exception as e:
        import traceback
        print(f"[RESET-SENHA] Erro ao enviar e-mail para {usuario.email}: {e}")
        traceback.print_exc()
        return {
            "detail": "O link de redefinição foi gerado, mas houve erro ao enviar o e-mail. Contate o suporte."
        }


# ===========================================
# ENDPOINT: Redefinir senha (usa token)
# ===========================================
@app.post("/api/reset-password", response_model=UsuarioOut)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Recebe token + nova senha, valida o token (incluindo expiração) e atualiza a senha do usuário.
    """
    # DEBUG: ver o token recebido no log
    print(f"[DEBUG RESET] Token recebido do front: {payload.token!r}")

    # 1) Busca o token no banco
    token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == payload.token
    ).first()

    if not token_record:
        raise HTTPException(status_code=400, detail="Token não encontrado.")

    # 2) Verifica expiração usando horário local (naive)
    expires_at_db = token_record.expires_at
    if expires_at_db is None:
        db.delete(token_record)
        db.commit()
        raise HTTPException(status_code=400, detail="Token sem data de expiração. Gere um novo link.")

    now_local = datetime.now()

    print(f"[DEBUG RESET] expires_at_db={expires_at_db!r}, now_local={now_local!r}")

    if expires_at_db < now_local:
        db.delete(token_record)
        db.commit()
        raise HTTPException(status_code=400, detail="Token expirado. Gere um novo link.")

    # 3) Busca o usuário do token
    usuario = db.query(Usuario).filter(Usuario.id == token_record.user_id).first()
    if not usuario:
        db.delete(token_record)
        db.commit()
        raise HTTPException(status_code=400, detail="Usuário do token não encontrado.")

    # 4) Valida a nova senha
    if len(payload.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="A nova senha deve ter pelo menos 6 caracteres."
        )

    # 5) Atualiza a senha
    usuario.senha_hash = pwd_context.hash(payload.new_password)

    # 6) Apaga o token depois de usar
    db.delete(token_record)
    db.commit()
    db.refresh(usuario)

    return usuario
