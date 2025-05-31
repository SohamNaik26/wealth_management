from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        orm_mode = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Portfolio schemas
class PortfolioBase(BaseModel):
    name: str
    description: Optional[str] = None

class PortfolioCreate(PortfolioBase):
    pass

class PortfolioResponse(PortfolioBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Asset schemas
class AssetBase(BaseModel):
    name: str
    asset_type: str
    ticker_symbol: Optional[str] = None
    quantity: float
    purchase_price: float
    current_price: float
    purchase_date: datetime

class AssetCreate(AssetBase):
    portfolio_id: int

class AssetResponse(AssetBase):
    id: int
    portfolio_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Financial Goal schemas
class FinancialGoalBase(BaseModel):
    name: str
    description: Optional[str] = None
    target_amount: float
    current_amount: float = 0.0
    target_date: datetime
    priority: str

class FinancialGoalCreate(FinancialGoalBase):
    pass

class FinancialGoalResponse(FinancialGoalBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Transaction schemas
class TransactionBase(BaseModel):
    transaction_type: str
    amount: float
    asset_id: Optional[int] = None
    notes: Optional[str] = None

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    user_id: int
    transaction_date: datetime
    
    class Config:
        orm_mode = True

# Subscription Plan schemas
class SubscriptionPlanBase(BaseModel):
    name: str
    price: float
    description: str = ""

class SubscriptionPlanCreate(SubscriptionPlanBase):
    pass

class SubscriptionPlanResponse(SubscriptionPlanBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

# Subscription Payment schemas
class SubscriptionPaymentBase(BaseModel):
    plan_id: int
    payment_reference: str

class SubscriptionPaymentCreate(SubscriptionPaymentBase):
    pass

class SubscriptionPaymentResponse(SubscriptionPaymentBase):
    id: int
    user_id: int
    status: str
    timestamp: datetime
    class Config:
        orm_mode = True 