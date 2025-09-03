# import requests
# import json
# import base64
# import time
# from datetime import datetime
# from typing import Dict, List, Any, Optional, Tuple
# from dataclasses import dataclass
# import re
# from collections import Counter

# @dataclass
# class RepositoryAnalysis:
#     name: str
#     description: str
#     readme_content: str
#     django_score: float
#     matched_keywords: List[str]
#     project_type: str
#     tech_stack: List[str]
#     repository_url: str
#     is_django_project: bool
#     relevance_reasons: List[str]
#     file_indicators: List[str]

# @dataclass
# class GitHubProfileScore:
#     username: str
#     total_repositories: int
#     django_repositories: List[RepositoryAnalysis]
#     overall_django_score: float
#     total_keywords_matched: int
#     processing_time: float
#     summary: str
#     recommendations: List[str]

# class ImprovedDjangoGitHubAnalyzer:
#     def __init__(self, github_token: Optional[str] = None):
#         self.github_token = github_token
#         self.base_url = "https://api.github.com"
        
#         # Set up headers with proper authentication
#         self.headers = {
#             'Accept': 'application/vnd.github.v3+json',
#             'User-Agent': 'Django-GitHub-Analyzer-v2'
#         }
        
#         if github_token:
#             self.headers['Authorization'] = f'token {github_token}'
        
#         # Django-specific keywords with weights
#         self.django_keywords = {
#             # Core Django keywords (high weight)
#             'django': 25,
#             'django rest framework': 20,
#             'django-rest-framework': 20,
#             'djangorestframework': 20,
#             'drf': 15,
            
#             # Django components (medium-high weight)
#             'django.db': 15,
#             'django.contrib': 15,
#             'rest_framework': 18,
#             'django-admin': 12,
#             'django.urls': 12,
#             'django.views': 12,
#             'django.models': 15,
            
#             # Django files (high weight)
#             'manage.py': 20,
#             'settings.py': 18,
#             'models.py': 15,
#             'views.py': 15,
#             'serializers.py': 18,
#             'urls.py': 12,
#             'admin.py': 10,
#             'forms.py': 10,
            
#             # Related technologies (medium weight)
#             'postgresql': 8,
#             'mysql': 8,
#             'sqlite': 6,
#             'redis': 8,
#             'celery': 10,
#             'gunicorn': 8,
#             'nginx': 6,
#             'docker': 8,
#             'requirements.txt': 10,
            
#             # API and web development (medium weight)
#             'rest api': 12,
#             'restful': 10,
#             'api endpoint': 10,
#             'json api': 8,
#             'web application': 8,
#             'backend': 10,
            
#             # Python web frameworks context
#             'python': 5,
#             'pip install': 6,
#             'virtualenv': 6,
#             'python3': 5
#         }
        
#         # File patterns to look for in repositories
#         self.django_file_patterns = [
#             'manage.py',
#             'settings.py', 'settings/',
#             'models.py', 'models/',
#             'views.py', 'views/',
#             'serializers.py',
#             'urls.py',
#             'admin.py',
#             'forms.py',
#             'requirements.txt',
#             'requirements/',
#             'Pipfile',
#             'pyproject.toml',
#             'wsgi.py',
#             'asgi.py'
#         ]

#     def get_repositories(self, username: str, max_repos: int = 30) -> List[Dict[str, Any]]:
#         """Fetch user's repositories with proper error handling"""
#         print(f"🔍 Fetching repositories for {username}...")
        
#         repositories = []
#         page = 1
#         per_page = 30
        
#         while len(repositories) < max_repos:
#             try:
#                 url = f"{self.base_url}/users/{username}/repos"
#                 params = {
#                     'page': page,
#                     'per_page': per_page,
#                     'sort': 'updated',
#                     'type': 'public'
#                 }
                
#                 print(f"📡 Making request to GitHub API (page {page})...")
#                 response = requests.get(url, headers=self.headers, params=params, timeout=15)
                
