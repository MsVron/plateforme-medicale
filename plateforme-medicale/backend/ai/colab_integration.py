# Save this as colab_integration.py on your Windows machine
import requests
import json
import uuid
from typing import Optional, Dict, Any

class ColabMedicalChatbot:
    def __init__(self, colab_api_url: str):
        """
        Initialize connection to your Google Colab medical chatbot
        
        Args:
            colab_api_url: The public URL from ngrok (e.g., "https://xxxxx.ngrok.io")
        """
        self.api_url = colab_api_url.rstrip('/')
        self.session = requests.Session()
        self.current_conversation_id = None
        
        # Test connection
        if self.test_connection():
            print("✅ Successfully connected to Colab Medical Chatbot")
        else:
            print("❌ Failed to connect to Colab Medical Chatbot")
    
    def test_connection(self) -> bool:
        """Test connection to Colab API"""
        try:
            response = self.session.get(f"{self.api_url}/", timeout=10)
            return response.status_code == 200
        except Exception as e:
            print(f"Connection error: {e}")
            return False
    
    def start_new_conversation(self) -> str:
        """Start a new conversation"""
        try:
            response = self.session.post(f"{self.api_url}/reset-conversation")
            if response.status_code == 200:
                data = response.json()
                self.current_conversation_id = data["conversation_id"]
                return self.current_conversation_id
            else:
                raise Exception(f"Failed to start new conversation: {response.text}")
        except Exception as e:
            print(f"Error starting new conversation: {e}")
            self.current_conversation_id = str(uuid.uuid4())
            return self.current_conversation_id
    
    def send_message(self, 
                    message: str, 
                    patient_id: str = "windows_patient",
                    conversation_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Send message to medical chatbot
        
        Args:
            message: User's medical question
            patient_id: Unique patient identifier
            conversation_id: Conversation ID (optional, will create new if None)
        
        Returns:
            Dictionary with response, conversation_id, status
        """
        try:
            # Use provided conversation_id or current one
            if conversation_id:
                self.current_conversation_id = conversation_id
            elif not self.current_conversation_id:
                self.start_new_conversation()
            
            # Prepare request
            payload = {
                "message": message,
                "conversation_id": self.current_conversation_id,
                "patient_id": patient_id,
                "language": "fr"
            }
            
            # Send request
            response = self.session.post(
                f"{self.api_url}/chat",
                json=payload,
                timeout=30  # Longer timeout for AI response
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    "response": f"Erreur API: {response.text}",
                    "conversation_id": self.current_conversation_id,
                    "status": "error"
                }
                
        except requests.exceptions.Timeout:
            return {
                "response": "Timeout: Le serveur met trop de temps à répondre. Veuillez réessayer.",
                "conversation_id": self.current_conversation_id,
                "status": "timeout"
            }
        except Exception as e:
            return {
                "response": f"Erreur de connexion: {str(e)}",
                "conversation_id": self.current_conversation_id,
                "status": "error"
            }
    
    def get_conversation_history(self, 
                               conversation_id: Optional[str] = None,
                               patient_id: str = "windows_patient") -> Dict[str, Any]:
        """Get conversation history"""
        try:
            conv_id = conversation_id or self.current_conversation_id
            if not conv_id:
                return {"history": [], "error": "No conversation ID"}
            
            response = self.session.get(
                f"{self.api_url}/conversations/{conv_id}",
                params={"patient_id": patient_id}
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"history": [], "error": response.text}
                
        except Exception as e:
            return {"history": [], "error": str(e)}

# Integration with your existing backend
def integrate_with_existing_backend(colab_api_url: str):
    """
    Integration function for your existing medical platform
    Replace the Ollama service calls with this Colab integration
    """
    
    # Initialize Colab chatbot
    colab_bot = ColabMedicalChatbot(colab_api_url)
    
    def enhanced_generate_medical_response(message: str, 
                                        conversation_id: str,
                                        patient_id: str) -> str:
        """
        Enhanced function that replaces your existing Ollama calls
        This maintains the same interface but uses Colab backend
        """
        try:
            result = colab_bot.send_message(
                message=message,
                patient_id=patient_id,
                conversation_id=conversation_id
            )
            
            if result["status"] == "success":
                return result["response"]
            else:
                # Fallback to your existing rule-based system
                return generate_fallback_response(message, patient_id)
                
        except Exception as e:
            print(f"Colab integration error: {e}")
            # Fallback to your existing system
            return generate_fallback_response(message, patient_id)
    
    def generate_fallback_response(message: str, patient_id: str) -> str:
        """Fallback to your existing rule-based system"""
        # Use your existing enhanced rule-based system here
        return "Je suis désolé, le service AI temporairement indisponible. Veuillez réessayer ou contacter un professionnel de santé."
    
    return enhanced_generate_medical_response

# Example usage and testing
if __name__ == "__main__":
    # Replace with your actual Colab URL from ngrok
    COLAB_API_URL = "https://your-ngrok-url.ngrok.io"  # Update this!
    
    # Initialize chatbot
    chatbot = ColabMedicalChatbot(COLAB_API_URL)
    
    # Start new conversation
    conversation_id = chatbot.start_new_conversation()
    print(f"Started conversation: {conversation_id}")
    
    # Test medical queries
    test_messages = [
        "J'ai des maux de tête depuis 2 jours",
        "C'est très douloureux, que puis-je faire?",
        "Merci pour ces conseils"
    ]
    
    for message in test_messages:
        print(f"\n👤 User: {message}")
        result = chatbot.send_message(message, "test_patient")
        print(f"🤖 Bot: {result['response']}")
        print(f"Status: {result['status']}")
    
    # Get conversation history
    history = chatbot.get_conversation_history()
    print(f"\n📖 Conversation history: {len(history.get('history', []))} messages")