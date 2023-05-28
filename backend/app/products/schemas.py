from typing import List
from pydantic import BaseModel


class ProductIdList(BaseModel):
    ids: List[int]


class ProductBase(BaseModel):
    price: float
    manufacturer_price: float
    shipping_cost_coefficient: float
    name: str
    description: str


class ProductCreate(ProductBase):
    category_id: int
    manufacturer_id: int
    unit_of_measurement_id: int


class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True


class ProductOut(ProductBase):
    id: int
    category_id: int
    manufacturer_id: int
    unit_of_measurement_id: int

    class Config:
        orm_mode = True