#                 if response.status_code == 404:
#                     print(f"❌ User '{username}' not found")
#                     return []
#                 elif response.status_code == 403:
#                     print(f"⚠️ Rate limit exceeded or access denied")
#                     print(f"Response: {response.text}")
#                     if repositories:  # Return what we have so far
#                         break
#                     else:
#                         return []
#                 elif response.status_code != 200:
#                     print(f"⚠️ API request failed with status {response.status_code}")
#                     print(f"Response: {response.text}")
#                     if repositories:  # Return what we have so far
#                         break
#                     else:
#                         return []
                
#                 page_repos = response.json()
#                 if not page_repos:  # No more repositories
#                     break
                
#                 # Filter out forks unless they have significant modifications
#                 filtered_repos = []
#                 for repo in page_repos:
#                     if not repo.get('fork', False):
#                         filtered_repos.append(repo)
#                     elif repo.get('size', 0) > 100:  # Large forks might have significant modifications
#                         filtered_repos.append(repo)
                
#                 repositories.extend(filtered_repos)
#                 page += 1
                
#                 # Add small delay to avoid rate limiting
#                 time.sleep(0.5)
                
#             except requests.exceptions.RequestException as e:
#                 print(f"⚠️ Network error: {e}")
#                 break
        
#         print(f"✅ Found {len(repositories)} repositories")
#         return repositories[:max_repos]

#     def get_file_content(self, username: str, repo_name: str, file_path: str) -> Optional[str]:
#         """Get content of a specific file from repository"""
#         try:
#             url = f"{self.base_url}/repos/{username}/{repo_name}/contents/{file_path}"
#             response = requests.get(url, headers=self.headers, timeout=10)
            
#             if response.status_code == 200:
#                 file_data = response.json()
#                 if file_data.get('encoding') == 'base64' and file_data.get('content'):
#                     try:
#                         content = base64.b64decode(file_data['content']).decode('utf-8', errors='ignore')
#                         return content
#                     except Exception as e:
#                         print(f"⚠️ Error decoding {file_path}: {e}")
#                         return None
            
#         except Exception as e:
#             # Silently continue - file might not exist
#             pass
        
#         return None

#     def get_readme_content(self, username: str, repo_name: str) -> str:
#         """Get README content with multiple filename attempts"""
#         readme_files = ['README.md', 'readme.md', 'README.txt', 'readme.txt', 'README.rst', 'README']
        
#         for readme_file in readme_files:
#             content = self.get_file_content(username, repo_name, readme_file)
#             if content:
#                 print(f"📄 Found {readme_file} ({len(content)} chars)")
#                 return content
        
#         print(f"📄 No README found")
#         return ""

#     def check_django_files_in_repo(self, username: str, repo_name: str) -> List[str]:
#         """Check for Django-specific files in the repository"""
#         print(f"🔍 Checking for Django files in {repo_name}...")
#         found_files = []
        
#         try:
#             # Get repository tree to find files
#             url = f"{self.base_url}/repos/{username}/{repo_name}/git/trees/HEAD?recursive=1"
#             response = requests.get(url, headers=self.headers, timeout=10)
            
#             if response.status_code == 200:
#                 tree_data = response.json()
#                 all_files = [item['path'] for item in tree_data.get('tree', []) if item['type'] == 'blob']
                
#                 # Check for Django file patterns
#                 for file_path in all_files:
#                     file_name = file_path.lower()
#                     for pattern in self.django_file_patterns:
#                         if pattern.lower() in file_name:
#                             found_files.append(file_path)
#                             break
            
#         except Exception as e:
#             print(f"⚠️ Error checking files in {repo_name}: {e}")
        
#         if found_files:
#             print(f"✅ Found Django files: {', '.join(found_files[:5])}")
#         else:
#             print(f"❌ No Django files found")
            
#         return found_files

#     def analyze_text_for_django_keywords(self, text: str) -> Tuple[float, List[str]]:
#         """Analyze text content for Django-related keywords"""
#         if not text:
#             return 0.0, []
        
