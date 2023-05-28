from sqlalchemy import Column, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import relationship

from ..database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Numeric(scale=2), nullable=False)
    manufacturer_price = Column(Numeric(scale=2), nullable=False)
    shipping_cost_coefficient = Column(Numeric(scale=2), nullable=False)
    category_id = Column(Integer, ForeignKey(
        "categories.id", ondelete="CASCADE"), nullable=False)
    manufacturer_id = Column(Integer, ForeignKey(
        "manufacturer.id", ondelete="CASCADE"), nullable=False)
    unit_of_measurement_id = Column(Integer, ForeignKey(
        "unit_of_measurement.id", ondelete="CASCADE"), nullable=False)
    category = relationship("Category")
    manufacturer = relationship("Manufacturer")
    unit_of_measurement = relationship("UnitOfMeasurement")
    orders = relationship('OrderProduct', back_populates='product')
