# config_db.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DB_CONFIG = {
    "USER": "usr_occ",
    "PASSWORD": "Gac0d3c3",
    "HOST": "localhost",
    "PORT": 5432,
    "DB": "portal_occ",
}

def build_database_url(config: dict) -> str:
    """
    Monta a URL de conexão do SQLAlchemy a partir do DB_CONFIG.
    Espera chaves: USER, PASSWORD, HOST, PORT, NAME.
    """
    user = config["USER"]
    password = config["PASSWORD"]
    host = config["HOST"]
    port = config["PORT"]
    db = config["DB"]
    return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}"


DATABASE_URL = build_database_url(DB_CONFIG)

# Engine e Session
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

# Base para modelos
Base = declarative_base()


def get_db():
    """
    Dependência do FastAPI para obter uma sessão de banco.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
