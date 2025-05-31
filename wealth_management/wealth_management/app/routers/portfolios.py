from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..models.models import User, Portfolio
from ..models.schemas import PortfolioCreate, PortfolioResponse
from ..services.auth import get_current_active_user

router = APIRouter(
    prefix="/portfolios",
    tags=["portfolios"],
)

@router.post("/", response_model=PortfolioResponse, status_code=status.HTTP_201_CREATED)
def create_portfolio(
    portfolio: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_portfolio = Portfolio(
        name=portfolio.name,
        description=portfolio.description,
        user_id=current_user.id
    )
    db.add(db_portfolio)
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

@router.get("/", response_model=List[PortfolioResponse])
def read_portfolios(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    portfolios = db.query(Portfolio).filter(Portfolio.user_id == current_user.id).offset(skip).limit(limit).all()
    return portfolios

@router.get("/{portfolio_id}", response_model=PortfolioResponse)
def read_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id, Portfolio.user_id == current_user.id).first()
    if portfolio is None:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio

@router.put("/{portfolio_id}", response_model=PortfolioResponse)
def update_portfolio(
    portfolio_id: int,
    portfolio: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id, Portfolio.user_id == current_user.id).first()
    if db_portfolio is None:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    db_portfolio.name = portfolio.name
    db_portfolio.description = portfolio.description
    
    db.commit()
    db.refresh(db_portfolio)
    return db_portfolio

@router.delete("/{portfolio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id, Portfolio.user_id == current_user.id).first()
    if db_portfolio is None:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    
    db.delete(db_portfolio)
    db.commit()
    return None 