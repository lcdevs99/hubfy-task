import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });


jest.setTimeout(10000);

afterEach(() => {
  jest.clearAllMocks();
});