#         text_lower = text.lower()
#         matched_keywords = []
#         total_score = 0.0
        
#         # Check each keyword
#         for keyword, weight in self.django_keywords.items():
#             if keyword.lower() in text_lower:
#                 matched_keywords.append(keyword)
#                 # Count occurrences and apply weight
#                 occurrences = text_lower.count(keyword.lower())
#                 keyword_score = weight * min(occurrences, 3)  # Cap at 3 occurrences
#                 total_score += keyword_score
        
#         # Remove duplicates and sort by relevance
#         matched_keywords = list(set(matched_keywords))
#         matched_keywords.sort(key=lambda x: self.django_keywords.get(x, 0), reverse=True)
        
#         return total_score, matched_keywords

#     def determine_project_type(self, readme_content: str, found_files: List[str], matched_keywords: List[str]) -> str:
#         """Determine the type of Django project"""
#         content_lower = readme_content.lower()
        
#         if any('rest' in keyword.lower() for keyword in matched_keywords) or any('api' in f.lower() for f in found_files):
#             if 'ecommerce' in content_lower or 'shop' in content_lower:
#                 return "Django E-commerce API"
#             elif 'blog' in content_lower:
#                 return "Django Blog API"
#             elif 'social' in content_lower:
#                 return "Django Social Media API"
#             else:
#                 return "Django REST API"
        
#         elif any('admin' in keyword.lower() for keyword in matched_keywords):
#             return "Django Admin Application"
        
#         elif 'blog' in content_lower:
#             return "Django Blog Application"
#         elif 'ecommerce' in content_lower or 'shop' in content_lower:
#             return "Django E-commerce Application"
#         elif 'portfolio' in content_lower:
#             return "Django Portfolio Website"
#         elif 'chat' in content_lower or 'messaging' in content_lower:
#             return "Django Chat Application"
#         else:
#             return "Django Web Application"

#     def analyze_single_repository(self, username: str, repo: Dict[str, Any]) -> Optional[RepositoryAnalysis]:
#         """Analyze a single repository for Django content"""
#         repo_name = repo['name']
#         repo_description = repo.get('description', '') or ''
        
#         print(f"\n📦 Analyzing repository: {repo_name}")
#         print(f"📝 Description: {repo_description[:100]}...")
        
#         # Step 1: Get README content
#         readme_content = self.get_readme_content(username, repo_name)
        
#         # Step 2: Check for Django files
#         django_files = self.check_django_files_in_repo(username, repo_name)
        
#         # Step 3: Analyze README for Django keywords
#         readme_score, readme_keywords = self.analyze_text_for_django_keywords(readme_content)
        
#         # Step 4: Analyze description for Django keywords
#         desc_score, desc_keywords = self.analyze_text_for_django_keywords(repo_description)
        
#         # Step 5: Check repository name for Django indicators
#         name_score, name_keywords = self.analyze_text_for_django_keywords(repo_name.replace('-', ' ').replace('_', ' '))
        
#         # Step 6: Analyze file names
#         files_text = ' '.join(django_files)
#         files_score, files_keywords = self.analyze_text_for_django_keywords(files_text)
        
#         # Combine all keywords and scores
#         all_keywords = list(set(readme_keywords + desc_keywords + name_keywords + files_keywords))
#         total_score = readme_score + desc_score + name_score + files_score
        
#         # Bonus points for having Django files
#         if django_files:
#             total_score += 50  # Significant bonus for having Django project structure
        
#         # Determine if this is a Django project
#         is_django = total_score >= 30 or len(django_files) >= 2
        
#         if not is_django:
#             print(f"❌ Not a Django project (score: {total_score:.1f})")
#             return None
        
#         print(f"✅ Django project detected! (score: {total_score:.1f})")
#         print(f"🔧 Keywords found: {', '.join(all_keywords[:5])}")
#         print(f"📁 Django files: {len(django_files)}")
        
