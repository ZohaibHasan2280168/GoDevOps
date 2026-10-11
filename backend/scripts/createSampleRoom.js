const mongoose = require('mongoose');
const Room = require('../models/Room');
require('dotenv').config();

const createSampleRoom = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if room already exists
    const existingRoom = await Room.findOne({ slug: 'intro-restful-apis-backend-basics' });
    if (existingRoom) {
      console.log('Room already exists, updating...');
      await Room.deleteOne({ slug: 'intro-restful-apis-backend-basics' });
    }

    const sampleRoom = new Room({
      title: 'Introduction to RESTful APIs and Backend Basics',
      slug: 'intro-restful-apis-backend-basics',
      short_description: 'Learn the fundamentals of RESTful APIs and backend development',
      long_description_markdown: `Introduction to RESTful APIs and Backend Basics

This comprehensive course will teach you everything you need to know about RESTful APIs and backend development.

What You'll Learn:
• Understanding REST architecture
• HTTP methods and status codes
• API design best practices
• Backend development fundamentals
• Database integration
• Authentication and security

Prerequisites:
• Basic programming knowledge
• Understanding of web technologies
• Familiarity with JavaScript (recommended)`,
      category: 'Development',
      difficulty: 'Beginner',
      estimated_time_minutes: 20,
      creator: 'CyberVerse Team',
      tags: ['REST', 'API', 'Backend', 'JavaScript', 'Node.js'],
      prerequisites: [
        'Basic programming knowledge',
        'Understanding of HTTP protocol',
        'Familiarity with JavaScript'
      ],
      learning_objectives: [
        'Understand REST architecture principles',
        'Learn HTTP methods and status codes',
        'Design and implement RESTful APIs',
        'Integrate with databases',
        'Implement authentication'
      ],
      topics: [
        {
          id: 1,
          title: 'What is REST?',
          content_markdown: `What is REST?

REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on a stateless, client-server communication protocol.

Key Principles of REST:

1. Stateless: Each request contains all information needed to process it
2. Client-Server: Separation of concerns between client and server
3. Cacheable: Responses should be cacheable when appropriate
4. Uniform Interface: Consistent way to interact with resources
5. Layered System: Architecture can be composed of hierarchical layers

REST vs SOAP

REST is simpler and more lightweight compared to SOAP (Simple Object Access Protocol).

Example REST endpoints:
GET /api/users/123
POST /api/users
PUT /api/users/123
DELETE /api/users/123`,
          estimated_time_minutes: 3
        },
        {
          id: 2,
          title: 'HTTP Methods and Status Codes',
          content_markdown: `HTTP Methods and Status Codes

Common HTTP Methods:

• GET: Retrieve data from server
• POST: Create new resource
• PUT: Update existing resource (complete replacement)
• PATCH: Partial update of resource
• DELETE: Remove resource

HTTP Status Codes:

2xx Success
• 200 OK: Request successful
• 201 Created: Resource created successfully
• 204 No Content: Successful request with no response body

4xx Client Errors
• 400 Bad Request: Invalid request syntax
• 401 Unauthorized: Authentication required
• 404 Not Found: Resource not found

5xx Server Errors
• 500 Internal Server Error: Generic server error
• 503 Service Unavailable: Server temporarily unavailable

Example API responses:
GET /api/users/123
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com"
}

POST /api/users (201 Created)
{
  "id": 124,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}`,
          estimated_time_minutes: 4
        },
        {
          id: 3,
          title: 'API Design Best Practices',
          content_markdown: `API Design Best Practices

1. Use Nouns for Resources
• Good: /api/users, /api/products
• Bad: /api/getUsers, /api/createProduct

2. Use HTTP Methods Correctly
• GET for reading
• POST for creating
• PUT/PATCH for updating
• DELETE for removing

3. Use Proper Status Codes
Return appropriate HTTP status codes for different scenarios.

4. Version Your APIs
/api/v1/users
/api/v2/users

5. Use Consistent Naming
• Use lowercase letters
• Use hyphens for multi-word resources
• Be consistent across all endpoints

6. Implement Proper Error Handling
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": {
      "field": "email",
      "value": "invalid-email"
    }
  }
}`,
          estimated_time_minutes: 5
        },
        {
          id: 4,
          title: 'Database Integration',
          content_markdown: `Database Integration

Connecting your API to a database is essential for persistent data storage.

Common Database Types:
• SQL Databases: MySQL, PostgreSQL, SQLite
• NoSQL Databases: MongoDB, Redis, DynamoDB

Database Operations:
• Create: INSERT new records
• Read: SELECT existing records
• Update: UPDATE existing records
• Delete: DELETE records

Best Practices:
• Use connection pooling
• Implement proper error handling
• Validate data before database operations
• Use transactions for complex operations`,
          estimated_time_minutes: 4
        },
        {
          id: 5,
          title: 'Authentication and Security',
          content_markdown: `Authentication and Security

Securing your API is crucial for protecting user data and preventing unauthorized access.

Authentication Methods:
• JWT (JSON Web Tokens)
• OAuth 2.0
• API Keys
• Session-based authentication

Security Best Practices:
• Use HTTPS for all communications
• Implement rate limiting
• Validate and sanitize all inputs
• Use proper password hashing
• Implement CORS properly`,
          estimated_time_minutes: 4
        }
      ],
      exercises: [
        {
          id: 1,
          title: 'Design a REST Endpoint',
          description_markdown: 'Design a REST endpoint for managing blog posts. What would be the URL for getting all posts?',
          hint: 'Think about using nouns and proper HTTP methods',
          points: 50,
          expected_flag: '/api/posts'
        },
        {
          id: 2,
          title: 'HTTP Status Code',
          description_markdown: 'What HTTP status code should be returned when a user tries to access a resource they don\'t have permission to view?',
          hint: 'This is a client error related to authorization',
          points: 30,
          expected_flag: '403'
        }
      ],
      quizzes: [
        {
          id: 1,
          title: 'REST Fundamentals Quiz',
          pass_percentage: 70,
          time_limit_seconds: 300,
          questions: [
            {
              id: 1,
              question_text: 'Which HTTP method should be used to create a new resource?',
              type: 'single',
              options: ['GET', 'POST', 'PUT', 'DELETE'],
              correct_answer: 'POST',
              points: 10,
              explanation: 'POST is used to create new resources in RESTful APIs.'
            },
            {
              id: 2,
              question_text: 'What does the HTTP status code 404 mean?',
              type: 'single',
              options: ['Server Error', 'Not Found', 'Unauthorized', 'Bad Request'],
              correct_answer: 'Not Found',
              points: 10,
              explanation: '404 Not Found indicates that the requested resource could not be found on the server.'
            },
            {
              id: 3,
              question_text: 'Which of the following are REST principles? (Select all that apply)',
              type: 'multi',
              options: ['Stateless', 'Client-Server', 'Cacheable', 'Stateful'],
              correct_answer: ['Stateless', 'Client-Server', 'Cacheable'],
              points: 15,
              explanation: 'REST principles include Stateless, Client-Server, and Cacheable. Stateful is not a REST principle.'
            }
          ]
        }
      ],
      isActive: true,
      completedBy: []
    });

    await sampleRoom.save();
    console.log('✅ Sample room created successfully!');
    console.log('Room slug:', sampleRoom.slug);
    
  } catch (error) {
    console.error('❌ Error creating sample room:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createSampleRoom();