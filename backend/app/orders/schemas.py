from typing import List, Optional
from pydantic import BaseModel

from . import models
from ..users.schemas import UserOut


class OrderBase(BaseModel):
    pass


class OrderStatus(BaseModel):
    order_status: models.OrderStatus

    class Config:
        orm_mode = True


class OrderProduct(BaseModel):
    product_id: int
    product_count: int

    class Config:
        orm_mode = True


class OrderCreate(OrderBase):
    products: Optional[List[OrderProduct]]


class Order(OrderBase):
    order_status: models.OrderStatus
    id: int

    class Config:
        orm_mode = True


class OrderEdit(OrderBase):
    order_status: models.OrderStatus
    distance: float
    price: float

    class Config:
        orm_mode = True


class OrderOut(OrderBase):
    id: int
    order_status: models.OrderStatus
    price: float
    distance: float
    products: List[OrderProduct]
    owner_id: int
    owner: UserOut

    class Config:
        orm_mode = True
