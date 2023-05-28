from fastapi import Response, status, HTTPException, Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import oauth2
from ..database import get_db
from . import models, schemas, permissions


router = APIRouter(
    prefix="/categories",
    tags=['Categories']
)


@router.get("/", response_model=List[schemas.CategoryOut])
def get_categories(
    db: Session = Depends(get_db),
    limit: int = 10,
    offset: int = 0,
    search: Optional[str] = ""
):

    categories = db.query(models.Category) \
        .filter(models.Category.name.contains(search)) \
        .limit(limit) \
        .offset(offset) \
        .all()
    return categories


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Category)
def create_categories(
    category: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):
    if not permissions.is_admin(current_user):
        raise HTTPException(
            status_code=403,
            detail="only admin can create new category")

    new_category = models.Category(**category.dict())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


@router.get("/{id}", response_model=schemas.CategoryOut)
def get_category(
    id: int,
    db: Session = Depends(get_db),
):

    category = db.query(models.Category).filter(
        models.Category.id == id).first()

    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"category with id: {id} was not found")

    return category


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    if not permissions.is_admin(current_user):
        raise HTTPException(
            status_code=403,
            detail="only admin can delete category")

    category_query = db.query(models.Category).filter(models.Category.id == id)

    category = category_query.first()

    if category == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"category with id: {id} does not exist")

    category_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{id}", response_model=schemas.Category)
def update_category(
    id: int, updated_category: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    if not permissions.is_admin(current_user):
        raise HTTPException(
            status_code=403,
            detail="only admin can edit category")

    category_query = db.query(models.Category).filter(models.Category.id == id)

    category = category_query.first()

    if category == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"category with id: {id} does not exist")

    category_query.update(updated_category.dict(), synchronize_session=False)

    db.commit()

    return category_query.first()
