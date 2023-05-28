import email
from typing import List
from fastapi import status, HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from .. import utils
from ..database import get_db
from .. import oauth2
from . import models, schemas

router = APIRouter(
    prefix="/users",
    tags=['Users']
)


@router.get("/", response_model=List[schemas.UserProfile])
def get_userss(
    db: Session = Depends(get_db),
    limit: int = 10,
    offset: int = 0,
):

    products = db.query(models.User) \
        .limit(limit) \
        .offset(offset) \
        .all()
    return products


@router.post("/create-admin", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_admin_user(user: schemas.UserCreateAdmin, db: Session = Depends(get_db)):

    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    new_user = models.User(
        user_role=schemas.User_Role.ADMINISTRATOR,
        address=user.address if user.address else '',
        password=user.password,
        email=user.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/create-legal-entity", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_legal_entity_user(user: schemas.UserCreateLegalEntity, db: Session = Depends(get_db)):

    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    new_user = models.User(
        user_role=schemas.User_Role.LEGAL_ENTITY,
        address=user.address,
        password=user.password,
        email=user.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/create-individual", status_code=status.HTTP_201_CREATED, response_model=schemas.UserOut)
def create_individual_user(user: schemas.UserCreateIndividual, db: Session = Depends(get_db)):

    hashed_password = utils.hash(user.password)
    user.password = hashed_password

    new_user = models.User(
        user_role=schemas.User_Role.INDIVIDUAL,
        address=user.address,
        password=user.password,
        email=user.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.get('/profile', response_model=schemas.UserProfile)
def get_profile(
    current_user: int = Depends(oauth2.get_current_user)
):
    return current_user


@router.post('/profile', response_model=schemas.UserProfile)
def set_profile(
    user_profile: schemas.UserProfileIn,
    current_user: int = Depends(oauth2.get_current_user),
    db: Session = Depends(get_db),
):
    user = db.query(models.User).filter(
        models.User.id == current_user.id).first()
    user.address = user_profile.address

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.get('/{id}', response_model=schemas.UserOut)
def get_user(id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with id: {id} does not exist")

    return user
