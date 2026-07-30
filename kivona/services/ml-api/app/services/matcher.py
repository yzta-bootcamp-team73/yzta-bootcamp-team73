import os
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from huggingface_hub import InferenceClient

def get_embedding(text):
    hf_token = os.getenv('HF_API_TOKEN')
    
    # Initialize the official SDK client
    client = InferenceClient(token=hf_token)
    
    try:
        # SDK automatically handles DNS, routing, and retries for Inference API
        embedding = client.feature_extraction(
            text,
            model="sentence-transformers/all-MiniLM-L6-v2"
        )
        return np.array(embedding)
    except Exception as e:
        print("HF SDK Request Failed:", e)
        # Fallback to zero vector to prevent crashing
        return np.zeros((384,))

def get_similarity_score(embedding1, embedding2):
    emb1 = np.array(embedding1)
    emb2 = np.array(embedding2)
    return cosine_similarity(emb1.reshape(1, -1), emb2.reshape(1, -1))[0][0]
