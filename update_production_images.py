import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# This script updates the PRODUCTION database with real images
# Run this AFTER deployment to fix the image issue

async def update_production_images():
    # Get production MongoDB URL from environment
    mongo_url = os.environ.get('MONGO_URL')
    if not mongo_url:
        print("ERROR: MONGO_URL not found. This should be run in production environment.")
        return
    
    print(f"Connecting to production database...")
    client = AsyncIOMotorClient(mongo_url)
    db = client["tkr_coaching"]
    
    try:
        # Update Course Thumbnails
        courses = [
            ("Mastering Listing Presentations", "https://images.unsplash.com/photo-1627161683077-e34782c24d81?w=400&h=300&fit=crop"),
            ("Social Media Marketing for Agents", "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop"),
            ("Negotiation Masterclass", "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop"),
            ("First-Time Homebuyer Specialist", "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&h=300&fit=crop"),
            ("Building a Million Dollar Database", "https://images.unsplash.com/photo-1723095469034-c3cf31e32730?w=400&h=300&fit=crop"),
            ("Luxury Real Estate Excellence", "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400&h=300&fit=crop")
        ]
        
        print("\nUpdating Course Images...")
        for title, url in courses:
            result = await db.courses.update_one(
                {"title": title},
                {"$set": {"thumbnail": url}}
            )
            if result.modified_count > 0:
                print(f"✅ Updated: {title}")
            else:
                print(f"⚠️  Not found or already updated: {title}")
        
        # Update Podcast Episode Thumbnails
        podcasts = [
            ("5 Scripts That Close Every Listing", "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop"),
            ("From Zero to Hero: My First Year Success", "https://images.unsplash.com/photo-1695891583421-3cbbf1c2e3bd?w=400&h=400&fit=crop"),
            ("Market Shift Strategies: Thriving in Any Market", "https://images.unsplash.com/photo-1758691736545-5c33b6255dca?w=400&h=400&fit=crop")
        ]
        
        print("\nUpdating Podcast Images...")
        for title, url in podcasts:
            result = await db.podcast_episodes.update_one(
                {"title": title},
                {"$set": {"thumbnail": url}}
            )
            if result.modified_count > 0:
                print(f"✅ Updated: {title}")
            else:
                print(f"⚠️  Not found or already updated: {title}")
        
        # Update News Article Thumbnails
        news = [
            ("Mortgage Rates Drop to Lowest Level in 6 Months", "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=600&h=400&fit=crop"),
            ("NAR Settlement: What Agents Need to Know", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"),
            ("Housing Inventory Increases for First Time This Year", "https://images.unsplash.com/photo-1623001466340-c65619d1682a?w=600&h=400&fit=crop")
        ]
        
        print("\nUpdating News Article Images...")
        for title, url in news:
            result = await db.news_articles.update_one(
                {"title": title},
                {"$set": {"thumbnail": url}}
            )
            if result.modified_count > 0:
                print(f"✅ Updated: {title}")
            else:
                print(f"⚠️  Not found or already updated: {title}")
        
        print("\n✅ All production images updated successfully!")
        print("\nPlease verify at: https://www.toddkroberson.com")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(update_production_images())
