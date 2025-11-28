from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from db.config_db import Base

# ===========================================
# MODELOS (SQLAlchemy)
# ===========================================
class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    telefone = Column(String(20), nullable=False)
    time = Column(String(20), nullable=False)
    senha_hash = Column(String(255), nullable=False)

    user_table = relationship("PasswordResetToken",back_populates="tokens_reset",cascade="all, delete-orphan",)


class UsuarioFoto(Base):
    __tablename__ = "usuarios_fotos"

    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    foto = Column(Text, nullable=True)


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False, index=True)
    token = Column(String(255), unique=True, nullable=False, index=True)
    # aqui você mantém o mesmo tipo que já usava no main.py
    expires_at = Column(DateTime, nullable=False)

    tokens_reset = relationship("Usuario", back_populates="user_table")