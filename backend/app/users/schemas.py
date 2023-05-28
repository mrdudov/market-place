from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime
from .models import User_Role


class UserOut(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    address: str
    user_role: User_Role

    class Config:
        orm_mode = True


class UserProfile(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    address: str
    user_role: User_Role

    class Config:
        orm_mode = True


class UserProfileIn(BaseModel):
    address: str

    class Config:
        orm_mode = True


class UserCreateAdmin(BaseModel):
    email: EmailStr
    password: str
    address: Optional[str]


class UserCreateLegalEntity(BaseModel):
    email: EmailStr
    password: str
    address: str


class UserCreateIndividual(BaseModel):
    email: EmailStr
    password: str
    address: str


class UserLogin(BaseModel):
    username: EmailStr
    password: str