#         # Determine project type
#         project_type = self.determine_project_type(readme_content, django_files, all_keywords)
        
#         # Extract tech stack
#         tech_stack = []
#         tech_indicators = ['python', 'django', 'postgresql', 'mysql', 'redis', 'celery', 'docker', 'nginx', 'gunicorn']
#         combined_text = f"{readme_content} {repo_description}".lower()
        
#         for tech in tech_indicators:
#             if tech in combined_text or tech in files_text.lower():
#                 tech_stack.append(tech.title())
        
#         # Build relevance reasons
#         relevance_reasons = []
#         if django_files:
#             relevance_reasons.append(f"Contains {len(django_files)} Django project files")
#         if readme_keywords:
#             relevance_reasons.append(f"README mentions Django-related keywords")
#         if desc_keywords:
#             relevance_reasons.append(f"Repository description contains Django terms")
#         if files_score > 20:
#             relevance_reasons.append(f"Strong Django file structure detected")
        
#         return RepositoryAnalysis(
#             name=repo_name,
#             description=repo_description,
#             readme_content=readme_content[:500] + "..." if len(readme_content) > 500 else readme_content,
#             django_score=total_score,
#             matched_keywords=all_keywords,
#             project_type=project_type,
#             tech_stack=tech_stack,
#             repository_url=repo['html_url'],
#             is_django_project=True,
#             relevance_reasons=relevance_reasons,
#             file_indicators=django_files
#         )

#     def analyze_github_profile(self, username: str, max_repos: int = 25) -> GitHubProfileScore:
#         """Analyze entire GitHub profile for Django projects"""
#         start_time = time.time()
        
#         print(f"🚀 Starting Django analysis for GitHub user: {username}")
#         print("=" * 60)
        
#         # Get all repositories
#         repositories = self.get_repositories(username, max_repos)
        
#         if not repositories:
#             return GitHubProfileScore(
#                 username=username,
#                 total_repositories=0,
#                 django_repositories=[],
#                 overall_django_score=0.0,
#                 total_keywords_matched=0,
#                 processing_time=time.time() - start_time,
#                 summary="No repositories found or unable to access GitHub profile",
#                 recommendations=["Ensure the username is correct and profile is public"]
#             )
        
#         print(f"📊 Found {len(repositories)} repositories to analyze")
        
#         # Analyze each repository
#         django_repositories = []
        
#         for i, repo in enumerate(repositories, 1):
#             print(f"\n--- Repository {i}/{len(repositories)} ---")
            
#             analysis = self.analyze_single_repository(username, repo)
#             if analysis:
#                 django_repositories.append(analysis)
            
#             # Add delay to avoid rate limiting
#             if i % 5 == 0:
#                 print("⏸️ Pausing to avoid rate limits...")
#                 time.sleep(2)
        
#         # Sort Django repositories by score
#         django_repositories.sort(key=lambda x: x.django_score, reverse=True)
        
#         # Calculate overall metrics
#         if django_repositories:
#             overall_score = sum(repo.django_score for repo in django_repositories) / len(django_repositories)
#             all_keywords = set()
#             for repo in django_repositories:
#                 all_keywords.update(repo.matched_keywords)
            
#             total_keywords = len(all_keywords)
#         else:
#             overall_score = 0.0
#             total_keywords = 0
        
#         # Generate summary
#         if django_repositories:
#             summary = f"Found {len(django_repositories)} Django projects out of {len(repositories)} repositories. "
#             summary += f"Strong Django experience demonstrated with average project score of {overall_score:.1f}/100."
#         else:
#             summary = f"No Django projects detected in {len(repositories)} repositories analyzed. "
#             summary += "Consider creating Django projects or improving project documentation."
        
#         # Generate recommendations
#         recommendations = []
#         if django_repositories:
#             if len(django_repositories) >= 3:
#                 recommendations.append("Excellent Django portfolio! Consider highlighting your best projects in README files.")
#             else:
#                 recommendations.append("Good Django foundation. Consider building more diverse Django projects.")
            
