from pydantic import BaseModel
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    description: str
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class CategoryOut(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
