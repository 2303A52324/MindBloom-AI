import re

INTENT_PATTERNS = {
    'crisis': r'\b(suicide|kill myself|end it all|want to die|harm myself|cut myself)\b',
    'seeking_help': r'\b(help me|need help|counselor|therapist|support|talk to someone)\b',
    'venting': r'\b(so frustrated|annoyed|just want to say|can\'t stand|hate it)\b',
    'anxiety': r'\b(anxious|panic|worried|nervous|overwhelmed|stress)\b',
    'depression': r'\b(depressed|sad|hopeless|worthless|can\'t get out of bed)\b',
    'loneliness': r'\b(lonely|alone|no one cares|isolated)\b',
    'positive': r'\b(feeling better|good|great|happy|thank you|thanks)\b',
    'greeting': r'\b(hello|hi|hey|good morning|good evening)\b'
}

def analyze_intent(text: str):
    text_lower = text.lower()
    
    detected_intents = []
    
    for intent, pattern in INTENT_PATTERNS.items():
        if re.search(pattern, text_lower):
            detected_intents.append(intent)
            
    if not detected_intents:
        return "unknown", 0.0
        
    # Simply return the first matched intent and a high confidence if matched via regex
    # Priority could be improved by order or weight, but for now simple match is ok.
    # Crisis intent should always take priority if multiple match
    if 'crisis' in detected_intents:
        return 'crisis', 1.0
        
    return detected_intents[0], 0.8
