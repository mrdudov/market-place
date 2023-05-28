from fastapi import Response, status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas
from ..database import get_db
from .. import oauth2


router = APIRouter(
    prefix="/unit-of-measurement",
    tags=['Unit of measurement']
)


@router.get("/", response_model=List[schemas.UnitOfMeasurementOut])
def get_unit_of_measurement(
    db: Session = Depends(get_db),
    limit: int = 10,
    offset: int = 0,
):

    unit_of_measurement = db.query(models.UnitOfMeasurement) \
        .limit(limit) \
        .offset(offset) \
        .all()
    return unit_of_measurement


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=schemas.UnitOfMeasurement)
def create_unit_of_measurement(
    unit_of_measurement: schemas.UnitOfMeasurementCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    new_unit_of_measurement = models.UnitOfMeasurement(
        **unit_of_measurement.dict())
    db.add(new_unit_of_measurement)
    db.commit()
    db.refresh(new_unit_of_measurement)

    return new_unit_of_measurement


@router.get("/{id}", response_model=schemas.UnitOfMeasurementOut)
def get_unit_of_measurement(
    id: int,
    db: Session = Depends(get_db),
):

    unit_of_measurement = db.query(models.UnitOfMeasurement).filter(
        models.UnitOfMeasurement.id == id).first()

    if not unit_of_measurement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"unit_of_measurement with id: {id} was not found")

    return unit_of_measurement


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_unit_of_measurement(
    id: int,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    unit_of_measurement_query = db.query(models.UnitOfMeasurement).filter(
        models.UnitOfMeasurement.id == id)

    unit_of_measurement = unit_of_measurement_query.first()

    if unit_of_measurement == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"unit_of_measurement with id: {id} does not exist")

    unit_of_measurement_query.delete(synchronize_session=False)
    db.commit()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.put("/{id}", response_model=schemas.UnitOfMeasurement)
def update_unit_of_measurement(
    id: int,
    updated_unit_of_measurement: schemas.UnitOfMeasurementCreate,
    db: Session = Depends(get_db),
    current_user: int = Depends(oauth2.get_current_user)
):

    unit_of_measurement_query = db.query(models.UnitOfMeasurement).filter(
        models.UnitOfMeasurement.id == id)

    unit_of_measurement = unit_of_measurement_query.first()

    if unit_of_measurement == None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"unit_of_measurement with id: {id} does not exist")

    unit_of_measurement_query.update(
        updated_unit_of_measurement.dict(), synchronize_session=False)

    db.commit()

    return unit_of_measurement_query.first()
