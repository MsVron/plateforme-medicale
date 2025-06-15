# 🤖 AI Medical Chatbot - Complete Integration Guide

## 📋 Overview

This document provides a comprehensive guide for the **AI Medical Chatbot** integration with **Google Colab** and **phi3:mini** model. The system provides intelligent medical assistance with conversation memory, specialist recommendations, and multilingual support.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │  Google Colab   │
│   (React)       │◄──►│   (Node.js)      │◄──►│   (phi3:mini)   │
│                 │    │                  │    │                 │
│ • Chat UI       │    │ • AI Manager     │    │ • FastAPI       │
│ • Status Check  │    │ • Colab Service  │    │ • Ollama        │
│ • History       │    │ • Fallback       │    │ • Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   MySQL Database │
                       │                  │
                       │ • Chat History   │
                       │ • Conversations  │
                       │ • User Data      │
                       └──────────────────┘
```

## 🚀 Features

### ✅ Core Capabilities
- **🧠 Advanced AI**: phi3:mini model for intelligent medical responses
- **💬 Conversation Memory**: Persistent chat history across sessions
- **👨‍⚕️ Doctor Recommendations**: Automatic specialist suggestions
- **🌍 Multilingual**: French and Moroccan Darija support
- **⚡ Real-time**: Instant responses with streaming support
- **🔒 Safety**: Medical disclaimers and harmful content filtering
- **📱 Responsive**: Works on desktop and mobile devices

### ✅ Technical Features
- **🔄 Intelligent Fallback**: Graceful degradation to rule-based system
- **📊 Performance Monitoring**: Response time and error tracking
- **🎯 Bold Formatting**: Important medical information highlighted
- **🔧 Service Management**: Health checks and status monitoring
- **📈 Scalable**: Supports multiple concurrent users

## 🛠️ Installation & Setup

### 1. Environment Configuration

Add these variables to your `.env` file:

```env
# Google Colab Integration
COLAB_ENABLED=true
COLAB_API_URL=https://your-ngrok-url.ngrok.io
COLAB_TIMEOUT=30000

# Fallback Options (keep for redundancy)
USE_OLLAMA=false
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=phi3:mini

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=plateforme_medicale
```

### 2. Google Colab Setup

#### Step 1: Create Colab Notebook
1. Go to [Google Colab](https://colab.research.google.com/)
2. Create new notebook: `Medical_Chatbot_phi3_mini.ipynb`
3. Enable GPU: Runtime → Change runtime type → Hardware accelerator → **T4 GPU**

#### Step 2: Install Dependencies
```python
# Cell 1: Install system dependencies
!sudo apt update && sudo apt install pciutils lshw -y
print("✅ Dependencies installed")

# Cell 2: Install Ollama
!curl -fsSL https://ollama.com/install.sh | sh
print("✅ Ollama installed")

# Cell 3: Start Ollama server
import subprocess
import time

process = subprocess.Popen(['ollama', 'serve'], 
                          stdout=subprocess.PIPE, 
                          stderr=subprocess.PIPE)
print("🚀 Starting Ollama server...")
time.sleep(10)
print("✅ Ollama server running")

# Cell 4: Download phi3:mini model
!ollama pull phi3:mini
print("✅ phi3:mini model downloaded")

# Verify installation
!ollama list
```

#### Step 3: Install Python Packages
```python
# Cell 5: Install required packages
!pip install ollama fastapi uvicorn pyngrok gradio mysql-connector-python

print("✅ All packages installed")
```

#### Step 4: Deploy Medical Chatbot Backend
```python
# Cell 6: Medical Chatbot Implementation
# (Copy the complete Python code from colab_integration.py)
```

#### Step 5: Start API Server
```python
# Cell 7: Start FastAPI server and create public URL
from pyngrok import ngrok
import threading
import uvicorn

# Start server in background
def run_server():
    uvicorn.run(app, host="0.0.0.0", port=8000)

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()

# Wait for server to start
time.sleep(5)

# Create public URL
public_url = ngrok.connect(8000)
print(f"""
🚀 Your Medical Chatbot API is now running!

📍 Local URL: http://localhost:8000
🌐 Public URL: {public_url}
📖 API Documentation: {public_url}/docs

💡 Copy the public URL to your .env file as COLAB_API_URL
""")

