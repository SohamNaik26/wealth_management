from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Text, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..db.database import Base

# User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    portfolios = relationship("Portfolio", back_populates="owner")
    financial_goals = relationship("FinancialGoal", back_populates="user")
    
# Portfolio model
class Portfolio(Base):
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="portfolios")
    assets = relationship("Asset", back_populates="portfolio")

# Asset model
class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    asset_type = Column(String, index=True)  # stock, bond, real_estate, cash, etc.
    ticker_symbol = Column(String, nullable=True)
    quantity = Column(Float)
    purchase_price = Column(Float)
    current_price = Column(Float)
    purchase_date = Column(DateTime(timezone=True))
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    portfolio = relationship("Portfolio", back_populates="assets")

# Financial Goal model
class FinancialGoal(Base):
    __tablename__ = "financial_goals"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)
    target_date = Column(DateTime(timezone=True))
    priority = Column(String)  # high, medium, low
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="financial_goals")

# Transaction model
class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    transaction_type = Column(String)  # buy, sell, dividend, deposit, withdrawal
    amount = Column(Float)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    transaction_date = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User")
    asset = relationship("Asset")

# Subscription Plan model
class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    price = Column(Float)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    payments = relationship("SubscriptionPayment", back_populates="plan")

# Subscription Payment model
class SubscriptionPayment(Base):
    __tablename__ = "subscription_payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"))
    payment_reference = Column(String, unique=True, index=True)  # UTR or transaction ref
    status = Column(String, default="pending")  # pending, verified
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User")
    plan = relationship("SubscriptionPlan", back_populates="payments") 