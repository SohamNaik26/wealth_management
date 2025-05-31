from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..models.models import User, Asset, Portfolio
from ..models.schemas import AssetCreate, AssetResponse
from ..services.auth import get_current_active_user

router = APIRouter(
    prefix="/assets",
    tags=["assets"],
)

@router.post("/", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def create_asset(
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify portfolio belongs to user
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == asset.portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found or doesn't belong to the user"
        )
    
    db_asset = Asset(
        name=asset.name,
        asset_type=asset.asset_type,
        ticker_symbol=asset.ticker_symbol,
        quantity=asset.quantity,
        purchase_price=asset.purchase_price,
        current_price=asset.current_price,
        purchase_date=asset.purchase_date,
        portfolio_id=asset.portfolio_id
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@router.get("/", response_model=List[AssetResponse])
def read_assets(
    skip: int = 0,
    limit: int = 100,
    portfolio_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Base query with user's portfolios
    query = db.query(Asset).join(Portfolio).filter(Portfolio.user_id == current_user.id)
    
    # Filter by portfolio if provided
    if portfolio_id:
        query = query.filter(Asset.portfolio_id == portfolio_id)
    
    assets = query.offset(skip).limit(limit).all()
    return assets

@router.get("/{asset_id}", response_model=AssetResponse)
def read_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    asset = db.query(Asset).join(Portfolio).filter(
        Asset.id == asset_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@router.put("/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: int,
    asset: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify portfolio belongs to user
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == asset.portfolio_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found or doesn't belong to the user"
        )
    
    db_asset = db.query(Asset).join(Portfolio).filter(
        Asset.id == asset_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    db_asset.name = asset.name
    db_asset.asset_type = asset.asset_type
    db_asset.ticker_symbol = asset.ticker_symbol
    db_asset.quantity = asset.quantity
    db_asset.purchase_price = asset.purchase_price
    db_asset.current_price = asset.current_price
    db_asset.purchase_date = asset.purchase_date
    db_asset.portfolio_id = asset.portfolio_id
    
    db.commit()
    db.refresh(db_asset)
    return db_asset

@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_asset = db.query(Asset).join(Portfolio).filter(
        Asset.id == asset_id,
        Portfolio.user_id == current_user.id
    ).first()
    
    if db_asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    db.delete(db_asset)
    db.commit()
    return None 