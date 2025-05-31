from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..models.models import User, Transaction, Asset, Portfolio
from ..models.schemas import TransactionCreate, TransactionResponse
from ..services.auth import get_current_active_user

router = APIRouter(
    prefix="/transactions",
    tags=["transactions"],
)

@router.post("/", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # If transaction has an asset_id, verify it belongs to the user
    if transaction.asset_id:
        asset = db.query(Asset).join(Portfolio).filter(
            Asset.id == transaction.asset_id,
            Portfolio.user_id == current_user.id
        ).first()
        
        if not asset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Asset not found or doesn't belong to the user"
            )
    
    db_transaction = Transaction(
        transaction_type=transaction.transaction_type,
        amount=transaction.amount,
        asset_id=transaction.asset_id,
        notes=transaction.notes,
        user_id=current_user.id
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[TransactionResponse])
def read_transactions(
    skip: int = 0,
    limit: int = 100,
    asset_id: int = None,
    transaction_type: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Base query with user's transactions
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    
    # Filter by asset if provided
    if asset_id:
        query = query.filter(Transaction.asset_id == asset_id)
    
    # Filter by transaction type if provided
    if transaction_type:
        query = query.filter(Transaction.transaction_type == transaction_type)
    
    # Order by transaction date descending
    query = query.order_by(Transaction.transaction_date.desc())
    
    transactions = query.offset(skip).limit(limit).all()
    return transactions

@router.get("/{transaction_id}", response_model=TransactionResponse)
def read_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    db.delete(db_transaction)
    db.commit()
    return None 