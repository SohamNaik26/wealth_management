from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..models.models import User
from ..models.schemas import UserCreate, UserResponse
from ..services.auth import get_password_hash, get_current_active_user

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_user_me(
    first_name: str = None,
    last_name: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if first_name:
        current_user.first_name = first_name
    if last_name:
        current_user.last_name = last_name
    
    db.commit()
    db.refresh(current_user)
    return current_user 