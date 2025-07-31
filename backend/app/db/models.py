from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    credits = Column(Integer, default=20, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    crew_runs = relationship("CrewRun", back_populates="user")


class Crew(Base):
    __tablename__ = "crews"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    crew_identifier = Column(String, unique=True, nullable=False, index=True)
    credits_required = Column(Integer, nullable=False)
    is_single_agent = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    crew_runs = relationship("CrewRun", back_populates="crew")


class CrewRun(Base):
    __tablename__ = "crew_runs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    crew_id = Column(Integer, ForeignKey("crews.id"), nullable=False)
    inputs = Column(JSON, nullable=False)
    output = Column(Text, nullable=True)
    status = Column(String, default="PENDING", nullable=False)  # PENDING, RUNNING, COMPLETED, FAILED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="crew_runs")
    crew = relationship("Crew", back_populates="crew_runs")