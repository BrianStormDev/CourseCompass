# Option 1: FastAPI Backend (Python)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import os
from typing import List, Dict, Any

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Claude client
client = anthropic.Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY")  # Set this in your environment
)

class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any]

class ChatResponse(BaseModel):
    response: str

@app.post("/api/claude-chat", response_model=ChatResponse)
async def chat_with_claude(request: ChatRequest):
    try:
        # Build context from the research data
        context_str = f"""
You are a helpful AI research assistant specializing in machine learning research trends. 

Current Context:
- Date: {request.context.get('date', 'N/A')}
- Recent Papers: {request.context.get('articles', [])}
- Trend Data: {request.context.get('trendData', [])}

Recent conversation:
"""
        
        # Add conversation history
        for msg in request.context.get('conversationHistory', []):
            context_str += f"{msg['role'].title()}: {msg['content']}\n"

        context_str += f"\nUser: {request.message}\n\nPlease provide a helpful response about ML research trends, papers, or related topics. Be concise but informative."

        # Call Claude API
        response = client.messages.create(
            model="claude-3-sonnet-20240229",  # or claude-3-opus-20240229 for more advanced responses
            max_tokens=1000,
            temperature=0.7,
            messages=[
                {
                    "role": "user",
                    "content": context_str
                }
            ]
        )
        
        return ChatResponse(response=response.content[0].text)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling Claude API: {str(e)}")