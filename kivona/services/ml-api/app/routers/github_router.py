from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.services.github_service import GitHubService
from app.services.profile_analyzer import ProfileAnalyzer

router = APIRouter(prefix="/github", tags=["github"])
analyzer = ProfileAnalyzer()

class AnalyzeRequest(BaseModel):
    github_username: str
    access_token: Optional[str] = None

@router.post("/analyze")
async def analyze_github_profile(request: AnalyzeRequest) -> Dict[str, Any]:
    try:
        github_service = GitHubService(access_token=request.access_token)
        raw_data = await github_service.fetch_full_profile(request.github_username)
        
        if "error" in raw_data:
            raise HTTPException(status_code=404, detail=raw_data["error"])
            
        analysis_result = analyzer.analyze(raw_data)
        return analysis_result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
