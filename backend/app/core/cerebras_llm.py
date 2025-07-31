from langchain_openai import ChatOpenAI
import os


def get_cerebras_llm():
    """Configure and return Cerebras LLM for CrewAI"""
    return ChatOpenAI(
        model="llama3.1-70b",
        api_key=os.environ.get("CEREBRAS_API_KEY"),
        base_url="https://api.cerebras.ai/v1",
        temperature=0.5,
    )