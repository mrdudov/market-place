import enum
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP

from ..database import Base


class User_Role(str, enum.Enum):
    ADMINISTRATOR = 'ADMINISTRATOR'
    LEGAL_ENTITY = 'LEGAL_ENTITY'
    INDIVIDUAL = 'INDIVIDUAL'


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    address = Column(String, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True),
                        nullable=False, server_default=text('now()'))
    user_role = Column(Enum(User_Role), nullable=False)
