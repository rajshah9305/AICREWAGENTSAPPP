import asyncio
from typing import Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.crud.crew import update_crew_run_status, get_crew_by_identifier
from app.services.ws_manager import ConnectionManager, WebSocketCallbackHandler
from app.crews.market_researcher import MarketResearcherCrew
from app.crews.blog_writer import BlogWriterCrew
from app.crews.travel_planner import TravelPlannerCrew


class CrewRunner:
    def __init__(self):
        self.crew_registry = {
            "market_research_crew": MarketResearcherCrew,
            "blog_writer_crew": BlogWriterCrew,
            "travel_planner_crew": TravelPlannerCrew,
        }

    async def run_crew(
        self,
        run_id: UUID,
        crew_identifier: str,
        inputs: Dict[str, Any],
        ws_manager: ConnectionManager
    ):
        """Execute a crew with WebSocket callbacks for real-time updates"""
        db = SessionLocal()
        
        try:
            # Update status to RUNNING
            update_crew_run_status(db, run_id, "RUNNING")
            
            # Create WebSocket callback handler
            callback_handler = WebSocketCallbackHandler(str(run_id), ws_manager)
            
            # Get crew class from registry
            if crew_identifier not in self.crew_registry:
                raise ValueError(f"Unknown crew identifier: {crew_identifier}")
            
            crew_class = self.crew_registry[crew_identifier]
            
            # Initialize and run the crew
            crew_instance = crew_class(callback_handler)
            
            await callback_handler.on_agent_start("System", f"Starting {crew_identifier}")
            
            # Execute the crew
            result = await crew_instance.execute(inputs)
            
            # Update database with result
            update_crew_run_status(db, run_id, "COMPLETED", result)
            
            # Send completion message via WebSocket
            await callback_handler.on_task_complete(result)
            
        except Exception as e:
            # Update database with error
            error_msg = str(e)
            update_crew_run_status(db, run_id, "FAILED", error_msg)
            
            # Send error message via WebSocket
            callback_handler = WebSocketCallbackHandler(str(run_id), ws_manager)
            await callback_handler.on_error(error_msg)
            
        finally:
            db.close()


# Global crew runner instance
crew_runner = CrewRunner()


async def execute_crew_task(
    run_id: UUID,
    crew_identifier: str,
    inputs: Dict[str, Any],
    ws_manager: ConnectionManager
):
    """Background task to execute crew"""
    await crew_runner.run_crew(run_id, crew_identifier, inputs, ws_manager)