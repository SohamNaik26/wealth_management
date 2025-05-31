from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models import models, schemas
from ..db.database import get_db
from typing import List
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(
    prefix="/subscriptions",
    tags=["subscriptions"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# Dummy dependency for user_id (replace with real auth in production)
def get_current_user_id(token: str = Depends(oauth2_scheme)):
    # In production, decode token and get user_id
    return 1  # Dummy user_id for now

@router.get("/plans", response_model=List[schemas.SubscriptionPlanResponse])
def get_plans(db: Session = Depends(get_db)):
    return db.query(models.SubscriptionPlan).all()

@router.post("/payment", response_model=schemas.SubscriptionPaymentResponse)
def submit_payment(payment: schemas.SubscriptionPaymentCreate, db: Session = Depends(get_db), user_id: int = Depends(get_current_user_id)):
    # Check if plan exists
    plan = db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.id == payment.plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    # Create payment record
    db_payment = models.SubscriptionPayment(
        user_id=user_id,
        plan_id=payment.plan_id,
        payment_reference=payment.payment_reference,
        status="pending"
    )
    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)
    return db_payment 