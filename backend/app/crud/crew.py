from sqlalchemy.orm import Session
from app.db.models import Crew, CrewRun
from app.schemas.crew import CrewRunCreate
from typing import Optional, List
from uuid import UUID
import uuid


def get_crews(db: Session) -> List[Crew]:
    """Get all crews"""
    return db.query(Crew).all()


def get_crew(db: Session, crew_id: int) -> Optional[Crew]:
    """Get crew by ID"""
    return db.query(Crew).filter(Crew.id == crew_id).first()


def get_crew_by_identifier(db: Session, crew_identifier: str) -> Optional[Crew]:
    """Get crew by identifier"""
    return db.query(Crew).filter(Crew.crew_identifier == crew_identifier).first()


def create_crew_run(db: Session, user_id: UUID, crew_id: int, crew_run_data: CrewRunCreate) -> CrewRun:
    """Create a new crew run"""
    db_crew_run = CrewRun(
        id=uuid.uuid4(),
        user_id=user_id,
        crew_id=crew_id,
        inputs=crew_run_data.inputs,
        status="PENDING"
    )
    db.add(db_crew_run)
    db.commit()
    db.refresh(db_crew_run)
    return db_crew_run


def get_crew_run(db: Session, run_id) -> Optional[CrewRun]:
    """Get a crew run by ID"""
    try:
        if isinstance(run_id, str):
            run_uuid = UUID(run_id)
        else:
            run_uuid = run_id
        return db.query(CrewRun).filter(CrewRun.id == run_uuid).first()
    except (ValueError, TypeError):
        return None


def update_crew_run_status(db: Session, run_id, status: str, output: str = None) -> Optional[CrewRun]:
    """Update crew run status and output"""
    try:
        if isinstance(run_id, str):
            run_uuid = UUID(run_id)
        else:
            run_uuid = run_id
        crew_run = db.query(CrewRun).filter(CrewRun.id == run_uuid).first()
    except (ValueError, TypeError):
        return None
    if crew_run:
        crew_run.status = status
        if output:
            crew_run.output = output
        if status == "COMPLETED":
            from datetime import datetime
            crew_run.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(crew_run)
    return crew_run