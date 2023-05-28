from fastapi import Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List, Optional

from . import models, schemas
from ..database import get_db
from .. import oauth2


router = APIRouter(
    prefix="/manufacturers",
    tags=['Manufacturer']
)


@router.get("/", response_model=List[schemas.ManufacturerOut])
def get_manufacturers(
    db: Session = Depends(get_db),
    limit: int = 10,
    offset: int = 0,
    search: Optional[str] = ""
):

    manufacturers_query = db.query(models.Manufacturer) \
        .filter(models.Manufacturer.name.contains(search))

    manufacturers = manufacturers_query \
        .limit(limit) \
        .offset(offset) \
        .all()
    return manufacturers


@router.post("/by-id-list", response_model=List[schemas.ManufacturerOut])
def get_manufacturers_by_id_list(
    ids: schemas.ManufacturerIdList,
    db: Session = Depends(get_db),
):

    manufacturers = db.query(models.Manufacturer).filter(
        models.Manufacturer.id.in_(ids.ids)).all()
    return manufacturers


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.Manufacturer)
def create_manufacturers(
    manufacturer: schemas.ManufacturerCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    new_manufacturer = models.Manufacturer(**manufacturer.dict())
    db.add(new_manufacturer)
    db.commit()
    db.refresh(new_manufacturer)

    return new_manufacturer


@router.get("/{id}", response_model=schemas.ManufacturerOut)
def get_manufacturer(
    id: int,
    db: Session = Depends(get_db),
):

    manufacturer = db.query(models.Manufacturer).filter(
        models.Manufacturer.id == id).first()

    if not manufacturer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"manufacturer with id: {id} was not found")

    return manufacturer


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_manufacturer(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    manufacturer_query = db.query(models.Manufacturer).filter(
        models.Manufacturer.id == id)

    manufacturer = manufacturer_query.first()

    if manufacturer == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"manufacturer with id: {id} does not exist")

    manufacturer_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{id}", response_model=schemas.Manufacturer)
def update_manufacturer(
    id: int,
    updated_manufacturer: schemas.ManufacturerCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    manufacturer_query = db.query(models.Manufacturer).filter(
        models.Manufacturer.id == id)

    manufacturer = manufacturer_query.first()

    if manufacturer == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"manufacturer with id: {id} does not exist")

    manufacturer_query.update(
        updated_manufacturer.dict(), synchronize_session=False)

    db.commit()

    return manufacturer_query.first()
