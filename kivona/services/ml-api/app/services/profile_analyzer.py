import math
from datetime import datetime, timezone
from typing import Dict, Any, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class ProfileAnalyzer:
    def __init__(self):
        # Layer 2: Predefined role/specialization profiles
        self.role_profiles = {
            "Frontend Developer": "react angular vue css html javascript typescript ui ux component responsive web browser dom",
            "Backend Developer": "api rest graphql server database sql nosql authentication middleware microservice endpoint",
            "Full-Stack Developer": "frontend backend fullstack full-stack api react database deployment docker",
            "Data Scientist": "machine learning deep learning neural network tensorflow pytorch pandas numpy sklearn model training dataset",
            "ML Engineer": "machine learning pipeline mlops model deployment inference training data feature engineering",
            "DevOps Engineer": "docker kubernetes ci cd pipeline deployment infrastructure terraform ansible monitoring",
            "Mobile Developer": "android ios swift kotlin react native flutter mobile app",
            "Game Developer": "game engine unity unreal godot opengl directx shader 3d 2d",
            "Embedded/IoT Developer": "embedded firmware arduino raspberry microcontroller sensor iot hardware",
            "Security Engineer": "security vulnerability penetration testing cryptography authentication authorization"
        }
        
        # Layer 3: Rule-based taxonomy
        self.tech_taxonomy = {
            "JavaScript": {"category": "language", "keywords": ["javascript", "js", "node", "npm", "yarn", "package.json"]},
            "TypeScript": {"category": "language", "keywords": ["typescript", "ts", "tsconfig.json"]},
            "Python": {"category": "language", "keywords": ["python", "pip", "requirements.txt", "pyproject.toml", "setup.py", "django", "flask", "fastapi"]},
            "Java": {"category": "language", "keywords": ["java", "maven", "gradle", "pom.xml", "spring", "springboot"]},
            "C++": {"category": "language", "keywords": ["cpp", "c++", "cmake", "make"]},
            "C#": {"category": "language", "keywords": ["c#", "csharp", ".net", "dotnet"]},
            "Go": {"category": "language", "keywords": ["go", "golang", "go.mod"]},
            "Ruby": {"category": "language", "keywords": ["ruby", "rails", "gemfile"]},
            "PHP": {"category": "language", "keywords": ["php", "laravel", "composer.json", "symfony"]},
            "Swift": {"category": "language", "keywords": ["swift", "ios"]},
            "Kotlin": {"category": "language", "keywords": ["kotlin", "android"]},
            "Rust": {"category": "language", "keywords": ["rust", "cargo", "cargo.toml"]},
            
            "React": {"category": "framework", "keywords": ["react", "reactjs", "jsx", "tsx"]},
            "Angular": {"category": "framework", "keywords": ["angular", "ng"]},
            "Vue": {"category": "framework", "keywords": ["vue", "vuejs"]},
            "Next.js": {"category": "framework", "keywords": ["nextjs", "next.js"]},
            "Django": {"category": "framework", "keywords": ["django"]},
            "Flask": {"category": "framework", "keywords": ["flask"]},
            "FastAPI": {"category": "framework", "keywords": ["fastapi"]},
            "Spring Boot": {"category": "framework", "keywords": ["springboot", "spring-boot"]},
            
            "Docker": {"category": "tool", "keywords": ["docker", "dockerfile", "docker-compose"]},
            "Kubernetes": {"category": "tool", "keywords": ["kubernetes", "k8s"]},
            "AWS": {"category": "tool", "keywords": ["aws", "amazon web services"]},
            "PostgreSQL": {"category": "tool", "keywords": ["postgresql", "postgres"]},
            "MongoDB": {"category": "tool", "keywords": ["mongodb", "mongo"]},
            "MySQL": {"category": "tool", "keywords": ["mysql"]},
            "Redis": {"category": "tool", "keywords": ["redis"]},
            "GitHub Actions": {"category": "tool", "keywords": ["github actions", ".github/workflows"]}
        }
        
    def _parse_date(self, date_str: str) -> datetime:
        if not date_str:
            return datetime.now(timezone.utc)
        try:
            return datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
        except ValueError:
            return datetime.now(timezone.utc)

    def _calculate_recency(self, updated_at: str) -> float:
        now = datetime.now(timezone.utc)
        updated = self._parse_date(updated_at)
        months_diff = (now.year - updated.year) * 12 + now.month - updated.month
        
        if months_diff <= 6:
            return 1.0
        elif months_diff <= 12:
            return 0.8
        elif months_diff <= 24:
            return 0.4
        else:
            return max(0.0, 0.4 - (months_diff - 24) / 48) # decavs very slowly after 2 years

    def analyze(self, data: Dict[str, Any]) -> Dict[str, Any]:
        profile = data.get("profile", {})
        repos = data.get("repositories", [])
        
        if not repos:
            return self._empty_result(profile)
            
        total_repos = len(repos)
        total_stars = sum(r.get("stargazers_count", 0) for r in repos)
        total_forks = sum(r.get("forks_count", 0) for r in repos)
        
        # Aggregate languages
        lang_stats = {}
        total_bytes = 0
        repo_languages_count = {}
        
        # Aggregate text corpus for TF-IDF (weighted by recency)
        user_corpus = []
        
        # Rule-based detections
        tech_detections = {tech: {"count": 0, "recency": 0.0, "repos": [], "bytes": 0} for tech in self.tech_taxonomy}
        
        # Determine main language per repo
        for repo in repos:
            langs = repo.get("fetched_languages", {})
            if langs:
                repo["main_language"] = max(langs.items(), key=lambda x: x[1])[0]
            else:
                repo["main_language"] = None
                
        for repo in repos:
            repo_name = repo.get("name", "")
            desc = repo.get("description", "") or ""
            readme = repo.get("fetched_readme", "")
            topics = repo.get("topics", [])
            langs = repo.get("fetched_languages", {})
            updated_at = repo.get("updated_at", "")
            main_lang = repo.get("main_language")
            
            recency = self._calculate_recency(updated_at)
            
            # Combine text
            repo_text = f"{repo_name} {desc} {' '.join(topics)} {readme}".lower()
            
            # Primary role focuses on recent development trends
            weight = 0
            if recency >= 1.0: # <= 6 months
                weight = 5
            elif recency >= 0.8: # <= 12 months
                weight = 3
            elif recency >= 0.4: # <= 24 months
                weight = 1
                
            for _ in range(weight):
                user_corpus.append(repo_text)
            
            # Process Languages (Layer 1)
            for lang, bytes_count in langs.items():
                if lang not in lang_stats:
                    lang_stats[lang] = {"bytes": 0, "repos_count": 0, "recency": 0.0, "is_main_count": 0}
                lang_stats[lang]["bytes"] += bytes_count
                lang_stats[lang]["repos_count"] += 1
                lang_stats[lang]["recency"] = max(lang_stats[lang]["recency"], recency)
                if lang == main_lang:
                    lang_stats[lang]["is_main_count"] += 1
                total_bytes += bytes_count
                
                # Auto-detect language in taxonomy
                for tech, meta in self.tech_taxonomy.items():
                    if meta["category"] == "language" and lang.lower() in meta["keywords"]:
                        tech_detections[tech]["count"] += 1
                        tech_detections[tech]["recency"] = max(tech_detections[tech]["recency"], recency)
                        tech_detections[tech]["repos"].append(repo_name)
                        tech_detections[tech]["bytes"] += bytes_count
                        
            # Rule-based (Layer 3)
            for tech, meta in self.tech_taxonomy.items():
                if meta["category"] != "language":
                    # Simple keyword matching in repo text
                    for kw in meta["keywords"]:
                        if kw in repo_text:
                            tech_detections[tech]["count"] += 1
                            tech_detections[tech]["recency"] = max(tech_detections[tech]["recency"], recency)
                            tech_detections[tech]["repos"].append(repo_name)
                            break
                            
        # TF-IDF Role matching (Layer 2)
        full_text = " ".join(user_corpus)
        roles = list(self.role_profiles.keys())
        documents = [full_text] + list(self.role_profiles.values())
        
        vectorizer = TfidfVectorizer(stop_words='english')
        try:
            tfidf_matrix = vectorizer.fit_transform(documents)
            cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
            
            role_scores = {roles[i]: score for i, score in enumerate(cosine_similarities)}
            primary_role = max(role_scores.items(), key=lambda x: x[1])[0]
        except ValueError:
            primary_role = "Developer"
            
        # Calculate confidences and separate Core vs Secondary skills
        skills = []
        languages = []
        frameworks = []
        tools = []
        
        # Add languages to skills
        for lang, stats in lang_stats.items():
            if total_bytes == 0: continue
            
            repo_count = stats["repos_count"]
            is_main = stats["is_main_count"] > 0
            byte_ratio = stats["bytes"] / total_bytes
            recency = stats["recency"]
            
            # Advanced scoring
            score = 0
            score += min(35, repo_count * 8) # Up to 35 points for frequency
            score += min(35, byte_ratio * 100) # Up to 35 points for volume
            score += recency * 20 # Up to 20 points for recency
            if is_main: score += 10 # Bonus for being the main language
            
            # Pre-filter (strict Core/Secondary classification happens after sorting)
            if score < 15:
                continue # Skip negligible languages
            
            level = "core" if (score >= 50 and repo_count >= 2 and recency >= 0.4) else "secondary"

            reasons = []
            reasons.append(f"{repo_count} farklı repoda kullanıldı.")
            if recency >= 0.8:
                reasons.append("Son 1 yıl içinde aktif olarak kullanıldı.")
            if is_main:
                reasons.append("En az bir projede ana teknoloji olarak öne çıkıyor.")
            if byte_ratio > 0.15:
                reasons.append(f"Genel kod tabanının %{round(byte_ratio * 100)}'ünü oluşturuyor.")

            skills.append({
                "name": lang,
                "confidence": round(min(100, score)),
                "category": "language",
                "level": level,
                "reasons": reasons
            })
            languages.append(lang)
                
        # Add frameworks and tools to skills
        for tech, stats in tech_detections.items():
            repo_count = stats["count"]
            if repo_count > 0 and self.tech_taxonomy[tech]["category"] != "language":
                recency = stats["recency"]
                cat = self.tech_taxonomy[tech]["category"]
                
                score = 0
                score += min(40, repo_count * 10) # Up to 40 points for frequency
                score += recency * 30 # Up to 30 points for recency
                score += 15 # Base detection score
                
                if score < 20:
                    continue # Skip one-off tools
                
                level = "core" if (score >= 50 and repo_count >= 2 and recency >= 0.4) else "secondary"
                    
                reasons = []
                reasons.append(f"{repo_count} farklı repoda kullanıldı.")
                if recency >= 0.8:
                    reasons.append("Son 1 yıl içinde aktif olarak kullanıldı.")
                if tech.lower() in full_text:
                    reasons.append("Proje açıklamalarında (README vb.) özel olarak vurgulanmış.")

                skills.append({
                    "name": tech,
                    "confidence": round(min(100, score)),
                    "category": cat,
                    "level": level,
                    "reasons": reasons
                })
                if cat == "framework": frameworks.append(tech)
                if cat == "tool": tools.append(tech)
                    
        # Sort skills by confidence
        all_skills = sorted(skills, key=lambda x: x["confidence"], reverse=True)
        
        if all_skills:
            all_skills[0]["reasons"].append("Profildeki en yüksek ağırlıklı teknoloji.")
        
        # Strictly limit Core Skills to the best (max 8, score >= 60)
        core_skills = []
        for s in all_skills:
            # Upgrade or downgrade based on strict threshold and cap
            if s["confidence"] >= 60 and len(core_skills) < 8 and s.get("level") == "core":
                s["level"] = "core"
                core_skills.append(s)
            else:
                s["level"] = "secondary"
                
        # Filter out secondary skills so the UI only displays the top Core Skills
        skills = core_skills
        
        # --- Dynamic Specializations (Expertise Areas) ---
        specializations = []
        spec_map = {
            "API Development": ["api", "rest", "graphql", "endpoint", "swagger", "backend", "fastapi", "django", "flask"],
            "Web Development": ["web", "html", "css", "frontend", "responsive", "react", "vue", "nextjs"],
            "Data Engineering": ["data", "pipeline", "etl", "stream", "batch", "kafka", "hadoop", "spark"],
            "Machine Learning": ["machine learning", "ml", "deep learning", "neural", "model", "ai", "tensorflow", "pytorch"],
            "Cloud & DevOps": ["docker", "kubernetes", "aws", "ci", "cd", "deploy", "terraform", "action"],
            "Mobile Development": ["android", "ios", "mobile", "flutter", "react native", "swift"],
            "Database Architecture": ["database", "sql", "postgres", "mongo", "redis", "nosql"],
            "Automation & Scripting": ["automation", "script", "bot", "cli", "tool", "bash", "shell"],
            "Cybersecurity": ["security", "auth", "encryption", "vulnerability", "crypto"],
        }
        
        spec_scores = {}
        for spec_name, keywords in spec_map.items():
            # Calculate a score based on keyword occurrences in the TF-IDF corpus
            match_count = sum(full_text.count(kw) for kw in keywords)
            if match_count > 0:
                spec_scores[spec_name] = match_count
                
        # Get top 3-4 specializations based on highest keyword frequency
        sorted_specs = sorted(spec_scores.items(), key=lambda x: x[1], reverse=True)
        specializations = [name for name, score in sorted_specs if score >= 2][:4]
        
        if not specializations:
            specializations.append("Software Engineering")
        
        # --- Dynamic Strengths (Data-driven) ---
        strengths = []
        core_skills = [s["name"] for s in skills if s.get("level") == "core"]
        
        # Real insights based on topics and corpus
        if "machine learning" in full_text or "deep learning" in full_text or "ai" in full_text:
            strengths.append("Yapay zeka ve makine öğrenimi alanında uygulamalı proje geliştirme tecrübesi.")
        
        if len(frameworks) >= 2 and ("react" in full_text or "vue" in full_text or "next.js" in full_text):
            strengths.append("Modern frontend framework'leri ile zengin web uygulamaları tasarlama yetkinliği.")
            
        if "api" in full_text and ("node" in full_text or "python" in full_text or "java" in full_text):
            strengths.append("Ölçeklenebilir backend sistemleri ve RESTful API mimarileri kurma becerisi.")
            
        if "data" in full_text and ("pandas" in full_text or "sql" in full_text):
            strengths.append("Veri analizi ve işleme süreçlerinde pratik teknik bilgi.")

        # Repository activity & quality insights
        recent_repos = sum(1 for r in repos if self._calculate_recency(r.get("updated_at", "")) > 0.5)
        if recent_repos > 3:
            strengths.append("Sürekli ve aktif geliştirme temposu; güncel teknolojileri takip etme motivasyonu.")
            
        has_good_readmes = sum(1 for r in repos if len(r.get("fetched_readme", "")) > 500)
        if has_good_readmes >= 2:
            strengths.append("Projelerini iyi belgelendirme ve açıklayıcı README'ler hazırlama yeteneği.")
            
        if total_stars > 20:
            strengths.append(f"Açık kaynak projeleriyle topluluktan {total_stars} yıldız alarak değer yaratma başarısı.")
            
        if not strengths:
            strengths.append("Açık kaynak dünyasında aktif ve üretken bir profil.")
            
        # Ensure we only keep max 4 impactful strengths
        strengths = strengths[:4]
        
        # --- Natural Professional Summary ---
        # Build a recruiter-friendly, natural summary based purely on core strengths
        core_techs = [s["name"] for s in skills if s.get("level") == "core"][:3]
        
        if core_techs:
            tech_phrase = f"{', '.join(core_techs[:-1])} ve {core_techs[-1]}" if len(core_techs) > 1 else core_techs[0]
            intro = f"Özellikle {tech_phrase} odaklı yetkinliklere sahip, güncel teknolojilerle geliştirme yapan bir {primary_role}."
        else:
            intro = f"Yazılım geliştirme süreçlerine hakim, yetenekli bir {primary_role}."
            
        activity_phrase = f"Son dönemde oldukça aktif olan bu profil, bugüne kadar {total_repos} farklı projeye imza atmış."
        if recent_repos < 2:
            activity_phrase = f"Bugüne kadar {total_repos} farklı projeye katkı sağlamış."
            
        impact_phrase = ""
        if total_stars > 10:
            impact_phrase = f" Açık kaynak topluluğundan aldığı toplam {total_stars} yıldız, ürettiği çözümlerin kalitesini ve topluluk içindeki etkisini gösteriyor."
            
        prof_summary = f"{intro} {activity_phrase}{impact_phrase}"

        # --- Top Languages (percentage based) ---
        top_languages = {}
        if total_bytes > 0:
            sorted_langs = sorted(lang_stats.items(), key=lambda x: x[1]["bytes"], reverse=True)[:5]
            for lang, stats in sorted_langs:
                pct = round((stats["bytes"] / total_bytes) * 100)
                if pct > 0:
                    top_languages[lang] = pct

        # --- Activity Score ---
        recent_count = sum(1 for r in repos if self._calculate_recency(r.get("updated_at", "")) > 0.5)
        recency_ratio = (recent_count / total_repos) * 100 if total_repos > 0 else 0
        stars_component = min(30, total_stars * 0.3)
        repos_component = min(30, total_repos * 1.5)
        activity_score = min(100, round(recency_ratio * 0.4 + stars_component + repos_component))

        # --- Build repositories list (ALL repos included) ---
        # Sort by stars then recency
        sorted_repos = sorted(
            repos,
            key=lambda r: (r.get("stargazers_count", 0), r.get("updated_at", "")),
            reverse=True
        )
        
        repo_list = [
            {
                "name": r.get("name"),
                "description": r.get("description"),
                "language": r.get("language"),
                "stars": r.get("stargazers_count", 0),
                "forks": r.get("forks_count", 0),
                "url": r.get("html_url"),
                "topics": r.get("topics", []),
                "updated_at": r.get("updated_at")
            }
            for r in sorted_repos
        ]

        # --- Build recommendation_metadata ---
        # 1. skill_scores
        rec_skill_scores = {s["name"]: s["confidence"] for s in all_skills}
        
        # 2. experience_score
        now = datetime.now(timezone.utc)
        oldest_date = now
        for r in repos:
            created = self._parse_date(r.get("created_at", r.get("updated_at", "")))
            if created < oldest_date:
                oldest_date = created
        months_experience = (now.year - oldest_date.year) * 12 + now.month - oldest_date.month
        experience_score = min(100, round((months_experience / 60) * 100)) # 5 years -> 100
        
        # 3. collaboration_score
        org_repos = sum(1 for r in repos if r.get("owner", {}).get("type") == "Organization")
        collab = 0
        collab += min(35, total_forks * 5)
        collab += min(35, total_stars * 2)
        collab += min(30, org_repos * 15)
        collaboration_score = round(collab)
        
        # 4. preferred_roles
        sorted_roles = sorted(role_scores.items(), key=lambda x: x[1], reverse=True)
        preferred_roles = [{"role": r, "confidence": round(min(100, s * 100 * 3))} for r, s in sorted_roles[:3] if s > 0.05]
        if not preferred_roles:
            preferred_roles = [{"role": "Developer", "confidence": 50}]
            
        # 5. missing_skills (Example domain-based checks)
        missing_skills = []
        db_skills = [s["name"] for s in all_skills if s["name"] in ["PostgreSQL", "MongoDB", "MySQL", "Redis"]]
        fw_skills = [s["name"] for s in all_skills if s["category"] == "framework"]
        
        if primary_role in ["Backend Developer", "Full-Stack Developer"] and not db_skills:
            missing_skills.append("Database Management")
        if primary_role in ["Frontend Developer", "Full-Stack Developer"] and not fw_skills:
            missing_skills.append("Modern UI Frameworks (React/Vue/Angular)")
            
        recommendation_metadata = {
            "preferred_roles": preferred_roles,
            "skill_scores": rec_skill_scores,
            "experience_score": experience_score,
            "activity_score": activity_score,
            "collaboration_score": collaboration_score,
            "project_domains": specializations,
            "competition_tags": specializations,
            "strongest_languages": [s["name"] for s in all_skills if s["category"] == "language"][:3],
            "strongest_frameworks": fw_skills[:3],
            "strongest_databases": db_skills[:2],
            "missing_skills": missing_skills
        }

        return {
            "primary_role": primary_role,
            "skills": skills,
            "specializations": specializations,
            "tech_stack": {
                "languages": list(set(languages)),
                "frameworks": list(set(frameworks)),
                "tools": list(set(tools))
            },
            "strengths": strengths,
            "professional_summary": prof_summary,
            "repositories": repo_list,
            "stats": {
                "total_repos": total_repos,
                "total_stars": total_stars,
                "top_languages": top_languages,
                "activity_score": activity_score
            },
            "recommendation_metadata": recommendation_metadata,
            "analyzed_at": datetime.now(timezone.utc).isoformat()
        }

    def _empty_result(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "primary_role": "Developer",
            "skills": [],
            "specializations": [],
            "tech_stack": {"languages": [], "frameworks": [], "tools": []},
            "strengths": ["GitHub profilinde henüz genel bir proje bulunmuyor."],
            "professional_summary": "Henüz analiz edilebilecek açık kaynaklı repository bulunmuyor.",
            "repositories": [],
            "stats": {
                "total_repos": 0,
                "total_stars": 0,
                "top_languages": {},
                "activity_score": 0
            },
            "analyzed_at": datetime.now(timezone.utc).isoformat()
        }
