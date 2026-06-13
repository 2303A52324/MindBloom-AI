import re

EMOTION_KEYWORDS = {
    'sadness': [r'\b(sad|crying|tears|unhappy|down|blue)\b'],
    'anger': [r'\b(angry|mad|furious|rage|annoyed|irritated)\b'],
    'fear': [r'\b(afraid|scared|terrified|fear|panic)\b'],
    'joy': [r'\b(happy|joy|glad|excited|thrilled|great)\b'],
    'disgust': [r'\b(disgust|gross|awful|hate)\b'],
    'surprise': [r'\b(surprised|shocked|amazed|wow)\b'],
    'shame': [r'\b(ashamed|guilty|embarrassed|regret)\b'],
    'loneliness': [r'\b(lonely|alone|isolated|ignored)\b']
}

def analyze_emotion(text: str):
    text_lower = text.lower()
    
    detected_emotions = []
    
    for emotion, patterns in EMOTION_KEYWORDS.items():
        for pattern in patterns:
            if re.search(pattern, text_lower):
                detected_emotions.append(emotion)
                
    if not detected_emotions:
        return "neutral", 0.0
        
    # Return the first detected emotion and a basic confidence
    return detected_emotions[0], 0.7
