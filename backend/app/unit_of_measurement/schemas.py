from typing import List
from pydantic import BaseModel


class UnitOfMeasurementBase(BaseModel):
    unit: str
    description: str


class UnitOfMeasurementCreate(UnitOfMeasurementBase):
    pass


class UnitOfMeasurement(UnitOfMeasurementBase):
    id: int

    class Config:
        orm_mode = True


class UnitOfMeasurementOut(UnitOfMeasurementBase):
    id: int

    class Config:
        orm_mode = True
