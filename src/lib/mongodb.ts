// MongoDB Integration Example (Not active - for reference only)
/*
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = 'interviewpro';

// Create MongoDB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Collections
const collections = {
  users: () => client.db(dbName).collection('users'),
  interviews: () => client.db(dbName).collection('interviews'),
  questions: () => client.db(dbName).collection('questions'),
  responses: () => client.db(dbName).collection('responses'),
};

// Example schema for collections
const schemas = {
  users: {
    _id: 'ObjectId',
    email: 'string',
    name: 'string',
    createdAt: 'Date',
    updatedAt: 'Date'
  },
  interviews: {
    _id: 'ObjectId',
    userId: 'ObjectId',
    roleId: 'string',
    status: 'string',
    score: 'number',
    rounds: [{
      roundId: 'number',
      score: 'number',
      feedback: 'string',
      strengths: ['string'],
      improvements: ['string']
    }],
    createdAt: 'Date',
    completedAt: 'Date'
  },
  questions: {
    _id: 'ObjectId',
    roleId: 'string',
    type: 'string', // behavioral, technical, coding, system_design
    question: 'string',
    options: ['string'], // for technical questions
    correctAnswer: 'number', // for technical questions
    rubric: {
      criteria: ['string'],
      weights: ['number']
    }
  },
  responses: {
    _id: 'ObjectId',
    userId: 'ObjectId',
    interviewId: 'ObjectId',
    questionId: 'ObjectId',
    answer: 'string',
    score: 'number',
    feedback: 'string',
    createdAt: 'Date'
  }
};

// Example functions for database operations
async function connect() {
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

async function disconnect() {
  try {
    await client.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
    throw error;
  }
}

// Example CRUD operations
const db = {
  // Users
  createUser: async (userData) => {
    return await collections.users().insertOne({
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  },
  
  // Interviews
  startInterview: async (userId, roleId) => {
    return await collections.interviews().insertOne({
      userId,
      roleId,
      status: 'in_progress',
      rounds: [],
      createdAt: new Date()
    });
  },
  
  // Questions
  getQuestionsByRole: async (roleId, type) => {
    return await collections.questions()
      .find({ roleId, type })
      .toArray();
  },
  
  // Responses
  saveResponse: async (responseData) => {
    return await collections.responses().insertOne({
      ...responseData,
      createdAt: new Date()
    });
  }
};

export { connect, disconnect, db };
*/