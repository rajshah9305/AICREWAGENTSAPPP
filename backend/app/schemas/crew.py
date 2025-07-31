from pydantic import BaseModel
from typing import Dict, Any, Optional
from uuid import UUID
from datetime import datetime


class CrewBase(BaseModel):
    name: str
    description: str
    crew_identifier: str
    credits_required: int
    is_single_agent: bool = False


class Crew(CrewBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class CrewRunCreate(BaseModel):
    inputs: Dict[str, Any]


class CrewRunBase(BaseModel):
    inputs: Dict[str, Any]
    status: str


class CrewRun(CrewRunBase):
    id: UUID
    user_id: UUID
    crew_id: int
    output: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    crew: Crew

    class Config:
        from_attributes = True


class CrewRunStatus(BaseModel):
    id: UUID
    status: str
    output: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None