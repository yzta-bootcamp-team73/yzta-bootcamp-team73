from fastapi import APIRouter
from app.schemas import MatchRequest, MatchResponse
from app.services.matcher import get_embedding, get_similarity_score

router = APIRouter()

@router.post("/match", response_model=MatchResponse)
def match_skills(request: MatchRequest):
    # If empty lists are provided, use dummy example texts
    if not request.user_skills and not request.team_skills:
        user_skills_text = "python fastapi makine öğrenmesi"
        team_skills_text = "python veri bilimi derin öğrenme"
    else:
        user_skills_text = " ".join(request.user_skills)
        team_skills_text = " ".join(request.team_skills)

    user_embedding = get_embedding(user_skills_text)
    team_embedding = get_embedding(team_skills_text)

    score = float(get_similarity_score(user_embedding, team_embedding))
    percent = round(max(0.0, min(1.0, score)) * 100)

    return MatchResponse(score=score, percent=percent, user_text=user_skills_text, team_text=team_skills_text)
