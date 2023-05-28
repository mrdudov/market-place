import enum
from sqlalchemy import Column, Enum, ForeignKey, Integer, Numeric
from sqlalchemy.orm import relationship

from ..database import Base


class OrderStatus(str, enum.Enum):
    CREATED = 'CREATED'
    ACCEPTED = 'ACCEPTED'
    PROCESSING = 'PROCESSING'
    REJECTED = 'REJECTED'
    FINISHED = 'FINISHED'


class OrderProduct(Base):
    __tablename__ = 'orders_products'
    order_id = Column(ForeignKey('orders.id'), primary_key=True)
    product_id = Column(ForeignKey('products.id'), primary_key=True)

    order = relationship("Order", back_populates="products")
    product = relationship("Product", back_populates="orders")

    product_count = Column(Integer, nullable=False)


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, nullable=False)
    order_status = Column(Enum(OrderStatus), nullable=False)
    price = Column(Numeric(scale=2), nullable=False)
    distance = Column(Numeric(scale=2), nullable=False)

    products = relationship('OrderProduct', back_populates='order')

    owner_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False)

    owner = relationship("User")
