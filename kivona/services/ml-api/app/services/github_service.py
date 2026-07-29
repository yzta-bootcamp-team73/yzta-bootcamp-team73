import asyncio
import base64
import httpx
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

class GitHubService:
    def __init__(self, access_token: Optional[str] = None):
        self.access_token = access_token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        if self.access_token:
            self.headers["Authorization"] = f"token {self.access_token}"

    async def _request(self, client: httpx.AsyncClient, method: str, endpoint: str, **kwargs) -> httpx.Response:
        url = f"{self.base_url}{endpoint}"
        response = await client.request(method, url, headers=self.headers, **kwargs)
        
        # Check rate limit
        remaining = response.headers.get("x-ratelimit-remaining")
        if remaining == "0":
            reset_time = response.headers.get("x-ratelimit-reset")
            logger.warning(f"Rate limit exceeded. Reset time: {reset_time}")
            
        return response

    async def fetch_user_profile(self, client: httpx.AsyncClient, username: str) -> Optional[Dict[str, Any]]:
        response = await self._request(client, "GET", f"/users/{username}")
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            logger.error(f"User {username} not found.")
            return None
        response.raise_for_status()

    async def fetch_user_repos(self, client: httpx.AsyncClient, username: str) -> List[Dict[str, Any]]:
        repos = []
        page = 1
        per_page = 100
        
        while True:
            response = await self._request(
                client, "GET", f"/users/{username}/repos", 
                params={"per_page": per_page, "page": page}
            )
            if response.status_code == 200:
                data = response.json()
                if not data:
                    break
                repos.extend(data)
                if len(data) < per_page:
                    break
                page += 1
            elif response.status_code == 404:
                break
            else:
                response.raise_for_status()
                break
                
        return repos

    async def fetch_repo_languages(self, client: httpx.AsyncClient, owner: str, repo: str) -> Dict[str, int]:
        response = await self._request(client, "GET", f"/repos/{owner}/{repo}/languages")
        if response.status_code == 200:
            return response.json()
        return {}

    async def fetch_repo_readme(self, client: httpx.AsyncClient, owner: str, repo: str) -> str:
        response = await self._request(client, "GET", f"/repos/{owner}/{repo}/readme")
        if response.status_code == 200:
            data = response.json()
            if data.get("encoding") == "base64" and data.get("content"):
                try:
                    return base64.b64decode(data["content"]).decode("utf-8", errors="ignore")
                except Exception as e:
                    logger.warning(f"Failed to decode README for {owner}/{repo}: {e}")
        return ""

    async def fetch_full_profile(self, username: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            # 1. Fetch user profile
            profile_task = self.fetch_user_profile(client, username)
            repos_task = self.fetch_user_repos(client, username)
            
            profile, repos = await asyncio.gather(profile_task, repos_task)
            
            if not profile:
                return {"error": "User not found"}
                
            # 2. Fetch languages and readmes for all repos concurrently
            async def process_repo(repo):
                repo_name = repo["name"]
                owner = repo["owner"]["login"]
                
                lang_task = self.fetch_repo_languages(client, owner, repo_name)
                readme_task = self.fetch_repo_readme(client, owner, repo_name)
                
                languages, readme = await asyncio.gather(lang_task, readme_task)
                repo["fetched_languages"] = languages
                repo["fetched_readme"] = readme
                return repo

            # Process in chunks to avoid overwhelming the connection pool or hitting secondary rate limits
            chunk_size = 10
            processed_repos = []
            for i in range(0, len(repos), chunk_size):
                chunk = repos[i:i + chunk_size]
                chunk_results = await asyncio.gather(*(process_repo(r) for r in chunk))
                processed_repos.extend(chunk_results)
                
            return {
                "profile": profile,
                "repositories": processed_repos
            }
