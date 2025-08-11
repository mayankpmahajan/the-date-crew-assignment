import os
from huggingface_hub import InferenceClient

# Initialize client (set HF_TOKEN in your environment)
client = InferenceClient(token=os.getenv("HF_TOKEN"))

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