#             # Check for specific project types
#             project_types = set(repo.project_type for repo in django_repositories)
#             if "Django REST API" not in [pt for pt in project_types]:
#                 recommendations.append("Consider building a Django REST API project to showcase API development skills.")
            
#             if not any("ecommerce" in pt.lower() for pt in project_types):
#                 recommendations.append("An e-commerce project would demonstrate complex Django application development.")
                
#         else:
#             recommendations = [
#                 "Create Django projects with clear README documentation",
#                 "Include manage.py, models.py, views.py to show Django project structure",
#                 "Document your Django projects with setup instructions and features",
#                 "Consider building: Blog, E-commerce site, REST API, Portfolio website"
#             ]
        
#         processing_time = time.time() - start_time
        
#         return GitHubProfileScore(
#             username=username,
#             total_repositories=len(repositories),
#             django_repositories=django_repositories,
#             overall_django_score=overall_score,
#             total_keywords_matched=total_keywords,
#             processing_time=processing_time,
#             summary=summary,
#             recommendations=recommendations
#         )

# # Convenience function for easy usage
# def analyze_django_github_profile(username: str, github_token: str = None, max_repos: int = 25) -> GitHubProfileScore:
#     """
#     Analyze a GitHub profile specifically for Django projects
    
#     Args:
#         username: GitHub username to analyze
#         github_token: GitHub personal access token (optional but recommended)
#         max_repos: Maximum number of repositories to analyze
    
#     Returns:
#         GitHubProfileScore with detailed Django project analysis
#     """
#     analyzer = ImprovedDjangoGitHubAnalyzer(github_token=github_token)
#     return analyzer.analyze_github_profile(username, max_repos)

# # Test the analyzer
# if __name__ == "__main__":
#     # Replace with your actual GitHub token for higher rate limits
    
#     result = analyze_django_github_profile(
#         username="sathwikshetty33",
#         github_token=GITHUB_TOKEN,  # Remove this line if you don't have a token
#         max_repos=20
#     )
    
#     # Display results
#     print("\n" + "="*80)
#     print("🎯 DJANGO GITHUB PROFILE ANALYSIS RESULTS")
#     print("="*80)
    
#     print(f"👤 Username: {result.username}")
#     print(f"📊 Total Repositories Analyzed: {result.total_repositories}")
#     print(f"🐍 Django Projects Found: {len(result.django_repositories)}")
#     print(f"🎯 Overall Django Score: {result.overall_django_score:.1f}/100")
#     print(f"🔧 Total Keywords Matched: {result.total_keywords_matched}")
#     print(f"⏱️ Processing Time: {result.processing_time:.1f} seconds")
    
#     print(f"\n📝 Summary:")
#     print(f"   {result.summary}")
    
#     if result.django_repositories:
#         print(f"\n🐍 Django Projects Found:")
#         print("-" * 50)
        
#         for i, repo in enumerate(result.django_repositories, 1):
#             print(f"\n{i}. 📦 {repo.name}")
#             print(f"   🎯 Django Score: {repo.django_score:.1f}/100")
#             print(f"   📂 Project Type: {repo.project_type}")
#             print(f"   🔧 Tech Stack: {', '.join(repo.tech_stack) if repo.tech_stack else 'Not specified'}")
#             print(f"   📄 Keywords: {', '.join(repo.matched_keywords[:5])}")
#             print(f"   📁 Django Files: {len(repo.file_indicators)}")
#             print(f"   🌐 URL: {repo.repository_url}")
            
#             if repo.description:
#                 print(f"   📝 Description: {repo.description[:100]}...")
            
#             print(f"   ✅ Why it's relevant:")
#             for reason in repo.relevance_reasons:
#                 print(f"      • {reason}")
    
#     print(f"\n💡 Recommendations:")
#     for i, rec in enumerate(result.recommendations, 1):
#         print(f"   {i}. {rec}")
    
#     print("\n" + "="*80)