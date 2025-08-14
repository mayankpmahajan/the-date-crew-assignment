import os
from huggingface_hub import InferenceClient
import json
import requests
import numpy as np
from api.models import User

HF_TOKEN = os.getenv("HF_TOKEN")

# Initialize client (set HF_TOKEN in your environment)
client = InferenceClient(token=HF_TOKEN)
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
LLM_MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1"

embed_client = InferenceClient(model=EMBEDDING_MODEL, token=HF_TOKEN)
llm_client = InferenceClient(model=LLM_MODEL, token=HF_TOKEN)

def generate_matchmaker_email(user, matches, matchmaker_name):
    """
    Generates a personalized matchmaker email via Hugging Face Chat API
    using Meta-Llama-3-70B-Instruct for high quality writing.
    """
    # Build profile summaries
    profiles_text = []
    for idx, match in enumerate(matches, start=1):
        profiles_text.append(
            f"Profile {idx}:\n"
            f"Name: {match.full_name}, Age: {match.age}, Height: {match.height_display}, "
            f"Location: {match.city}, {match.country}, "
            f"Profession: {match.designation or 'N/A'} at {match.current_company or 'N/A'}, "
            f"Education: {match.degree or 'N/A'} from {match.undergraduate_college or 'N/A'}, "
            f"Income: {match.income if match.income else 'N/A'}, "
            f"Languages Known: {', '.join(lang.name for lang in match.languages_known.all()) or 'N/A'}"
        )
    profiles_str = "\n\n".join(profiles_text)

    # Prompt for the model
    prompt = f"""
You are a caring but professional matchmaker for "The Date Crew" —
a premium dating platform for high-earning professionals in their late 20s to early 30s
who are struggling with arranged marriage and want to take actionable steps in their love life.

Write a warm, persuasive, and personalized email to {user.full_name} (age {user.age}, from {user.city}, {user.country}),
introducing them to three handpicked matches.

Here are the matches:
{profiles_str}

Email Requirements:
- Address {user.first_name} directly
- Make each match sound appealing and unique
- Encourage {user.first_name} to take action and connect
- Keep it professional yet friendly
- End with a motivating call-to-action
- Close the email with:
    Best regards,
    {matchmaker_name}
    Matchmaker, The Date Crew

Write only the email body, without explanations:
"""

    # Call HF Chat API
    completion = client.chat.completions.create(
        model="meta-llama/Meta-Llama-3-70B-Instruct",
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=500,
        temperature=0.8,
        top_p=0.9
    )

    return completion.choices[0].message["content"]


# --- Embedding helper ---
def get_embedding(text: str):
    output = embed_client.feature_extraction(text)
    return np.array(output).mean(axis=0)  # mean pooling

# --- Cosine similarity ---
def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# --- Load KB ---
with open("knowledge-base.json", "r") as f:
    kb = json.load(f)
    print("KB content:", kb)
    print("KB keys:", kb.keys())


def get_user_profile(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None

# --- Retrieve relevant docs ---
def retrieve_relevant_docs(query, top_k=5):
    query_emb = get_embedding(query)
    docs_with_scores = []

    for doc in kb["documents"]:
        doc_emb = get_embedding(doc["text"])
        score = cosine_similarity(query_emb, doc_emb)
        docs_with_scores.append((doc, score))

    docs_with_scores.sort(key=lambda x: x[1], reverse=True)
    return [d[0] for d in docs_with_scores[:top_k]]

# --- Ask LLM ---
def get_compatibility_score(target_user, selected_user, context_docs):
    prompt = f"""
You are a compatibility evaluator for the Natural Language Backend project.
where the preference of the users are assumed to be people who are in their late 20s to early 30s earning great money and doing great careerwise but have previously struggled with dating apps and not able to get a match through traditional indian arrange marriage setup
You are given two users:

Target User:
{json.dumps(target_user, indent=2)}

Selected User:
{json.dumps(selected_user, indent=2)}

Relevant Project Context:
{[doc['text'] for doc in context_docs]}

Evaluate compatibility based on:
-Age
-gender
-location
-height
-graduatiion degree
-current_company
-designation
-marital_status
-languages_known
-siblings
-caste
-religion
*want_kids
*open_to_relocate
*open_to_pets

Output ONLY in JSON:
{{
  "compatibility_score": <number from 0 to 5>,
  "reason": "<brief explanation>"
}}
"""
    completion = llm_client.text_generation(
        prompt,
        max_new_tokens=300,
        temperature=0.2
    )

    try:
        parsed = json.loads(completion.strip().split("{", 1)[1].rsplit("}", 1)[0].join(["{", "}"]))
        return parsed
    except Exception:
        return {"compatibility_score": None, "reason": "Failed to parse model output"}

# --- Pipeline ---
def rag_compatibility_pipeline(target_user_id, selected_user_id):
    target_user = get_user_profile(target_user_id)
    selected_user = get_user_profile(selected_user_id)

    # Build a query string from relevant user fields for RAG
    def user_query_string(user):
        return ' '.join([
            f"{user.first_name or ''} {user.last_name or ''}".strip(),
            str(user.gender or ''),
            str(user.city or ''),
            str(user.country or ''),
            str(user.height or ''),
            str(user.degree or ''),
            str(user.current_company or ''),
            str(user.designation or ''),
            str(user.marital_status or ''),
            ','.join(lang.name for lang in user.languages_known.all()),
            str(user.siblings or ''),
            str(user.caste or ''),
            str(user.religion or ''),
            str(user.want_kids or ''),
            str(user.open_to_relocate or ''),
            str(user.open_to_pets or '')
        ])


    query = user_query_string(target_user) + ' ' + user_query_string(selected_user)
    relevant_docs = retrieve_relevant_docs(query)

    return get_compatibility_score(target_user, selected_user, relevant_docs)