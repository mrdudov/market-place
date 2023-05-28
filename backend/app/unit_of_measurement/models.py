from sqlalchemy import Column, Integer, String

from ..database import Base


class UnitOfMeasurement(Base):
    __tablename__ = 'unit_of_measurement'

    id = Column(Integer, primary_key=True, nullable=False)
    unit = Column(String, nullable=False)
    description = Column(String, nullable=False)
