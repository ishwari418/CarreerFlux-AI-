import httpx
import json

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"

async def generate_response(prompt: str, mode: str = "general"):
    system_prompts = {
        "resume": "You are a professional Resume Analyzer.",
        "career": "You are an expert Career Guidance Counselor.",
        "notes": "You are a precise Notes Generator.",
        "quiz": "You are a Quiz Generator.",
        "general": "You are a helpful AI assistant."
    }
    
    system_content = system_prompts.get(mode, system_prompts['general'])
    
    payload = {
        "model": "llama3",
        "messages": [
            {"role": "system", "content": system_content},
            {"role": "user", "content": prompt}
        ],
        "stream": False
    }
    
    async with httpx.AsyncClient(timeout=90.0, trust_env=False) as client:
        try:
            print(f"DEBUG: Attempting POST to {OLLAMA_URL}...")
            response = await client.post(OLLAMA_URL, json=payload)
            
            if response.status_code == 200:
                return response.json().get("message", {}).get("content", "No response content.")
            else:
                error_msg = f"Ollama Error ({response.status_code}): {response.text}"
                print(f"DEBUG: {error_msg}")
                return error_msg
                
        except Exception as e:
            # Use repr(e) to get the full technical error type
            error_msg = f"Connection Failed: {repr(e)}"
            print(f"DEBUG: {error_msg}")
            
            # One last-ditch effort with 'localhost'
            if "127.0.0.1" in OLLAMA_URL:
                try:
                    print("DEBUG: Retrying with 'localhost'...")
                    alt_url = OLLAMA_URL.replace("127.0.0.1", "localhost")
                    response = await client.post(alt_url, json=payload)
                    if response.status_code == 200:
                        return response.json().get("message", {}).get("content", "No response content.")
                except Exception as e2:
                    print(f"DEBUG: Localhost also failed: {repr(e2)}")
            
            return error_msg
