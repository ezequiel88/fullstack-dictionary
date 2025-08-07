import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock Redis client
jest.mock('../src/infrastructure/cache/redis.js', () => ({
  __esModule: true,
  default: {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    on: jest.fn(),
    isReady: true,
  },
}));

beforeAll(async () => {
  // Setup test environment
  console.log('Setting up test environment...');
  
  // You can add database setup, Redis connection, etc. here
  // For example:
  // await setupTestDatabase();
  // await connectToTestRedis();
});

afterAll(async () => {
  // Cleanup test environment
  console.log('Cleaning up test environment...');
  
  // You can add cleanup logic here
  // For example:
  // await cleanupTestDatabase();
  // await disconnectFromTestRedis();
});