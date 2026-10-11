const mongoose = require('mongoose');
const Room = require('../models/Room');
require('dotenv').config();

const restApiRoom = {
  "slug": "intro-restful-apis-backend-basics",
  "title": "Introduction to RESTful APIs (Backend Development Basics)",
  "short_description": "Learn the fundamentals of REST APIs and build your first Express.js endpoint from scratch",
  "long_description_markdown": "# Welcome to the World of APIs! 🚀\n\nAb dekh bhai, ye hi base hai har backend project ka! APIs are the backbone of modern web development, connecting frontend applications to databases and enabling communication between different services.\n\n## What You'll Learn\n\nIn this room, you'll discover how web applications communicate behind the scenes. We'll start with the basics of HTTP and REST architecture, then dive into building your first API using Node.js and Express. By the end, you'll understand how to create endpoints that can handle different types of requests and return JSON data.\n\n## Learning Path\n\n1. **Understanding APIs and HTTP** - Learn what APIs are and how HTTP requests work\n2. **REST Architecture Principles** - Master the four main HTTP methods (GET, POST, PUT, DELETE)\n3. **Building Your First API** - Create a simple Express.js server with CRUD operations\n\nThis hands-on approach will give you the confidence to start building backend services and understand how modern web applications work under the hood.",
  "difficulty": "Beginner",
  "category": "Development",
  "tags": ["REST", "API", "HTTP", "Express.js", "Node.js", "Backend", "CRUD", "JSON"],
  "cover_image_url": "https://placeholder.com/600x400/1e293b/60a5fa?text=REST+API+Basics",
  "creator": "CyberVerse Team",
  "estimated_time_minutes": 40,
  "prerequisites": ["Basic understanding of JavaScript", "Familiarity with command line", "Text editor installed"],
  "learning_objectives": [
    "Understand what APIs are and how they enable communication between applications",
    "Master the four main HTTP methods (GET, POST, PUT, DELETE) and when to use each",
    "Build a simple Express.js server with basic CRUD operations",
    "Test API endpoints using tools like Postman or curl",
    "Handle JSON data in API requests and responses"
  ],
  "topics": [
    {
      "id": 1,
      "title": "What is an API and How Does HTTP Work?",
      "order": 1,
      "estimated_time_minutes": 12,
      "content_markdown": "# Understanding APIs and HTTP\n\n## What is an API?\n\nAn **API (Application Programming Interface)** is like a waiter in a restaurant. You (the client) tell the waiter (API) what you want from the menu (available endpoints), and the waiter brings your order from the kitchen (server/database).\n\n### Real-World Example\nWhen you check the weather on your phone:\n1. Your app sends a request to a weather API\n2. The API fetches data from weather databases\n3. The API returns the weather data to your app\n4. Your app displays the weather information\n\n## HTTP Basics\n\n**HTTP (HyperText Transfer Protocol)** is the language that web browsers and servers use to communicate.\n\n### HTTP Request Structure\n```\nGET /api/users HTTP/1.1\nHost: example.com\nContent-Type: application/json\n```\n\n### HTTP Response Structure\n```\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{\n  \"users\": [\n    {\"id\": 1, \"name\": \"Ahmed\"}\n  ]\n}\n```\n\n## Common HTTP Status Codes\n\n- **200 OK** - Request successful\n- **201 Created** - Resource created successfully\n- **400 Bad Request** - Invalid request\n- **404 Not Found** - Resource not found\n- **500 Internal Server Error** - Server error\n\n## Key Takeaways\n\n- APIs enable different applications to communicate\n- HTTP is the protocol used for web communication\n- Every HTTP request has a method, URL, headers, and optional body\n- HTTP responses include status codes and data"
    }
  ],
  "quizzes": [
    {
      "id": 1,
      "title": "REST API Fundamentals Quiz",
      "order": 1,
      "time_limit_seconds": 300,
      "pass_percentage": 70,
      "questions": [
        {
          "id": 1,
          "type": "single",
          "question_text": "Which HTTP method should you use to retrieve data from an API?",
          "options": ["GET", "POST", "PUT", "DELETE"],
          "correct_answer": "GET",
          "points": 10,
          "explanation": "GET is used to retrieve data from a server. It's a safe method that doesn't modify any data."
        }
      ]
    }
  ],
  "exercises": [
    {
      "id": 1,
      "title": "HTTP Methods Matching Challenge",
      "order": 1,
      "type": "static",
      "description_markdown": "## Match the HTTP Methods\n\nFor each scenario below, identify the correct HTTP method that should be used:\n\n### Scenarios:\n1. **Adding a new product to an e-commerce catalog**\n2. **Viewing a user's profile information**\n3. **Updating a customer's shipping address**\n4. **Removing a blog post from a website**\n5. **Fetching a list of all available courses**\n\n### Your Task:\nType the correct HTTP method (GET, POST, PUT, DELETE) for each scenario in order, separated by commas.\n\n**Example format:** POST, GET, PUT, DELETE, GET",
      "hint": "Remember: POST creates, GET retrieves, PUT updates, DELETE removes",
      "expected_flag": "POST,GET,PUT,DELETE,GET",
      "auto_validate": true,
      "points": 25,
      "admin_note": "STORE HASHED (sha256 + salt) IN PRODUCTION. Validate submissions server-side and rate-limit attempts."
    }
  ],
  "additional_notes": "This room is designed to be beginner-friendly and provides a solid foundation for backend development."
};

async function createRoom() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existingRoom = await Room.findOne({ slug: restApiRoom.slug });
    if (existingRoom) {
      console.log('Room already exists:', restApiRoom.slug);
      return;
    }

    const room = new Room(restApiRoom);
    await room.save();
    
    console.log('✅ REST API Room created successfully!');
    console.log('Slug:', room.slug);
    console.log('Title:', room.title);
    
  } catch (error) {
    console.error('❌ Error creating room:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createRoom();