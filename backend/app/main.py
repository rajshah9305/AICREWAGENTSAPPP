from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.api.auth_router import router as auth_router
from app.api.crews_router import router as crews_router
from app.services.ws_manager import manager
from app.db.session import get_db
from app.crud.crew import get_crew_run
from app.core.auth import get_current_user
from app.schemas.user import User

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered SaaS application for executing complex business tasks using pre-configured AI agent teams",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["authentication"])
app.include_router(crews_router, prefix=f"{settings.API_V1_STR}/crews", tags=["crews"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to CrewDeck API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "CrewDeck API"}


@app.get("/favicon.ico")
async def favicon():
    """Favicon endpoint to prevent 404 errors"""
    return {"message": "No favicon"}


@app.websocket("/ws/runs/{run_id}")
async def websocket_endpoint(websocket: WebSocket, run_id: str, db: Session = Depends(get_db)):
    """WebSocket endpoint for real-time crew execution updates"""
    try:
        # Verify that the run exists
        crew_run = get_crew_run(db, run_id)
        if not crew_run:
            await websocket.close(code=4004, reason="Run not found")
            return
        
        # Connect to WebSocket
        await manager.connect(websocket, run_id)
        
        # Send initial connection message
        await manager.send_personal_message({
            "type": "connected",
            "message": f"Connected to run {run_id}",
            "run_status": crew_run.status
        }, run_id)
        
        # Keep connection alive and handle messages
        while True:
            try:
                # Wait for messages from client (if any)
                data = await websocket.receive_text()
                # Echo back or handle client messages if needed
                await manager.send_personal_message({
                    "type": "echo",
                    "message": f"Received: {data}"
                }, run_id)
            except WebSocketDisconnect:
                break
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, run_id)
    except Exception as e:
        # Handle any other errors
        await manager.send_personal_message({
            "type": "error",
            "message": f"WebSocket error: {str(e)}"
        }, run_id)
        manager.disconnect(websocket, run_id)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)