from typing import Dict, List
from fastapi import WebSocket
from uuid import UUID
import json
import asyncio


class ConnectionManager:
    def __init__(self):
        # Map run_id to list of WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, run_id: str):
        await websocket.accept()
        if run_id not in self.active_connections:
            self.active_connections[run_id] = []
        self.active_connections[run_id].append(websocket)

    def disconnect(self, websocket: WebSocket, run_id: str):
        if run_id in self.active_connections:
            if websocket in self.active_connections[run_id]:
                self.active_connections[run_id].remove(websocket)
            if not self.active_connections[run_id]:
                del self.active_connections[run_id]

    async def send_personal_message(self, message: dict, run_id: str):
        if run_id in self.active_connections:
            message_str = json.dumps(message)
            # Send to all connections for this run_id
            disconnected = []
            for websocket in self.active_connections[run_id]:
                try:
                    await websocket.send_text(message_str)
                except Exception:
                    # Connection is closed, mark for removal
                    disconnected.append(websocket)
            
            # Remove disconnected websockets
            for ws in disconnected:
                self.disconnect(ws, run_id)

    async def broadcast_to_run(self, message: dict, run_id: str):
        await self.send_personal_message(message, run_id)


# Global connection manager instance
manager = ConnectionManager()


class WebSocketCallbackHandler:
    """Custom callback handler for CrewAI to send real-time updates via WebSocket"""
    
    def __init__(self, run_id: str, ws_manager: ConnectionManager):
        self.run_id = run_id
        self.ws_manager = ws_manager

    async def on_agent_start(self, agent_name: str, task: str):
        message = {
            "type": "agent_start",
            "agent": agent_name,
            "task": task,
            "timestamp": asyncio.get_event_loop().time()
        }
        await self.ws_manager.send_personal_message(message, self.run_id)

    async def on_agent_action(self, agent_name: str, action: str):
        message = {
            "type": "agent_action",
            "agent": agent_name,
            "message": action,
            "timestamp": asyncio.get_event_loop().time()
        }
        await self.ws_manager.send_personal_message(message, self.run_id)

    async def on_tool_start(self, tool_name: str, input_data: str):
        message = {
            "type": "tool_start",
            "tool": tool_name,
            "input": input_data,
            "timestamp": asyncio.get_event_loop().time()
        }
        await self.ws_manager.send_personal_message(message, self.run_id)

    async def on_tool_end(self, tool_name: str, output: str):
        message = {
            "type": "tool_end",
            "tool": tool_name,
            "output": output,
            "timestamp": asyncio.get_event_loop().time()
        }
        await self.ws_manager.send_personal_message(message, self.run_id)

    async def on_llm_chunk(self, content: str):
        message = {
            "type": "llm_chunk",
            "content": content,
            "timestamp": asyncio.get_event_loop().time()
        }
        await self.ws_manager.send_personal_message(message, self.run_id)

    async def on_task_complete(self, result: str):
        message = {
            "type": "complete",
            "result": result,
            "timestamp": asyncio.get_event_loop().time()
        }
        await self.ws_manager.send_personal_message(message, self.run_id)

    async def on_error(self, error: str):
        message = {
            "type": "error",
            "error": error,
            "timestamp": asyncio.get_event_loop().time()
        }
        await self.ws_manager.send_personal_message(message, self.run_id)