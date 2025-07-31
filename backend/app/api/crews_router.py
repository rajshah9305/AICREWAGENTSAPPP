from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.schemas.crew import Crew, CrewRun, CrewRunCreate, CrewRunStatus
from app.schemas.user import User
from app.crud.crew import get_crews, get_crew, create_crew_run, get_crew_run
from app.crud.user import deduct_user_credits
from app.core.auth import get_current_user
from app.services.crew_runner import execute_crew_task
from app.services.ws_manager import manager

router = APIRouter()


@router.get("/", response_model=List[Crew])
async def get_available_crews(db: Session = Depends(get_db)):
    """Get list of all available crews"""
    crews = get_crews(db)
    return crews


@router.post("/{crew_id}/run", response_model=CrewRun)
async def run_crew(
    crew_id: int,
    crew_run_data: CrewRunCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute a crew task"""
    # Get crew information
    crew = get_crew(db, crew_id)
    if not crew:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crew not found"
        )
    
    # Check if user has enough credits
    if current_user.credits < crew.credits_required:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient credits. Required: {crew.credits_required}, Available: {current_user.credits}"
        )
    
    # Deduct credits from user
    updated_user = deduct_user_credits(db, current_user.id, crew.credits_required)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to deduct credits"
        )
    
    # Create crew run record
    crew_run = create_crew_run(db, current_user.id, crew_id, crew_run_data)
    
    # Start crew execution as background task
    background_tasks.add_task(
        execute_crew_task,
        crew_run.id,
        crew.crew_identifier,
        crew_run_data.inputs,
        manager
    )
    
    return crew_run


@router.get("/runs/{run_id}", response_model=CrewRunStatus)
async def get_run_status(
    run_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the status and result of a specific crew run"""
    crew_run = get_crew_run(db, run_id)
    if not crew_run:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crew run not found"
        )
    
    # Check if the run belongs to the current user
    if crew_run.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return CrewRunStatus(
        id=crew_run.id,
        status=crew_run.status,
        output=crew_run.output,
        created_at=crew_run.created_at,
        completed_at=crew_run.completed_at
    )