# Save URL for easy access
with open('api_url.txt', 'w') as f:
    f.write(f"COLAB_API_URL={public_url}\n")
```

### 3. Backend Integration

The backend integration is already complete with these files:

#### Files Modified:
- ✅ `ai/services/colabService.js` - New Colab service
- ✅ `ai/services/aiManager.js` - Updated to include Colab
- ✅ `controllers/diagnosisAssistantController.js` - Enhanced with Colab integration
- ✅ `routes/patientRoutes.js` - Added new endpoints

#### New Endpoints Available:
- `GET /patient/diagnosis/ai-status` - Check AI service status
- `POST /patient/diagnosis/test-colab` - Test Colab connection

## 📡 API Reference

### Chat Endpoint
```javascript
POST /patient/diagnosis/chat
```

**Request:**
```json
{
  "message": "J'ai des maux de tête depuis 2 jours",
  "conversationId": "conv_1234567890",
  "language": "fr"
}
```

**Response:**
```json
{
  "message": "Je comprends que vous ressentez des **maux de tête** depuis 2 jours...",
  "timestamp": "2024-12-19T10:30:00.000Z",
  "conversationId": "conv_1234567890",
  "type": "assistant",
  "source": "colab"
}
```

### AI Status Endpoint
```javascript
GET /patient/diagnosis/ai-status
```

**Response:**
```json
{
  "success": true,
  "aiManager": {
    "available": {
      "colab": true,
      "ollama": false,
      "alternative": false
    },
    "primaryService": "colab"
  },
  "colab": {
    "enabled": true,
    "available": true,
    "apiUrl": "https://xxxxx.ngrok.io",
    "model": "phi3:mini",
    "service": "Google Colab"
  },
  "environment": {
    "COLAB_ENABLED": true,
    "COLAB_API_URL": "configured",
    "OLLAMA_ENABLED": false
  }
}
```

## 🔧 How to Get Google Colab API

### Method 1: Using ngrok (Recommended)

1. **Create Google Account**: Sign up at [Google Colab](https://colab.research.google.com/)

2. **Create New Notebook**: 
   - Click "New notebook"
   - Rename to "Medical_Chatbot_API"

3. **Enable GPU**:
   - Runtime → Change runtime type
   - Hardware accelerator → T4 GPU
   - Save

4. **Install ngrok**:
   ```python
   !pip install pyngrok
   ```

5. **Get ngrok Token**:
   - Go to [ngrok.com](https://ngrok.com/)
   - Sign up for free account
   - Go to "Your Authtoken" page
   - Copy your authtoken

6. **Configure ngrok**:
   ```python
   from pyngrok import ngrok
   
   # Set your ngrok token
   ngrok.set_auth_token("YOUR_NGROK_TOKEN_HERE")
   ```

7. **Start Your API and Get URL**:
   ```python
   # After starting your FastAPI server
   public_url = ngrok.connect(8000)
   print(f"Your API URL: {public_url}")
   ```

8. **Copy URL to .env**:
   ```env
   COLAB_API_URL=https://xxxxx-xx-xxx-xxx-xx.ngrok.io
   ```

### Method 2: Using Gradio (Alternative)

```python
import gradio as gr

# Create Gradio interface
def chat_interface(message):
    # Your chat logic here
    return response

iface = gr.Interface(
    fn=chat_interface,
    inputs="text",
    outputs="text",
    title="Medical Chatbot"
)

# Launch with public URL
iface.launch(share=True)
```

### Method 3: Using Colab's Built-in Tunneling

```python
# Install localtunnel
!npm install -g localtunnel

