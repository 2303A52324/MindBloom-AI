import nltk
import ssl
from nltk.sentiment.vader import SentimentIntensityAnalyzer

# Workaround for SSL download issues
try:
    _create_unverified_https_context = ssl._create_unverified_context
except AttributeError:
    pass
else:
    ssl._create_default_https_context = _create_unverified_https_context

# Download VADER lexicon
nltk.download('vader_lexicon', quiet=True)

# Custom mental health lexicon
custom_lexicon = {
    'hopeless': -3.5,
    'suicidal': -4.0,
    'kill myself': -4.0,
    'worthless': -3.0,
    'trapped': -2.5,
    'burden': -2.5,
    'anxious': -2.0,
    'panic': -2.5,
    'depressed': -2.5,
    'lonely': -1.5,
    'better': 1.5,
    'good': 1.0,
    'hopeful': 2.0,
    'calm': 1.5,
    'safe': 2.0,
}

analyzer = SentimentIntensityAnalyzer()
analyzer.lexicon.update(custom_lexicon)

def analyze_sentiment(text: str):
    scores = analyzer.polarity_scores(text)
    compound = scores['compound']
    
    if compound >= 0.05:
        sentiment = 'positive'
    elif compound <= -0.05:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
        
    return {
        "sentiment": sentiment,
        "sentiment_score": compound,
        "sentiment_detail": scores
    }
