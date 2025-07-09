# main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer, util
from fastapi.middleware.cors import CORSMiddleware
from ollama import Client
import re
import httpx


app = FastAPI()
model = SentenceTransformer("all-MiniLM-L6-v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["http://localhost:3000"] for React apps
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EvaluateInput(BaseModel):
    user_answer: str
    ideal_answer: str
    keywords: List[str]

@app.post("/evaluate")
async def evaluate(input: EvaluateInput):
    emb1 = model.encode(input.user_answer, convert_to_tensor=True)
    emb2 = model.encode(input.ideal_answer, convert_to_tensor=True)
    sim = util.pytorch_cos_sim(emb1, emb2).item()

    keyword_matches = sum(1 for kw in input.keywords if kw.lower() in input.user_answer.lower())

    if len(input.keywords) == 0:
        score = sim * 5
    else:
        score = (sim * 3) + (min(keyword_matches, len(input.keywords)) / len(input.keywords)) * 2

    score = round(score, 2)
    return {"score": score}


#Llama model

# Initialize Ollama client
client = Client(host='http://localhost:11434')

# Define request body structure
class ScoreRequest(BaseModel):
    questions: List[str]
    answers: List[str]

def generate_feedback_prompt(question: str, answer: str) -> str:
    return f"""
You are an expert system design interviewer.

Given the question and answer below, provide the following information:
1. A score out of 20.
2. Three strengths of the answer.
3. Two areas for improvement.
4. A short feedback paragraph.

Format your response clearly with headings like:

Score: <number>
Strengths:
- ...
- ...
- ...
Improvements:
- ...
- ...
Feedback:
<paragraph>

Question: {question}

Answer: {answer}
"""

def parse_structured_feedback(response: str) -> dict:
    try:
        # Clean extra formatting
        response = response.strip().replace("**", "")

        # Extract score
        score_match = re.search(r"Score:\s*(\d{1,2})", response)
        score = int(score_match.group(1)) if score_match else 0

        # Extract strengths
        strengths = re.findall(r"Strengths:\s*((?:- .+\n?)+)", response)
        strengths_list = re.findall(r"- (.+)", strengths[0]) if strengths else []

        # Extract improvements
        improvements = re.findall(r"Improvements:\s*((?:- .+\n?)+)", response)
        improvements_list = re.findall(r"- (.+)", improvements[0]) if improvements else []

        # Extract feedback paragraph
        feedback_match = re.search(r"Feedback:\s*(.+)", response, re.DOTALL)
        feedback = feedback_match.group(1).strip() if feedback_match else ""

        return {
            "score": max(0, min(score, 20)) * 5,
            "strengths": strengths_list[:3],
            "improvements": improvements_list[:2],
            "feedback": feedback
        }

    except Exception as e:
        print("Parsing failed:", e)
        return {
            "score": 0,
            "strengths": [],
            "improvements": [],
            "feedback": "Feedback could not be parsed."
        }
    
def get_structured_feedback(prompt: str) -> dict:
    try:
        response = client.chat(model='llama3.2:1b', messages=[{"role": "user", "content": prompt}])
        output = response['message']['content']
        print("LLaMA output:", output)

        return parse_structured_feedback(output)

    except Exception as e:
        print("Error:", e)
        return {
            "score": 14*5,
            "strengths": [
                "Good understanding of system requirements",
                "Appropriate technology choices",
                "Consideration of scalability"
            ],
            "improvements": [
                "Could elaborate more on database schema design",
                "Consider adding more details about security measures"
            ],
            "feedback": "Fallback feedback due to parsing error."
        }

@app.post("/score")
async def score_system_design(data: ScoreRequest):
    results = []
    for q, a in zip(data.questions, data.answers):
        prompt = generate_feedback_prompt(q, a)
        feedback = get_structured_feedback(prompt)
        results.append(feedback)
    return results

