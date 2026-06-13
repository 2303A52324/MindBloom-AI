import re

HARD_CRISIS_PATTERNS = [
    r'\b(suicide)\b',
    r'\b(kill myself)\b',
    r'\b(end it all)\b',
    r'\b(want to die)\b',
    r'\b(harm myself)\b',
    r'\b(cut myself)\b',
    r'\b(jump off)\b',
    r'\b(overdose)\b',
    r'\b(shoot myself)\b',
    r'\b(take my own life)\b',
    r'\b(better off dead)\b',
    r'\b(no reason to live)\b',
    r'\b(make the pain stop)\b',
    r'\b(can\'t go on anymore)\b'
]

SOFT_CRISIS_PATTERNS = {
    r'\b(hopeless)\b': 0.3,
    r'\b(burden)\b': 0.3,
    r'\b(trapped)\b': 0.3,
    r'\b(can\'t take this)\b': 0.4,
    r'\b(giving up)\b': 0.4,
    r'\b(pointless)\b': 0.2,
    r'\b(alone)\b': 0.1,
    r'\b(pain)\b': 0.2,
    r'\b(tired of living)\b': 0.5
}

def analyze_crisis(text: str):
    text_lower = text.lower()
    
    # Check hard patterns
    for pattern in HARD_CRISIS_PATTERNS:
        if re.search(pattern, text_lower):
            return {"crisis_score": 1.0, "is_crisis": True, "crisis_tier": "Hard"}
            
    # Check soft patterns and accumulate score
    score = 0.0
    for pattern, weight in SOFT_CRISIS_PATTERNS.items():
        if re.search(pattern, text_lower):
            score += weight
            
    # Cap score at 1.0
    score = min(score, 1.0)
    
    is_crisis = score >= 0.75
    tier = "Soft" if is_crisis else "None"
    
    return {"crisis_score": score, "is_crisis": is_crisis, "crisis_tier": tier}
