from typing import List
from pydantic import BaseModel


class ManufacturerIdList(BaseModel):
    ids: List[int]


class ManufacturerBase(BaseModel):
    name: str
    description: str
    address: str


class ManufacturerCreate(ManufacturerBase):
    pass


class Manufacturer(ManufacturerBase):
    id: int

    class Config:
        orm_mode = True


class ManufacturerOut(ManufacturerBase):
    id: int

    class Config:
        orm_mode = True