# Start your server
# Then in another cell:
!lt --port 8000
```

## 🚨 Important Notes for Google Colab API

### ⚠️ Limitations
- **Session Timeout**: Colab sessions timeout after ~12 hours of inactivity
- **Resource Limits**: Free tier has usage limits
- **URL Changes**: ngrok URLs change when session restarts
- **GPU Availability**: T4 GPU may not always be available

### 💡 Best Practices
1. **Save Your Work**: Download notebook regularly
2. **Monitor Usage**: Check GPU/RAM usage in Colab
3. **Backup URLs**: Save ngrok URLs when they change
4. **Test Regularly**: Use the test endpoint to verify connection

### 🔄 Handling Session Restarts

When your Colab session restarts:

1. **Re-run All Cells**: Execute all setup cells again
2. **Get New URL**: ngrok will generate a new URL
3. **Update .env**: Change `COLAB_API_URL` in your backend
4. **Restart Backend**: Restart your Node.js server

## 🎯 Medical Features

### Doctor Recommendations
The system automatically suggests appropriate specialists based on symptoms:

```javascript
const specialists = {
  'Neurologue': ['tête', 'vertige', 'migraine', 'neurologique'],
  'Cardiologue': ['cœur', 'poitrine', 'palpitation', 'cardiaque'],
  'Gastro-entérologue': ['ventre', 'estomac', 'digestif', 'nausée'],
  'Dermatologue': ['peau', 'éruption', 'dermatologique'],
  // ... more specialists
};
```

### Safety Features
- **Medical Disclaimers**: Automatic addition of professional consultation reminders
- **Harmful Content Filtering**: Removal of dangerous medical advice
- **Emergency Detection**: Immediate warnings for critical symptoms
- **Professional Boundaries**: Clear non-diagnostic positioning

## 🚨 Troubleshooting

### Common Issues

#### 1. Colab Service Unavailable
**Symptoms**: Responses from fallback system only
**Solutions**:
```bash
# Check Colab notebook status
# Verify ngrok URL is active
# Restart Ollama server in Colab
!ollama serve &
```

#### 2. "ngrok not found" Error
**Solutions**:
```python
# Reinstall ngrok
!pip install pyngrok --upgrade

# Set authtoken again
from pyngrok import ngrok
ngrok.set_auth_token("YOUR_TOKEN")
```

#### 3. Connection Timeout
**Solutions**:
- Increase `COLAB_TIMEOUT` in .env file
- Check if Colab session is still active
- Verify ngrok tunnel is running

#### 4. GPU Not Available
**Solutions**:
- Try different times (GPU availability varies)
- Use CPU version if needed (slower but works)
- Consider Colab Pro for guaranteed GPU access

## 🔐 Security & Privacy

### Data Protection
- **Local Processing**: phi3:mini runs on your Colab instance
- **Encrypted Connections**: HTTPS for all API calls
- **User Isolation**: Conversations separated by patient ID
- **Data Retention**: Configurable message history limits

### Medical Compliance
- **Disclaimer Requirements**: Automatic medical disclaimers
- **Professional Boundaries**: Clear non-diagnostic positioning
- **Emergency Protocols**: Immediate warnings for critical symptoms
- **Audit Trail**: Complete conversation logging

## 📊 Performance Optimization

### Response Time Optimization
- **Model Quantization**: phi3:mini uses 4-bit quantization
- **Connection Pooling**: Reuse HTTP connections
- **Caching**: Cache frequent responses
- **Timeout Management**: Appropriate timeout settings

### Memory Management
- **Conversation Limits**: 20 messages per context window
- **Database Indexing**: Optimized queries for chat history
- **Garbage Collection**: Automatic cleanup of old conversations

## 🎓 Usage Examples

### Basic Medical Query
```
User: "J'ai des maux de tête depuis 2 jours"

AI: "Je comprends que vous ressentez des **maux de tête** depuis 2 jours.

Pour mieux vous aider, pouvez-vous préciser:
• L'intensité de la **douleur** sur une échelle de 1 à 10?
• Y a-t-il des facteurs déclencheurs?

👨‍⚕️ **Recommandation médicale**: Je vous conseille de consulter un **Neurologue** **pour les maux de tête**.

⚠️ **Rappel**: Cette conversation est à titre informatif uniquement. **Consultez un professionnel de santé** pour tout problème médical."
```

## 🧹 Cleanup & File Management

Now let me clean up unnecessary files in the AI directory:

<function_calls>
<invoke name="list_dir">
<parameter name="relative_workspace_path">plateforme-medicale/backend/ai
</rewritten_file> 