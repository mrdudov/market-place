from fastapi import Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List

from app.orders.services import calc_order_price

from . import models, schemas
from ..database import get_db
from .. import oauth2


router = APIRouter(
    prefix="/orders",
    tags=['Orders']
)


@router.get("/", response_model=List[schemas.OrderOut])
def get_orders(
    db: Session = Depends(get_db),
    limit: int = 10,
    offset: int = 0,
    current_user: int = Depends(oauth2.get_current_user)
):
    orders = db.query(models.Order) \
        .filter(models.Order.owner_id == current_user.id) \
        .limit(limit) \
        .offset(offset) \
        .all()

    return orders


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Order)
def create_order(
    order_create: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    new_order = models.Order(
        order_status=models.OrderStatus.CREATED,
        owner_id=current_user.id,
        price=0,
        distance=0
    )

    db.add(new_order)
    db.flush()

    for product in order_create.products:
        try:
            order_product = models.OrderProduct(
                order_id=new_order.id,
                product_id=product.product_id,
                product_count=product.product_count,
            )
            db.add(order_product)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"error - product with id: {product.product_id}")

    new_order.price = calc_order_price(new_order)
    db.add(new_order)

    try:
        db.commit()
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"db.commit exception")
    db.refresh(new_order)

    return new_order


@router.post("/{id}/add-products", status_code=status.HTTP_201_CREATED, response_model=schemas.OrderOut)
def add_products(
    id: int,
    products: List[schemas.OrderProduct],
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    order = db.query(models.Order).filter(
        models.Order.id == id,
        models.Order.owner_id == current_user.id
    ).first()

    if order == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"order with id: {id} does not exist")

    for product in products:
        try:
            order_product = models.OrderProduct(
                order_id=order.id,
                product_id=product.product_id,
                product_count=product.product_count,
            )
            db.add(order_product)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"error - product with id: {product.product_id}")

    order.price = calc_order_price(order)
    db.add(order)

    try:
        db.commit()
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"db.commit exception")
    db.refresh(order)

    return order


@router.post("/{id}/edit-products", status_code=status.HTTP_201_CREATED, response_model=schemas.OrderOut)
def add_products(
    id: int,
    products: List[schemas.OrderProduct],
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    order = db.query(models.Order).filter(
        models.Order.id == id,
        models.Order.owner_id == current_user.id
    ).first()

    if order == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"order with id: {id} does not exist")

    for product in products:
        try:
            order_product = db.query(models.OrderProduct).filter(
                models.OrderProduct.order_id == order.id,
                models.OrderProduct.product_id == product.product_id,
            ).first()
            order_product.product_count = product.product_count
            db.add(order_product)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"error - product with id: {product.product_id}")

    order.price = calc_order_price(order)
    db.add(order)

    try:
        db.commit()
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"db.commit exception")
    db.refresh(order)

    return order


@router.post("/{id}/remove-products", response_model=schemas.OrderOut)
def create_order(
    id: int,
    product_ids: List[int],
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    order = db.query(models.Order).filter(
        models.Order.id == id,
        models.Order.owner_id == current_user.id
    ).first()

    if order == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"order with id: {id} does not exist")

    for product_id in product_ids:
        try:
            order_product = db.query(models.OrderProduct)\
                .filter(
                    models.OrderProduct.order_id == order.id,
                    models.OrderProduct.product_id == product_id
            ).first()
            db.delete(order_product)
        except:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"error - product with id: {product_id}")

    order.price = calc_order_price(order)
    db.add(order)

    try:
        db.commit()
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"db.commit exception")
    db.refresh(order)

    return order


@router.get("/{id}", response_model=schemas.OrderOut)
def get_order(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    order = db.query(models.Order).filter(
        models.Order.id == id,
        models.Order.owner_id == current_user.id
    ).first()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"order with id: {id} was not found")

    return order


@router.put("/{id}/set-status", response_model=schemas.OrderOut)
def update_order_status(
    id: int,
    order_status: schemas.OrderStatus,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    order_query = db.query(models.Order).filter(
        models.Order.id == id,
        models.Order.owner_id == current_user.id
    )

    order = order_query.first()

    if order == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"order with id: {id} does not exist")

    order.order_status = order_status.order_status
    db.add(order)
    db.commit()

    return order_query.first()


@router.put("/{id}", response_model=schemas.OrderOut)
def update_order(
    id: int,
    order_edit: schemas.OrderEdit,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    order_query = db.query(models.Order).filter(
        models.Order.id == id,
        models.Order.owner_id == current_user.id
    )

    order = order_query.first()

    if order == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"order with id: {id} does not exist")

    order.order_status = order_edit.order_status
    order.distance = order_edit.distance
    order.price = order_edit.price
    db.add(order)
    db.commit()

    return order_query.first()


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    order_query = db.query(models.Order).filter(
        models.Order.id == id,
        models.Order.owner_id == current_user.id
    )

    order = order_query.first()

    if order == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"order with id: {id} does not exist")

    order_products = db.query(models.OrderProduct).filter(
        models.OrderProduct.order_id == id)
    order_products.delete(synchronize_session=False)

    order_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)
