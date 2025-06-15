# ============================================================================
# GOOGLE COLAB MEDICAL CHATBOT - COMPLETE INTEGRATION
# Copy this entire code to your Google Colab notebook
# ============================================================================

import ollama
import json
import sqlite3
import uuid
from datetime import datetime
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
import threading
from pyngrok import ngrok
import time

# ============================================================================
# MEDICAL CHATBOT CLASS (Keep your existing class - it's perfect!)
# ============================================================================

class MedicalChatbotColab:
    def __init__(self):
        self.client = ollama.Client()
        self.setup_database()
        self.medical_specialists = {
            'neurologue': ['tête', 'vertige', 'migraine', 'neurologique', 'mal de tête'],
            'cardiologue': ['cœur', 'poitrine', 'palpitation', 'cardiaque', 'thorax'],
            'gastro-entérologue': ['ventre', 'estomac', 'digestif', 'nausée', 'abdomen'],
            'dermatologue': ['peau', 'éruption', 'dermatologique', 'acné'],
            'gynécologue': ['menstruel', 'gynécologique', 'femme', 'règles', 'utérus'],
            'urologue': ['urinaire', 'rein', 'vessie', 'prostate'],
            'pneumologue': ['respiration', 'poumon', 'toux', 'asthme'],
            'rhumatologue': ['articulation', 'douleur', 'arthrite', 'os'],
            'endocrinologue': ['diabète', 'thyroïde', 'hormonal', 'sucre'],
            'psychiatre': ['anxiété', 'dépression', 'mental', 'stress'],
            'orl': ['oreille', 'nez', 'gorge', 'sinusite'],
            'ophtalmologue': ['yeux', 'vision', 'vue', 'œil'],
            'médecin généraliste': ['général', 'consultation', 'fatigue']
        }
    
    def setup_database(self):
        """Initialize SQLite database for Colab"""
        self.conn = sqlite3.connect('medical_chatbot.db', check_same_thread=False)
        cursor = self.conn.cursor()
        
        # Create chat_history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                conversation_id TEXT NOT NULL,
                patient_id TEXT NOT NULL,
                message TEXT NOT NULL,
                sender TEXT CHECK(sender IN ('user', 'assistant')) NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Create index for performance
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_conversation_patient 
            ON chat_history(conversation_id, patient_id)
        ''')
        
        self.conn.commit()
        print("✅ Database initialized")
    
    def get_conversation_history(self, conversation_id, patient_id, limit=20):
        """Retrieve conversation history"""
        cursor = self.conn.cursor()
        cursor.execute('''
            SELECT message, sender, timestamp FROM chat_history 
            WHERE conversation_id = ? AND patient_id = ? 
            ORDER BY timestamp ASC LIMIT ?
        ''', (conversation_id, patient_id, limit))
        
        return cursor.fetchall()
    
    def save_message(self, conversation_id, patient_id, message, sender):
        """Save message to database"""
        cursor = self.conn.cursor()
        cursor.execute('''
            INSERT INTO chat_history (conversation_id, patient_id, message, sender)
            VALUES (?, ?, ?, ?)
        ''', (conversation_id, patient_id, message, sender))
        self.conn.commit()
    
    def detect_medical_specialty(self, message):
        """Detect appropriate medical specialist"""
        message_lower = message.lower()
        
        for specialist, keywords in self.medical_specialists.items():
            for keyword in keywords:
                if keyword in message_lower:
                    return specialist, f"pour les problèmes de {keyword}"
        
        return "médecin généraliste", "pour une consultation générale"
    
    def format_bold_text(self, text):
        """Add bold formatting to important medical terms"""
        medical_terms = [
            'urgent', 'important', 'consultation', 'médecin', 'docteur',
            'symptômes', 'douleur', 'traitement', 'médicament', 'urgence',
            'neurologue', 'cardiologue', 'gastro-entérologue', 'dermatologue',
            'gynécologue', 'urologue', 'pneumologue', 'rhumatologue',
            'endocrinologue', 'psychiatre', 'orl', 'ophtalmologue',
            '24h', '48h', '72h', 'heures', 'jours', 'semaines'
        ]
        
        for term in medical_terms:
            # Case-insensitive replacement with bold formatting
            pattern = re.compile(re.escape(term), re.IGNORECASE)
            text = pattern.sub(f'**{term}**', text)
        
        return text
    
    def generate_medical_response(self, message, conversation_id, patient_id, language="fr"):
        """Generate medical response with context and recommendations"""
        try:
            # Get conversation history
            history = self.get_conversation_history(conversation_id, patient_id)
            
            # Build conversation context
            system_prompt = """Tu es un assistant médical IA spécialisé en français. Tes réponses doivent:
            
1. TOUJOURS inclure des disclaimers médicaux appropriés
2. Recommander des spécialistes médicaux quand nécessaire
3. Utiliser un formatage en gras pour les informations importantes
4. Ne JAMAIS donner de diagnostic direct
5. Être empathique et professionnel
6. Répondre en français ou darija marocain selon la langue de l'utilisateur
7. Te souvenir de l'historique de conversation pour éviter de répéter les mêmes questions

Format de réponse souhaité:
- Réponse empathique à la question
- Conseils généraux appropriés
- 👨‍⚕️ **Recommandation médicale**: [Spécialiste recommandé]
- ⚠️ **Rappel**: Consultez toujours un **professionnel de santé**"""

            if language == "ar":
                system_prompt = """أنت مساعد طبي ذكي متخصص في اللغة العربية والدارجة المغربية. يجب أن تكون إجاباتك:

1. تتضمن دائماً تنبيهات طبية مناسبة
2. توصي بالأطباء المختصين عند الضرورة
3. تستخدم التنسيق الغامق للمعلومات المهمة
4. لا تعطي تشخيصاً مباشراً أبداً
5. تكون متعاطفة ومهنية
6. تجيب بالدارجة المغربية
7. تتذكر تاريخ المحادثة لتجنب تكرار نفس الأسئلة

تنسيق الإجابة المطلوب:
- إجابة متعاطفة للسؤال
- نصائح عامة مناسبة
- 👨‍⚕️ **نصيحة طبية**: [الطبيب المختص الموصى به]
- ⚠️ **تذكير**: شوف دائماً **طبيب مختص**"""
            
            context_messages = [{"role": "system", "content": system_prompt}]
            
            # Add conversation history
            for msg, sender, timestamp in history:
                role = "user" if sender == "user" else "assistant"
                context_messages.append({"role": role, "content": msg})
            
            # Add current message
            context_messages.append({"role": "user", "content": message})
            
            # Generate response using phi3:mini
            response = self.client.chat(
                model='phi3:mini',
                messages=context_messages,
                options={
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "max_tokens": 500
                }
            )
            
            ai_response = response['message']['content']
            
            # Detect and add specialist recommendation if not present
            if "👨‍⚕️" not in ai_response:
                specialist, reason = self.detect_medical_specialty(message)
                if language == "ar":
                    specialist_recommendation = f"\n\n👨‍⚕️ **نصيحة طبية**: نصحك تشوف **{specialist}** {reason}."
                else:
                    specialist_recommendation = f"\n\n👨‍⚕️ **Recommandation médicale**: Je vous conseille de consulter un **{specialist}** {reason}."
                ai_response += specialist_recommendation
            
            # Add medical disclaimer if not present
            disclaimer_check = "professionnel de santé" if language == "fr" else "طبيب مختص"
            if disclaimer_check not in ai_response.lower():
                if language == "ar":
                    ai_response += "\n\n⚠️ **تذكير**: هاد المحادثة غير للمعلومات فقط. **شوف طبيب مختص** لأي مشكل صحي."
                else:
                    ai_response += "\n\n⚠️ **Rappel**: Cette conversation est à titre informatif uniquement. **Consultez un professionnel de santé** pour tout problème médical."
            
            # Format bold text
            ai_response = self.format_bold_text(ai_response)
            
            # Save messages to database
            self.save_message(conversation_id, patient_id, message, 'user')
            self.save_message(conversation_id, patient_id, ai_response, 'assistant')
            
            return {
                "response": ai_response,
                "conversation_id": conversation_id,
                "status": "success",
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            error_msg = f"Désolé, une erreur s'est produite: {str(e)}. Veuillez réessayer."
            return {
                "response": error_msg,
                "conversation_id": conversation_id,
                "status": "error",
                "timestamp": datetime.now().isoformat()
            }

# ============================================================================
# FASTAPI MODELS (Required for your Windows backend integration)
# ============================================================================

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    patient_id: Optional[str] = "default_patient"
    language: Optional[str] = "fr"

class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    patient_id: str
    status: str
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    model: str
    server: str
    timestamp: str

class ConversationHistory(BaseModel):
    conversation_id: str
    patient_id: str
    history: List[dict]

# ============================================================================
# FASTAPI APPLICATION (This is what your Windows app will connect to)
# ============================================================================

# Initialize the medical chatbot
medical_bot = MedicalChatbotColab()
print("✅ Medical Chatbot initialized")

# Create FastAPI app
app = FastAPI(
    title="Medical Chatbot API - Google Colab",
    description="AI Medical Assistant API powered by phi3:mini on Google Colab",
    version="1.0.0"
)

# Add CORS middleware for Windows app integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_model=HealthResponse)
async def health_check():
    """Health check endpoint - Your Windows app will use this to test connection"""
    return HealthResponse(
        status="healthy",
        model="phi3:mini",
        server="Google Colab",
        timestamp=datetime.now().isoformat()
    )

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint - Your Windows app will send messages here"""
    try:
        # Generate conversation ID if not provided
        conversation_id = request.conversation_id or str(uuid.uuid4())
        
        # Generate response
        result = medical_bot.generate_medical_response(
            request.message,
            conversation_id,
            request.patient_id,
            request.language
        )
        
        if result["status"] == "success":
            return ChatResponse(
                response=result["response"],
                conversation_id=conversation_id,
                patient_id=request.patient_id,
                status="success",
                timestamp=result["timestamp"]
            )
        else:
            raise HTTPException(status_code=500, detail=result["response"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations/{conversation_id}")
async def get_conversation_history(conversation_id: str, patient_id: str = "default_patient"):
    """Get conversation history - Your Windows app can retrieve chat history"""
    try:
        history = medical_bot.get_conversation_history(conversation_id, patient_id)
        return {
            "conversation_id": conversation_id,
            "patient_id": patient_id,
            "history": [
                {
                    "message": msg,
                    "sender": sender,
                    "timestamp": timestamp
                }
                for msg, sender, timestamp in history
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reset-conversation")
async def reset_conversation():
    """Create new conversation ID"""
    new_conversation_id = str(uuid.uuid4())
    return {
        "conversation_id": new_conversation_id,
        "status": "success",
        "message": "New conversation started",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/status")
async def get_detailed_status():
    """Detailed status endpoint for monitoring"""
    try:
        # Test ollama connection
        test_response = medical_bot.client.chat(
            model='phi3:mini',
            messages=[{"role": "user", "content": "test"}],
            options={"max_tokens": 10}
        )
        ollama_status = "connected"
    except:
        ollama_status = "disconnected"
    
    return {
        "api_status": "healthy",
        "model": "phi3:mini",
        "ollama_status": ollama_status,
        "server": "Google Colab",
        "database": "SQLite",
        "timestamp": datetime.now().isoformat()
    }

# ============================================================================
# SERVER STARTUP (This creates your API URL)
# ============================================================================

def start_api_server():
    """Start the FastAPI server and create public URL"""
    
    print("🚀 Starting Medical Chatbot API Server...")
    
    # Start FastAPI server in background
    def run_fastapi_server():
        uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")

    # Start server in background thread
    server_thread = threading.Thread(target=run_fastapi_server, daemon=True)
    server_thread.start()

    # Wait for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(8)

    # Create public URL with ngrok
    try:
        print("🌐 Creating public URL with ngrok...")
        
        # Optional: Set ngrok auth token for better stability
        # ngrok.set_auth_token("your_ngrok_token_here")
        
        public_url = ngrok.connect(8000)
        
        print(f"""
        ✅ SUCCESS! Your Medical Chatbot API is now running!
        
        📍 Local URL: http://localhost:8000
        🌐 Public URL: {public_url}
        📖 API Documentation: {public_url}/docs
        🔍 Health Check: {public_url}/
        💬 Chat Endpoint: {public_url}/chat
        
        ⚠️ IMPORTANT: Copy this URL to your Windows .env file:
        COLAB_API_URL={public_url}
        
        🔧 Test your API:
        curl {public_url}/
        """)
        
        # Save URL to file for easy access
        with open('api_url.txt', 'w') as f:
            f.write(f"COLAB_API_URL={public_url}\n")
            f.write(f"DOCS_URL={public_url}/docs\n")
            f.write(f"HEALTH_URL={public_url}/\n")
            f.write(f"CHAT_URL={public_url}/chat\n")
        
        print("💾 API URLs saved to 'api_url.txt' file")
        
        return public_url
        
    except Exception as e:
        print(f"❌ Error creating public URL: {e}")
        print("💡 You can still use the local URL: http://localhost:8000")
        print("💡 Make sure you have internet connection for ngrok")
        return None

# ============================================================================
# START THE API SERVER
# ============================================================================

if __name__ == "__main__":
    api_url = start_api_server()
    
    if api_url:
        print(f"""
        🎉 Setup Complete! 
        
        Next steps:
        1. Copy this URL: {api_url}
        2. Add to your Windows .env file: COLAB_API_URL={api_url}
        3. Set COLAB_ENABLED=true in your .env file
        4. Restart your Windows backend server
        5. Test the integration!
        
        ⚠️ Keep this Colab notebook running for the API to work!
        """)
    else:
        print("""
        ⚠️ Public URL creation failed, but local server is running.
        You can still test locally at: http://localhost:8000
        """)

# Start the server automatically
start_api_server() 