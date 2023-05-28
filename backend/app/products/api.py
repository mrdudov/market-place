from fastapi import Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional

from . import models, schemas
from ..database import get_db
from .. import oauth2
from ..categories import models as category_models


router = APIRouter(
    prefix="/products",
    tags=['Products']
)


@router.get("/", response_model=List[schemas.ProductOut])
def get_products(
    db: Session = Depends(get_db),
    category_id: int = 0,
    manufacturer_id: int = 0,
    limit: int = 10,
    offset: int = 0,
    search: Optional[str] = ""
):

    products_query = db.query(models.Product) \
        .filter(models.Product.name.contains(search))

    if category_id != 0:
        products_query = products_query.filter(
            models.Product.category_id == category_id)

    if manufacturer_id != 0:
        products_query = products_query.filter(
            models.Product.manufacturer_id == manufacturer_id)

    products = products_query \
        .limit(limit) \
        .offset(offset) \
        .all()
    return products


@router.post("/by-id-list", response_model=List[schemas.ProductOut])
def get_products_by_id_list(
    ids: schemas.ProductIdList,
    db: Session = Depends(get_db),
):

    products = db.query(models.Product).filter(
        models.Product.id.in_(ids.ids)).all()
    return products


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Product)
def create_products(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    category = db.query(category_models.Category) \
        .filter(category_models.Category.id == product.category_id).first()

    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Category with id: {product.category_id} does not exist")

    new_product = models.Product(**product.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


@router.get("/{id}", response_model=schemas.ProductOut)
def get_product(
    id: int,
    db: Session = Depends(get_db),
):

    product = db.query(models.Product).filter(models.Product.id == id).first()

    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"product with id: {id} was not found")

    return product


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    product_query = db.query(models.Product).filter(models.Product.id == id)

    product = product_query.first()

    if product == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"product with id: {id} does not exist")

    product_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{id}", response_model=schemas.Product)
def update_product(
    id: int,
    updated_product: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    product_query = db.query(models.Product).filter(models.Product.id == id)

    product = product_query.first()

    if product == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"product with id: {id} does not exist")

    category = db.query(category_models.Category).filter(
        category_models.Category.id == updated_product.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Category with id: {updated_product.category_id} does not exist")

    product_query.update(updated_product.dict(), synchronize_session=False)

    db.commit()

    return product_query.first()
