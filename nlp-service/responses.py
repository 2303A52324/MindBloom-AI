import random

RESPONSES = {
    'crisis': [
        "I am so sorry you're feeling this way, but please know that this darkness is temporary and your life has immense value. When everything feels overwhelming, the strongest thing you can do is let someone help you carry the weight. Please reach out to a crisis helpline or a professional immediately. You are not alone in this, and there is a path forward, even if you can't see it right now."
    ],
    'seeking_help': [
        "It takes immense courage to ask for help, and you should be proud of yourself for taking this step. Connecting with a mental health professional is the most effective way to equip yourself with the right tools to overcome what you're facing. I recommend starting by speaking to a therapist or counselor who can offer targeted, actionable support. Let's focus on taking that brave first step together."
    ],
    'venting': [
        "It is completely valid to feel frustrated, and getting it out is the first step to processing it. Now that you've released some of that energy, let's pivot to finding a solution. Take a moment to step back and identify the root cause of this frustration. What is one small, actionable boundary you can set or step you can take today to prevent this situation from affecting your peace of mind again?"
    ],
    'anxiety': [
        "Anxiety can feel completely overwhelming, but remember that it is just a feeling and it does not control you. Let's break this down into manageable steps. First, take a slow, deep breath: inhale for 4 seconds, hold for 4, and exhale for 4. Second, identify one single thing you can control right now and focus all your energy on that. You have survived every anxious moment before this, and you have the strength to overcome this one too."
    ],
    'depression': [
        "I hear how heavy things feel right now, but please remember that depression lies to you by making things seem impossible. You have the strength to get through this. Start by setting incredibly small, achievable goals for today—even if it's just drinking a glass of water or stepping outside for two minutes. Celebrate those small victories. Healing isn't linear, but every tiny step you take is a profound act of resilience."
    ],
    'loneliness': [
        "Loneliness can be incredibly painful, but feeling disconnected right now does not mean you are unloved or isolated forever. The best way to combat loneliness is through small, intentional acts of connection. Try reaching out to just one person today with a simple message, or engage in a community activity where you share an interest with others. You are worthy of connection, and taking that first small step will remind you of the community that exists around you."
    ],
    'positive': [
        "That is absolutely wonderful to hear! Recognizing and celebrating these positive moments is crucial for building long-term mental resilience. Take a mental snapshot of how good you feel right now. To keep this momentum going, write down exactly what led to this positive feeling so you can intentionally recreate it in the future. Keep up the fantastic work!"
    ],
    'greeting': [
        "Hello! I am MindBloom, your proactive problem-solving assistant. I'm here to help you navigate whatever challenges you're facing today. Tell me what's on your mind, and let's work together to find actionable solutions and build your resilience."
    ],
    'unknown': [
        "I understand what you're saying, but to help me give you the best possible advice and actionable solutions, could you break down exactly what you're struggling with right now? What is the main obstacle you are facing, and what would an ideal outcome look like for you?"
    ]
}

def generate_response(intent: str, is_crisis: bool, expression: str = None):
    if is_crisis:
        return random.choice(RESPONSES['crisis'])
        
    # Handle facial expressions dynamically for generic conversations
    if expression and expression in ['sad', 'angry', 'fearful', 'happy', 'surprised']:
        if intent == 'greeting' or intent == 'proactive_expression':
            if expression == 'sad':
                return "Hello. I notice from your expression that you're feeling a bit down. That's okay, but let's change that trajectory. Let's identify what's dragging you down and figure out a concrete plan to tackle it. What can we solve together today?"
            elif expression == 'angry':
                return "Hi there. I notice you look frustrated. Harness that energy to make a change. What is the root cause of this frustration, and what is one step we can take right now to resolve it?"
            elif expression == 'fearful':
                return "Hello. You look a bit anxious. Take a deep breath—you are in a safe space and you are capable of handling whatever is in front of you. Let's break down whatever is worrying you into small, manageable steps."
            elif expression == 'happy':
                return "Hi! It is wonderful to see a smile on your face today. Let's leverage this positive energy to tackle your goals and continue building your resilience!"
            elif expression == 'surprised':
                return "Hello! You look surprised. Whether it's a good surprise or a challenging one, let's process it together and plan our next move. Tell me all about it!"
        
        elif intent == 'unknown':
            if expression == 'sad':
                return "I hear you, and I notice you look sad. Let's not stay in this place though. What is the one thing causing this sadness that we can actively work on improving today?"
            elif expression == 'angry':
                return "I notice you look angry. Anger often points us directly to what needs changing. What boundary was crossed, and how can we proactively fix this situation?"
            elif expression == 'fearful':
                return "I can see some tension or fear in your face. Fear is just a signal to prepare. Let's map out exactly what you're afraid of and build a solid plan to conquer it."
            elif expression == 'happy':
                return "It's great to see you looking happy as you share this! Positive reinforcement is key. Let's keep this momentum going!"
            elif expression == 'surprised':
                return "I notice a look of surprise on your face. Let's analyze what just happened and figure out how to adapt to it effectively."

    if intent in RESPONSES:
        return random.choice(RESPONSES[intent])
        
    return random.choice(RESPONSES['unknown'])
