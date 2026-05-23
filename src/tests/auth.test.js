const request = require('supertest');
const app = require('../../app');

let token = '';

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test123@test.com', password: 'Test@1234' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test123@test.com', password: 'Test@1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test123@test.com', password: 'WrongPass@1' });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject missing fields on register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'nopass@test.com' });
    expect(res.statusCode).toBe(400);
  });
});

describe('Protected Routes', () => {
  it('should block access without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('should allow access with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it('should block access with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.statusCode).toBe(401);
  });
});

describe('Transaction Authorization', () => {
  it('should block transaction without token', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({ amount: 500, recipient: 'John', type: 'debit' });
    expect(res.statusCode).toBe(401);
  });

  it('should allow transaction with valid token', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 500, recipient: 'John', type: 'debit' });
    expect(res.statusCode).toBe(201);
  });

  it('should reject invalid transaction data', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: -100, recipient: '', type: 'invalid' });
    expect(res.statusCode).toBe(400);
  });
});