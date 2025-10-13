from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection with retry logic
async def get_mongo_client():
    """Get MongoDB client with retry logic"""
    mongo_url = os.environ['MONGO_URL']
    max_retries = 5
    retry_delay = 2
    
    for attempt in range(max_retries):
        try:
            client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=5000)
            # Test connection
            await client.admin.command('ping')
            return client
        except Exception as e:
            if attempt < max_retries - 1:
                logging.warning(f"MongoDB connection attempt {attempt + 1} failed: {str(e)}. Retrying in {retry_delay}s...")
                await asyncio.sleep(retry_delay)
                retry_delay *= 2  # Exponential backoff
            else:
                logging.error(f"Failed to connect to MongoDB after {max_retries} attempts")
                raise

# Initialize MongoDB connection
try:
    client = AsyncIOMotorClient(os.environ['MONGO_URL'], serverSelectionTimeoutMS=10000)
    db = client[os.environ['DB_NAME']]
except Exception as e:
    logging.error(f"MongoDB initialization error: {str(e)}")
    # Create a dummy db object to prevent app crash
    client = None
    db = None

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24 * 7  # 7 days

security = HTTPBearer()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ==================== Models ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    membership_tier: str = "free"  # free, bronze, silver, gold
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    user: User

class Course(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    thumbnail: str
    instructor: str
    duration: str
    lesson_count: int
    tier: str  # free, bronze, silver, gold
    category: str
    difficulty: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Lesson(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: str
    title: str
    description: str
    duration: str
    video_url: Optional[str] = None
    order: int

class MembershipTier(BaseModel):
    name: str
    monthly_price: int
    yearly_price: int
    features: List[str]
    popular: bool = False

class Resource(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    resource_type: str  # daily_tip, ebook, workbook, article, market_report
    thumbnail: Optional[str] = None
    download_url: Optional[str] = None
    tier_required: str = "free"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PodcastEpisode(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    audio_url: str
    duration: str
    season: int
    episode: int
    thumbnail: str
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CommunityPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    title: str
    content: str
    replies_count: int = 0
    likes_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsArticle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    source: str
    url: str
    thumbnail: Optional[str] = None
    published_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NewsSource(BaseModel):
    name: str
    logo: str
    url: str

# ==================== Auth Helpers ====================

def create_jwt_token(user_id: str, email: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    payload = verify_jwt_token(token)
    user = await db.users.find_one({"id": payload['user_id']}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ==================== Auth Routes ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_password = bcrypt.hashpw(user_data.password.encode(), bcrypt.gensalt())
    
    # Create user
    user_obj = User(email=user_data.email, name=user_data.name)
    user_dict = user_obj.model_dump()
    user_dict['password'] = hashed_password.decode()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Create token
    token = create_jwt_token(user_obj.id, user_obj.email)
    
    return TokenResponse(token=token, user=user_obj)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not bcrypt.checkpw(credentials.password.encode(), user['password'].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    token = create_jwt_token(user['id'], user['email'])
    
    # Remove password from response
    user.pop('password', None)
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return TokenResponse(token=token, user=User(**user))

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    if isinstance(current_user['created_at'], str):
        current_user['created_at'] = datetime.fromisoformat(current_user['created_at'])
    return User(**current_user)

@api_router.post("/auth/google")
async def google_auth():
    # Placeholder for Google OAuth integration
    raise HTTPException(status_code=501, detail="Google OAuth not implemented yet")

# ==================== Course Routes ====================

@api_router.get("/courses", response_model=List[Course])
async def get_courses(category: Optional[str] = None, tier: Optional[str] = None):
    query = {}
    if category:
        query['category'] = category
    if tier:
        query['tier'] = tier
    
    courses = await db.courses.find(query, {"_id": 0}).to_list(1000)
    for course in courses:
        if isinstance(course.get('created_at'), str):
            course['created_at'] = datetime.fromisoformat(course['created_at'])
    return courses

@api_router.get("/courses/{course_id}", response_model=Course)
async def get_course(course_id: str):
    course = await db.courses.find_one({"id": course_id}, {"_id": 0})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    if isinstance(course.get('created_at'), str):
        course['created_at'] = datetime.fromisoformat(course['created_at'])
    return Course(**course)

@api_router.get("/courses/{course_id}/lessons", response_model=List[Lesson])
async def get_course_lessons(course_id: str):
    lessons = await db.lessons.find({"course_id": course_id}, {"_id": 0}).sort("order", 1).to_list(1000)
    return lessons

# ==================== Membership Routes ====================

@api_router.get("/membership/tiers", response_model=List[MembershipTier])
async def get_membership_tiers():
    return [
        MembershipTier(
            name="free",
            monthly_price=0,
            yearly_price=0,
            features=[
                "Daily coaching tips",
                "Browse course catalog (preview only)",
                "Limited community access (read-only)",
                "Full podcast access (ALL episodes free!)",
                "Industry news feed"
            ]
        ),
        MembershipTier(
            name="bronze",
            monthly_price=29,
            yearly_price=290,
            features=[
                "Everything in Free, plus:",
                "Access to Bronze-tier courses",
                "Full community participation",
                "Downloadable resources"
            ]
        ),
        MembershipTier(
            name="silver",
            monthly_price=79,
            yearly_price=790,
            features=[
                "Everything in Bronze, plus:",
                "Access to ALL courses (Bronze + Silver tier)",
                "Weekly live coaching sessions",
                "Priority community support",
                "Exclusive templates & scripts"
            ],
            popular=True
        ),
        MembershipTier(
            name="gold",
            monthly_price=149,
            yearly_price=1490,
            features=[
                "Everything in Silver, plus:",
                "VIP access to ALL premium content",
                "Monthly 1-on-1 coaching session",
                "Advanced marketing resources",
                "Early access to new content",
                "Exclusive Gold member events"
            ]
        )
    ]

@api_router.post("/membership/subscribe")
async def subscribe_membership(current_user: dict = Depends(get_current_user)):
    # Placeholder for Stripe integration
    raise HTTPException(status_code=501, detail="Stripe subscription not implemented yet")

# ==================== Resources Routes ====================

@api_router.get("/resources", response_model=List[Resource])
async def get_resources(resource_type: Optional[str] = None):
    query = {}
    if resource_type:
        query['resource_type'] = resource_type
    
    resources = await db.resources.find(query, {"_id": 0}).to_list(1000)
    for resource in resources:
        if isinstance(resource.get('created_at'), str):
            resource['created_at'] = datetime.fromisoformat(resource['created_at'])
    return resources

# ==================== Podcast Routes ====================

@api_router.get("/podcast/episodes", response_model=List[PodcastEpisode])
async def get_podcast_episodes(season: Optional[int] = None):
    query = {}
    if season:
        query['season'] = season
    
    episodes = await db.podcast_episodes.find(query, {"_id": 0}).sort("published_at", -1).to_list(1000)
    for episode in episodes:
        if isinstance(episode.get('published_at'), str):
            episode['published_at'] = datetime.fromisoformat(episode['published_at'])
    return episodes

# ==================== Community Routes ====================

@api_router.get("/community/posts", response_model=List[CommunityPost])
async def get_community_posts():
    posts = await db.community_posts.find({}, {"_id": 0}).sort("created_at", -1).limit(50).to_list(50)
    for post in posts:
        if isinstance(post.get('created_at'), str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
    return posts

@api_router.get("/community/posts/{post_id}", response_model=CommunityPost)
async def get_community_post(post_id: str):
    post = await db.community_posts.find_one({"id": post_id}, {"_id": 0})
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if isinstance(post.get('created_at'), str):
        post['created_at'] = datetime.fromisoformat(post['created_at'])
    return CommunityPost(**post)

# ==================== News Routes ====================

@api_router.get("/news/articles", response_model=List[NewsArticle])
async def get_news_articles():
    articles = await db.news_articles.find({}, {"_id": 0}).sort("published_at", -1).limit(50).to_list(50)
    for article in articles:
        if isinstance(article.get('published_at'), str):
            article['published_at'] = datetime.fromisoformat(article['published_at'])
    return articles

@api_router.get("/news/sources", response_model=List[NewsSource])
async def get_news_sources():
    return [
        NewsSource(name="HousingWire", logo="https://via.placeholder.com/100x50?text=HousingWire", url="https://www.housingwire.com"),
        NewsSource(name="Inman", logo="https://via.placeholder.com/100x50?text=Inman", url="https://www.inman.com"),
        NewsSource(name="Mortgage News Daily", logo="https://via.placeholder.com/100x50?text=MND", url="https://www.mortgagenewsdaily.com"),
        NewsSource(name="Realtor Magazine", logo="https://via.placeholder.com/100x50?text=Realtor", url="https://www.nar.realtor/magazine")
    ]

# ==================== Admin Analytics Routes ====================

@api_router.get("/admin/analytics/content")
async def get_content_analytics():
    return {
        "total_users": await db.users.count_documents({}),
        "total_courses": await db.courses.count_documents({}),
        "total_podcast_episodes": await db.podcast_episodes.count_documents({}),
        "total_community_posts": await db.community_posts.count_documents({}),
        "membership_breakdown": {
            "free": await db.users.count_documents({"membership_tier": "free"}),
            "bronze": await db.users.count_documents({"membership_tier": "bronze"}),
            "silver": await db.users.count_documents({"membership_tier": "silver"}),
            "gold": await db.users.count_documents({"membership_tier": "gold"})
        }
    }

# ==================== Root Route ====================

@api_router.get("/")
async def root():
    return {"message": "TKR Coaching API - Transform Your Real Estate Career"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.on_event("startup")
async def startup_seed_data():
    """Seed database with sample data if empty"""
    # Skip seeding in production or if SKIP_SEEDING env var is set
    skip_seeding = os.environ.get('SKIP_SEEDING', 'false').lower() == 'true'
    if skip_seeding:
        logger.info("Skipping data seeding (SKIP_SEEDING=true)")
        return
    
    try:
        # Seed courses
        if await db.courses.count_documents({}) == 0:
        sample_courses = [
            {
                "id": str(uuid.uuid4()),
                "title": "Mastering Listing Presentations",
                "description": "Learn proven strategies to win more listings and impress sellers with confidence.",
                "thumbnail": "https://via.placeholder.com/400x300?text=Listing+Presentations",
                "instructor": "Sarah Martinez",
                "duration": "3h 20min",
                "lesson_count": 12,
                "tier": "bronze",
                "category": "sales",
                "difficulty": "intermediate",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Social Media Marketing for Agents",
                "description": "Grow your brand and generate leads through strategic social media marketing.",
                "thumbnail": "https://via.placeholder.com/400x300?text=Social+Media+Marketing",
                "instructor": "James Chen",
                "duration": "4h 15min",
                "lesson_count": 18,
                "tier": "silver",
                "category": "marketing",
                "difficulty": "beginner",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Negotiation Masterclass",
                "description": "Master the art of negotiation to close more deals at better prices.",
                "thumbnail": "https://via.placeholder.com/400x300?text=Negotiation+Masterclass",
                "instructor": "Michael Davis",
                "duration": "2h 45min",
                "lesson_count": 10,
                "tier": "gold",
                "category": "negotiation",
                "difficulty": "advanced",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "First-Time Homebuyer Specialist",
                "description": "Become the go-to expert for first-time homebuyers in your market.",
                "thumbnail": "https://via.placeholder.com/400x300?text=First+Time+Buyers",
                "instructor": "Emily Rodriguez",
                "duration": "3h 50min",
                "lesson_count": 15,
                "tier": "bronze",
                "category": "specialization",
                "difficulty": "beginner",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Building a Million Dollar Database",
                "description": "Learn how to build and nurture a database that generates consistent referrals.",
                "thumbnail": "https://via.placeholder.com/400x300?text=Million+Dollar+Database",
                "instructor": "David Thompson",
                "duration": "5h 10min",
                "lesson_count": 20,
                "tier": "silver",
                "category": "business",
                "difficulty": "intermediate",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Luxury Real Estate Excellence",
                "description": "Position yourself as the luxury market expert with proven high-end strategies.",
                "thumbnail": "https://via.placeholder.com/400x300?text=Luxury+Real+Estate",
                "instructor": "Victoria Sterling",
                "duration": "4h 30min",
                "lesson_count": 16,
                "tier": "gold",
                "category": "specialization",
                "difficulty": "advanced",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.courses.insert_many(sample_courses)
        logger.info("Seeded sample courses")
    
    # Seed podcast episodes
    if await db.podcast_episodes.count_documents({}) == 0:
        sample_episodes = [
            {
                "id": str(uuid.uuid4()),
                "title": "5 Scripts That Close Every Listing",
                "description": "Learn the exact words top agents use to win seller confidence and secure listings.",
                "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                "duration": "42:15",
                "season": 1,
                "episode": 1,
                "thumbnail": "https://via.placeholder.com/400x400?text=Episode+1",
                "published_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "From Zero to Hero: My First Year Success",
                "description": "Interview with an agent who closed 38 deals in their first year. Hear their exact strategy.",
                "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                "duration": "38:20",
                "season": 1,
                "episode": 2,
                "thumbnail": "https://via.placeholder.com/400x400?text=Episode+2",
                "published_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Market Shift Strategies: Thriving in Any Market",
                "description": "How to adapt your business strategy during market shifts and economic uncertainty.",
                "audio_url": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
                "duration": "45:30",
                "season": 1,
                "episode": 3,
                "thumbnail": "https://via.placeholder.com/400x400?text=Episode+3",
                "published_at": (datetime.now(timezone.utc) - timedelta(days=14)).isoformat()
            }
        ]
        await db.podcast_episodes.insert_many(sample_episodes)
        logger.info("Seeded sample podcast episodes")
    
    # Seed resources
    if await db.resources.count_documents({}) == 0:
        sample_resources = [
            {
                "id": str(uuid.uuid4()),
                "title": "Follow up with all new leads within 5 minutes",
                "description": "Speed to lead matters. Studies show contacting leads within 5 minutes increases conversion by 391%.",
                "resource_type": "daily_tip",
                "tier_required": "free",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "The Complete Open House Playbook",
                "description": "Everything you need to host successful open houses that generate leads and listings.",
                "resource_type": "ebook",
                "thumbnail": "https://via.placeholder.com/300x400?text=Open+House+eBook",
                "download_url": "#",
                "tier_required": "bronze",
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Buyer Consultation Workbook",
                "description": "Step-by-step workbook to conduct professional buyer consultations that convert.",
                "resource_type": "workbook",
                "thumbnail": "https://via.placeholder.com/300x400?text=Buyer+Workbook",
                "download_url": "#",
                "tier_required": "silver",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        await db.resources.insert_many(sample_resources)
        logger.info("Seeded sample resources")
    
    # Seed community posts
    if await db.community_posts.count_documents({}) == 0:
        sample_posts = [
            {
                "id": str(uuid.uuid4()),
                "user_id": str(uuid.uuid4()),
                "user_name": "Jennifer Mills",
                "title": "Just closed my first $1M listing!",
                "content": "Thanks to the negotiation course, I just closed my first million-dollar listing. The strategies really work!",
                "replies_count": 24,
                "likes_count": 87,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "user_id": str(uuid.uuid4()),
                "user_name": "Mark Stevens",
                "title": "Best CRM for new agents?",
                "content": "I'm looking for recommendations on CRM systems. What's everyone using?",
                "replies_count": 15,
                "likes_count": 42,
                "created_at": (datetime.now(timezone.utc) - timedelta(hours=5)).isoformat()
            }
        ]
        await db.community_posts.insert_many(sample_posts)
        logger.info("Seeded sample community posts")
    
    # Seed news articles
    if await db.news_articles.count_documents({}) == 0:
        sample_articles = [
            {
                "id": str(uuid.uuid4()),
                "title": "Mortgage Rates Drop to Lowest Level in 6 Months",
                "excerpt": "Average 30-year fixed mortgage rates fell to 6.2% this week, providing relief to homebuyers.",
                "source": "HousingWire",
                "url": "#",
                "thumbnail": "https://via.placeholder.com/600x400?text=Mortgage+Rates",
                "published_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "NAR Settlement: What Agents Need to Know",
                "excerpt": "Breaking down the recent NAR settlement and how it impacts real estate commission practices.",
                "source": "Inman",
                "url": "#",
                "thumbnail": "https://via.placeholder.com/600x400?text=NAR+Settlement",
                "published_at": (datetime.now(timezone.utc) - timedelta(hours=3)).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Housing Inventory Increases for First Time This Year",
                "excerpt": "Active listings are up 12% year-over-year, signaling a shift toward more balanced market conditions.",
                "source": "Realtor Magazine",
                "url": "#",
                "thumbnail": "https://via.placeholder.com/600x400?text=Housing+Inventory",
                "published_at": (datetime.now(timezone.utc) - timedelta(hours=8)).isoformat()
            }
        ]
        await db.news_articles.insert_many(sample_articles)
        logger.info("Seeded sample news articles")
    except Exception as e:
        logger.error(f"Error during database seeding: {str(e)}")
        logger.warning("Continuing without seeding - database may already be populated or will be migrated")
