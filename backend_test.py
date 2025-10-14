import requests
import sys
import json
from datetime import datetime

class TKRCoachingAPITester:
    def __init__(self, base_url="https://tkr-coaching.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                try:
                    error_detail = response.json()
                    error_msg += f" - {error_detail}"
                except:
                    error_msg += f" - {response.text[:200]}"
                
                self.log_test(name, False, error_msg)
                return False, {}

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request failed: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_user_registration(self):
        """Test user registration"""
        test_user_data = {
            "email": f"test_user_{datetime.now().strftime('%H%M%S')}@example.com",
            "password": "TestPass123!",
            "name": "Test User"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_user_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"   Registered user: {response['user']['email']}")
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        # First register a user
        test_email = f"login_test_{datetime.now().strftime('%H%M%S')}@example.com"
        register_data = {
            "email": test_email,
            "password": "TestPass123!",
            "name": "Login Test User"
        }
        
        # Register user first
        success, _ = self.run_test(
            "Pre-register for Login Test",
            "POST",
            "auth/register",
            200,
            data=register_data
        )
        
        if not success:
            return False
        
        # Now test login
        login_data = {
            "email": test_email,
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            print(f"   Login successful for: {response['user']['email']}")
            return True
        return False

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.token:
            self.log_test("Get Current User", False, "No token available")
            return False
        
        return self.run_test("Get Current User", "GET", "auth/me", 200)

    def test_courses_endpoints(self):
        """Test course-related endpoints"""
        results = []
        
        # Get all courses
        success, courses = self.run_test("Get All Courses", "GET", "courses", 200)
        results.append(success)
        
        if success and courses:
            course_id = courses[0]['id']
            print(f"   Found {len(courses)} courses")
            
            # Get specific course
            success, _ = self.run_test(
                "Get Specific Course",
                "GET",
                f"courses/{course_id}",
                200
            )
            results.append(success)
            
            # Get course lessons
            success, _ = self.run_test(
                "Get Course Lessons",
                "GET",
                f"courses/{course_id}/lessons",
                200
            )
            results.append(success)
        
        # Test filtering
        success, _ = self.run_test(
            "Filter Courses by Category",
            "GET",
            "courses?category=sales",
            200
        )
        results.append(success)
        
        success, _ = self.run_test(
            "Filter Courses by Tier",
            "GET",
            "courses?tier=bronze",
            200
        )
        results.append(success)
        
        return all(results)

    def test_membership_endpoints(self):
        """Test membership-related endpoints"""
        return self.run_test("Get Membership Tiers", "GET", "membership/tiers", 200)

    def test_resources_endpoints(self):
        """Test resources endpoints"""
        results = []
        
        # Get all resources
        success, _ = self.run_test("Get All Resources", "GET", "resources", 200)
        results.append(success)
        
        # Test filtering by type
        success, _ = self.run_test(
            "Filter Resources by Type",
            "GET",
            "resources?resource_type=daily_tip",
            200
        )
        results.append(success)
        
        return all(results)

    def test_podcast_endpoints(self):
        """Test podcast endpoints"""
        results = []
        
        # Get all episodes
        success, episodes = self.run_test("Get Podcast Episodes", "GET", "podcast/episodes", 200)
        results.append(success)
        
        if success and episodes:
            print(f"   Found {len(episodes)} podcast episodes")
        
        # Test filtering by season
        success, _ = self.run_test(
            "Filter Episodes by Season",
            "GET",
            "podcast/episodes?season=1",
            200
        )
        results.append(success)
        
        return all(results)

    def test_community_endpoints(self):
        """Test community endpoints"""
        results = []
        
        # Get all posts
        success, posts = self.run_test("Get Community Posts", "GET", "community/posts", 200)
        results.append(success)
        
        if success and posts:
            post_id = posts[0]['id']
            print(f"   Found {len(posts)} community posts")
            
            # Get specific post
            success, _ = self.run_test(
                "Get Specific Community Post",
                "GET",
                f"community/posts/{post_id}",
                200
            )
            results.append(success)
        
        return all(results)

    def test_news_endpoints(self):
        """Test news endpoints"""
        results = []
        
        # Get news articles
        success, articles = self.run_test("Get News Articles", "GET", "news/articles", 200)
        results.append(success)
        
        if success and articles:
            print(f"   Found {len(articles)} news articles")
        
        # Get news sources
        success, _ = self.run_test("Get News Sources", "GET", "news/sources", 200)
        results.append(success)
        
        return all(results)

    def test_admin_analytics(self):
        """Test admin analytics endpoint"""
        success, analytics = self.run_test("Get Content Analytics", "GET", "admin/analytics/content", 200)
        
        if success and analytics:
            print(f"   Analytics: {analytics.get('total_users', 0)} users, {analytics.get('total_courses', 0)} courses")
        
        return success

    def test_invalid_endpoints(self):
        """Test error handling for invalid endpoints"""
        results = []
        
        # Test 404 for non-existent course
        success, _ = self.run_test(
            "Non-existent Course (404)",
            "GET",
            "courses/non-existent-id",
            404
        )
        results.append(success)
        
        # Test 404 for non-existent community post
        success, _ = self.run_test(
            "Non-existent Community Post (404)",
            "GET",
            "community/posts/non-existent-id",
            404
        )
        results.append(success)
        
        return all(results)

    def test_authentication_required_endpoints(self):
        """Test endpoints that require authentication"""
        # Save current token
        original_token = self.token
        self.token = None
        
        # Test protected endpoint without token
        success, _ = self.run_test(
            "Protected Endpoint Without Token (401)",
            "GET",
            "auth/me",
            401
        )
        
        # Test with invalid token
        self.token = "invalid-token"
        success2, _ = self.run_test(
            "Protected Endpoint With Invalid Token (401)",
            "GET",
            "auth/me",
            401
        )
        
        # Restore token
        self.token = original_token
        
        return success and success2

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting TKR Coaching API Tests")
        print("=" * 50)
        
        # Test basic connectivity
        self.test_root_endpoint()
        
        # Test authentication
        self.test_user_registration()
        self.test_user_login()
        self.test_get_current_user()
        
        # Test main endpoints
        self.test_courses_endpoints()
        self.test_membership_endpoints()
        self.test_resources_endpoints()
        self.test_podcast_endpoints()
        self.test_community_endpoints()
        self.test_news_endpoints()
        self.test_admin_analytics()
        
        # Test error handling
        self.test_invalid_endpoints()
        self.test_authentication_required_endpoints()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"❌ {self.tests_run - self.tests_passed} tests failed")
            return 1

def main():
    tester = TKRCoachingAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())