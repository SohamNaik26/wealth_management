from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..db.database import get_db
from ..models.models import User, FinancialGoal
from ..models.schemas import FinancialGoalCreate, FinancialGoalResponse
from ..services.auth import get_current_active_user

router = APIRouter(
    prefix="/goals",
    tags=["financial_goals"],
)

@router.post("/", response_model=FinancialGoalResponse, status_code=status.HTTP_201_CREATED)
def create_goal(
    goal: FinancialGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_goal = FinancialGoal(
        name=goal.name,
        description=goal.description,
        target_amount=goal.target_amount,
        current_amount=goal.current_amount,
        target_date=goal.target_date,
        priority=goal.priority,
        user_id=current_user.id
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.get("/", response_model=List[FinancialGoalResponse])
def read_goals(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    goals = db.query(FinancialGoal).filter(FinancialGoal.user_id == current_user.id).offset(skip).limit(limit).all()
    return goals

@router.get("/{goal_id}", response_model=FinancialGoalResponse)
def read_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    goal = db.query(FinancialGoal).filter(
        FinancialGoal.id == goal_id,
        FinancialGoal.user_id == current_user.id
    ).first()
    
    if goal is None:
        raise HTTPException(status_code=404, detail="Financial goal not found")
    return goal

@router.put("/{goal_id}", response_model=FinancialGoalResponse)
def update_goal(
    goal_id: int,
    goal: FinancialGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_goal = db.query(FinancialGoal).filter(
        FinancialGoal.id == goal_id,
        FinancialGoal.user_id == current_user.id
    ).first()
    
    if db_goal is None:
        raise HTTPException(status_code=404, detail="Financial goal not found")
    
    db_goal.name = goal.name
    db_goal.description = goal.description
    db_goal.target_amount = goal.target_amount
    db_goal.current_amount = goal.current_amount
    db_goal.target_date = goal.target_date
    db_goal.priority = goal.priority
    
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.patch("/{goal_id}/progress", response_model=FinancialGoalResponse)
def update_goal_progress(
    goal_id: int,
    current_amount: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_goal = db.query(FinancialGoal).filter(
        FinancialGoal.id == goal_id,
        FinancialGoal.user_id == current_user.id
    ).first()
    
    if db_goal is None:
        raise HTTPException(status_code=404, detail="Financial goal not found")
    
    db_goal.current_amount = current_amount
    
    db.commit()
    db.refresh(db_goal)
    return db_goal

@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_goal = db.query(FinancialGoal).filter(
        FinancialGoal.id == goal_id,
        FinancialGoal.user_id == current_user.id
    ).first()
    
    if db_goal is None:
        raise HTTPException(status_code=404, detail="Financial goal not found")
    
    db.delete(db_goal)
    db.commit()
    return None 