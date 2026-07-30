import os
import requests
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import time

API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"

def get_embedding(text):
    hf_token = os.getenv('HF_API_TOKEN')
    headers = {"Authorization": f"Bearer {hf_token}"} if hf_token else {}
    
    for attempt in range(3):
        try:
            response = requests.post(API_URL, headers=headers, json={"inputs": text}, timeout=20)
            if response.status_code == 200:
                return np.array(response.json())
            elif response.status_code == 503:
                print(f"Hugging Face modeli uyanıyor, bekleniyor... ({attempt+1}/3)")
                time.sleep(15) # Wait for model to load
            else:
                print(f"HF API Error ({response.status_code}):", response.text)
                break
        except Exception as e:
            print("HF API Request Failed:", e)
            break
            
    # Fallback to zero vector (384 dimensions for all-MiniLM) to prevent crashing
    return np.zeros((384,))

def get_similarity_score(embedding1, embedding2):
    emb1 = np.array(embedding1)
    emb2 = np.array(embedding2)
    return cosine_similarity(emb1.reshape(1, -1), emb2.reshape(1, -1))[0][0]
