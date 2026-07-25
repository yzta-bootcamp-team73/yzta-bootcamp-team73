from pydantic import BaseModel
from typing import List, Optional

class MatchRequest(BaseModel):
    user_skills: List[str]
    team_skills: List[str]

class MatchResponse(BaseModel):
    score: float
    percent: int
    user_text: str
    team_text: str
