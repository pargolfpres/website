from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, UploadFile, File, Form
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
import boto3
from botocore.exceptions import ClientError

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

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class PodcastEpisodeUpdate(BaseModel):
    title: str
    spotify_url: Optional[str] = None
    audio_url: Optional[str] = None
    description: Optional[str] = ""
    duration: Optional[str] = "45:00"
    
    def get_url(self):
        """Return whichever URL field is populated"""
        return self.spotify_url or self.audio_url or ""

class PageContentUpdate(BaseModel):
    page_name: str  # "about" or "contact"
    content: str

class ContentBlock(BaseModel):
    section: str  # e.g., "homepage_hero", "about_mission", "contact_info"
    content_type: str  # "text", "html", "image", "json"
    data: dict  # Flexible data structure

# ==================== AWS S3 Setup ====================

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name=os.environ.get('AWS_REGION', 'us-east-1')
)
S3_BUCKET = os.environ.get('AWS_S3_BUCKET', 'tkr-coaching-assets')

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
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
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
    """Get content analytics - courses, episodes, resources count"""
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

# ==================== Contact Form ====================

@api_router.post("/contact")
async def submit_contact_form(form: ContactForm):
    """Submit contact form - stores in database for admin review"""
    try:
        contact_data = {
            "id": str(uuid.uuid4()),
            "name": form.name,
            "email": form.email,
            "subject": form.subject,
            "message": form.message,
            "status": "new",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "recipient_email": "info@toddkroberson.com"
        }
        
        await db.contact_submissions.insert_one(contact_data)
        
        # Note: In production, integrate with email service (SendGrid, AWS SES, etc.)
        # to actually send emails to info@toddkroberson.com
        # For now, submissions are stored in MongoDB for admin review
        
        return {
            "success": True,
            "message": "Thank you for your message. We will get back to you soon!",
            "submission_id": contact_data["id"]
        }
    except Exception as e:
        logging.error(f"Error submitting contact form: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to submit contact form")

# ==================== Admin Routes ====================

@api_router.post("/admin/login")
async def admin_login(login_data: AdminLogin):
    """Admin login endpoint"""
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@toddkroberson.com')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')  # Default password
    
    if login_data.email != admin_email:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # For simplicity, using plain text password comparison
    # In production, use hashed passwords
    if login_data.password != admin_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create admin token
    token = create_jwt_token("admin", admin_email)
    
    return {
        "token": token,
        "email": admin_email,
        "role": "admin"
    }

@api_router.post("/admin/upload")
async def upload_file(file: UploadFile = File(...), folder: str = Form("general")):
    """Upload file to S3"""
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{folder}/{uuid.uuid4()}{file_extension}"
        
        # Upload to S3
        s3_client.upload_fileobj(
            file.file,
            S3_BUCKET,
            unique_filename,
            ExtraArgs={'ACL': 'public-read'}
        )
        
        # Generate public URL
        file_url = f"https://{S3_BUCKET}.s3.{os.environ.get('AWS_REGION')}.amazonaws.com/{unique_filename}"
        
        # Store file metadata in database
        file_record = {
            "id": str(uuid.uuid4()),
            "filename": file.filename,
            "s3_key": unique_filename,
            "url": file_url,
            "folder": folder,
            "uploaded_at": datetime.now(timezone.utc).isoformat()
        }
        await db.uploaded_files.insert_one(file_record)
        
        return {
            "success": True,
            "url": file_url,
            "filename": file.filename
        }
    except ClientError as e:
        logging.error(f"S3 upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")
    except Exception as e:
        logging.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to upload file")

@api_router.get("/admin/files")
async def get_uploaded_files(folder: Optional[str] = None):
    """Get list of uploaded files"""
    query = {"folder": folder} if folder else {}
    files = await db.uploaded_files.find(query).to_list(length=100)
    return [{"id": f["id"], "filename": f["filename"], "url": f["url"], "folder": f.get("folder", "general"), "uploaded_at": f["uploaded_at"]} for f in files]

@api_router.post("/admin/podcast/update")
async def update_podcast_episodes(episodes: List[PodcastEpisodeUpdate]):
    """Update podcast episodes"""
    try:
        # Clear existing episodes
        await db.podcast_episodes.delete_many({})
        
        # Add new episodes
        new_episodes = []
        for idx, ep in enumerate(episodes):
            episode_data = {
                "id": str(uuid.uuid4()),
                "title": ep.title,
                "description": ep.description,
                "audio_url": ep.get_url(),  # Use either spotify_url or audio_url
                "duration": ep.duration,
                "season": 1,
                "episode": idx + 1,
                "thumbnail": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop",
                "published_at": (datetime.now(timezone.utc) - timedelta(days=idx*7)).isoformat()
            }
            new_episodes.append(episode_data)
        
        if new_episodes:
            await db.podcast_episodes.insert_many(new_episodes)
        
        return {"success": True, "message": f"Updated {len(new_episodes)} episodes"}
    except Exception as e:
        logging.error(f"Error updating podcasts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update podcast episodes")

@api_router.get("/admin/podcast/list")
async def get_podcast_episodes_admin():
    """Get all podcast episodes for admin"""
    episodes = await db.podcast_episodes.find().to_list(length=100)
    return [{"id": ep["id"], "title": ep["title"], "audio_url": ep.get("audio_url", ""), "description": ep.get("description", ""), "duration": ep.get("duration", "")} for ep in episodes]

@api_router.get("/admin/content/{section}")
async def get_content_section(section: str):
    """Get content for a specific section"""
    content = await db.page_content.find_one({"section": section})
    if not content:
        return {"section": section, "data": {}}
    return {"section": content["section"], "data": content.get("data", {})}

