import random

RESPONSES = {
    'crisis': [
        "I'm so sorry you're feeling this way. Please know you're not alone and there is help available right now. Please consider reaching out to a professional or someone you trust.",
        "Your life has value, and things can get better. I strongly encourage you to talk to a counselor or call a helpline. We care about you.",
        "It sounds like you're going through an incredibly dark time. Please reach out to one of the helplines provided. There are people who want to support you through this."
    ],
    'seeking_help': [
        "It takes courage to ask for help. A mental health professional can provide you with the tools you need. Would you like me to show you some resources?",
        "I'm here to listen, but speaking with a therapist or counselor could give you more targeted support. Let's look at some options together.",
        "Seeking help is a positive step. I can help connect you with professional resources if you'd like."
    ],
    'venting': [
        "I hear you. It's completely understandable to feel frustrated. Feel free to let it all out here.",
        "That sounds really difficult to deal with. It makes sense that you're annoyed.",
        "I'm listening. Sometimes just getting these feelings out can take some of the weight off."
    ],
    'anxiety': [
        "It sounds like you're feeling very overwhelmed right now. Try taking a slow, deep breath with me: breathe in for 4 seconds, hold for 4, and exhale for 4.",
        "Anxiety can be exhausting. Remember that this feeling is temporary and it will pass. What's one small thing you can do right now to ground yourself?",
        "I hear how stressed you are. It's okay to feel anxious. Let's try to focus on the present moment."
    ],
    'depression': [
        "I'm so sorry you're carrying this heavy feeling. It's okay to not be okay. I'm here with you.",
        "Depression can make everything feel impossible. Please be gentle with yourself today. Even small steps are victories.",
        "I hear your pain. You don't have to go through this alone. I'm here to listen whenever you need."
    ],
    'loneliness': [
        "Feeling lonely is really hard. Please know that I'm here listening to you right now.",
        "It's tough when you feel like no one understands or is there for you. I'm here. You matter.",
        "Loneliness can be a heavy burden. Connecting with others, even in small ways, can sometimes help. For now, I'm glad you reached out here."
    ],
    'positive': [
        "That's wonderful to hear! I'm glad you're feeling good.",
        "It's so important to recognize these positive moments. Thank you for sharing that with me!",
        "I love hearing that. Let's keep this positive momentum going!"
    ],
    'greeting': [
        "Hello! How are you feeling today?",
        "Hi there. I'm here to listen and support you. What's on your mind?",
        "Welcome back. How have things been since we last talked?"
    ],
    'unknown': [
        "I hear you. Could you tell me a little more about how that makes you feel?",
        "Thank you for sharing that. I'm listening.",
        "I'm here for you. How are you coping with that right now?"
    ]
}

def generate_response(intent: str, is_crisis: bool):
    if is_crisis:
        return random.choice(RESPONSES['crisis'])
        
    if intent in RESPONSES:
        return random.choice(RESPONSES[intent])
        
    return random.choice(RESPONSES['unknown'])
