from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from sentiment import analyze_sentiment
from intent import analyze_intent
from crisis import analyze_crisis
from emotion import analyze_emotion
from responses import generate_response

load_dotenv()

app = FastAPI()

# Allow CORS from the Node server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to SERVER_URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    text: str

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/analyze")
def analyze_message(req: MessageRequest):
    text = req.text
    
    # Run NLP pipeline
    sentiment_data = analyze_sentiment(text)
    intent, intent_confidence = analyze_intent(text)
    crisis_data = analyze_crisis(text)
    emotion, emotion_confidence = analyze_emotion(text)
    
    # Generate bot response based on intent and crisis status
    bot_response = generate_response(intent, crisis_data["is_crisis"])
    
    return {
        "sentiment": sentiment_data["sentiment"],
        "sentiment_score": sentiment_data["sentiment_score"],
        "sentiment_detail": sentiment_data["sentiment_detail"],
        "emotion": emotion,
        "emotion_confidence": emotion_confidence,
        "intent": intent,
        "intent_confidence": intent_confidence,
        "crisis_score": crisis_data["crisis_score"],
        "is_crisis": crisis_data["is_crisis"],
        "crisis_tier": crisis_data["crisis_tier"],
        "bot_response": bot_response
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