@api_router.post("/admin/content/{section}")
async def update_content_section(section: str, content: dict):
    """Update content for a specific section"""
    try:
        await db.page_content.update_one(
            {"section": section},
            {"$set": {"section": section, "data": content, "updated_at": datetime.now(timezone.utc).isoformat()}},
            upsert=True
        )
        return {"success": True, "message": f"Updated {section}"}
    except Exception as e:
        logging.error(f"Error updating content: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update content")

@api_router.get("/admin/content/all")
async def get_all_content():
    """Get all content sections"""
    content = await db.page_content.find().to_list(length=100)
    return [{"section": c["section"], "data": c.get("data", {})} for c in content]

@api_router.get("/content/{section}")
async def get_public_content(section: str):
    """Public endpoint to get content for frontend"""
    content = await db.page_content.find_one({"section": section})
    if not content:
        return {"section": section, "data": {}}
    return {"section": content["section"], "data": content.get("data", {})}

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
    if client:
        client.close()

@app.on_event("startup")
async def startup_check_db():
    """Check database connection on startup"""
    if db is None:
        logger.error("Database not initialized - some features may not work")
        return
    
    try:
        # Test database connection
        await client.admin.command('ping')
        logger.info("Database connection successful")
        
        # Auto-fix placeholder images in production
        await fix_placeholder_images()
        
        # Auto-sync podcast episodes to match preview
        await sync_podcast_episodes()
    except Exception as e:
        logger.error(f"Database connection failed: {str(e)}")
        logger.warning("App starting without database connection - retry will happen on first request")

async def sync_podcast_episodes():
    """Ensure podcast episodes match the correct Spotify episodes"""
    try:
        # Delete all existing podcast episodes
        await db.podcast_episodes.delete_many({})
        
        # Insert the correct 2 Spotify episodes
        correct_episodes = [
            {
                "id": str(uuid.uuid4()),
                "title": "Latest Episode - TKR Coaching Podcast",
                "description": "Listen to our latest episode on Spotify for real strategies, real results, and real conversations with top-producing agents.",
                "audio_url": "https://open.spotify.com/episode/06cL7lL5z9235PgbiyoXN0",
                "duration": "45:00",
                "season": 1,
                "episode": 1,
                "thumbnail": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop",
                "published_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Previous Episode - TKR Coaching Podcast",
                "description": "Catch up on our previous episode featuring insights and strategies for real estate success.",
                "audio_url": "https://open.spotify.com/episode/0wVNnRnLdRhtZ1mX3znpeg",
                "duration": "42:00",
                "season": 1,
                "episode": 2,
                "thumbnail": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop",
                "published_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
            }
        ]
        
        await db.podcast_episodes.insert_many(correct_episodes)
        logger.info(f"Synced {len(correct_episodes)} podcast episodes")
    except Exception as e:
        logger.error(f"Error syncing podcast episodes: {str(e)}")

async def fix_placeholder_images():
    """Replace any placeholder images with real images"""
    try:
        # Check if we have placeholder images
        placeholder_check = await db.courses.find_one({"thumbnail": {"$regex": "placeholder"}})
        
        if placeholder_check:
            logger.info("Found placeholder images - updating to real images...")
            
            # Update Course Thumbnails
            courses = [
                ("Mastering Listing Presentations", "https://images.unsplash.com/photo-1627161683077-e34782c24d81?w=400&h=300&fit=crop"),
                ("Social Media Marketing for Agents", "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop"),
                ("Negotiation Masterclass", "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop"),
                ("First-Time Homebuyer Specialist", "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop"),
                ("Building a Million Dollar Database", "https://images.unsplash.com/photo-1723095469034-c3cf31e32730?w=400&h=300&fit=crop"),
                ("Luxury Real Estate Excellence", "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400&h=300&fit=crop")
            ]
            
            for title, url in courses:
                await db.courses.update_one({"title": title}, {"$set": {"thumbnail": url}})
            
            # Update Podcast Thumbnails
            podcasts = [
                ("Latest Episode - TKR Coaching Podcast", "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop"),
                ("Previous Episode - TKR Coaching Podcast", "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop")
            ]
            
            for title, url in podcasts:
                await db.podcast_episodes.update_one({"title": title}, {"$set": {"thumbnail": url}})
            
            # Update News Thumbnails
            news = [
                ("Mortgage Rates Drop to Lowest Level in 6 Months", "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=600&h=400&fit=crop"),
                ("NAR Settlement: What Agents Need to Know", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"),
                ("Housing Inventory Increases for First Time This Year", "https://images.unsplash.com/photo-1623001466340-c65619d1682a?w=600&h=400&fit=crop")
            ]
            
            for title, url in news:
                await db.news_articles.update_one({"title": title}, {"$set": {"thumbnail": url}})
            
            logger.info("✅ Placeholder images replaced with real images!")
        else:
            logger.info("No placeholder images found - images are up to date")
            
    except Exception as e:
        logger.warning(f"Could not check/fix placeholder images: {str(e)}")

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
                "title": "Latest Episode - TKR Coaching Podcast",
                "description": "Listen to our latest episode on Spotify for real strategies, real results, and real conversations with top-producing agents.",
                "audio_url": "https://open.spotify.com/episode/06cL7lL5z9235PgbiyoXN0",
                "duration": "45:00",
                "season": 1,
                "episode": 1,
                "thumbnail": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=400&fit=crop",
                "published_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Previous Episode - TKR Coaching Podcast",
                "description": "Catch up on our previous episode featuring insights and strategies for real estate success.",
                "audio_url": "https://open.spotify.com/episode/0wVNnRnLdRhtZ1mX3znpeg",
                "duration": "42:00",
                "season": 1,
                "episode": 2,
                "thumbnail": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop",
                "published_at": (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
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
