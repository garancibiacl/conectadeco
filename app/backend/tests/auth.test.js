const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('supertest');

jest.mock('../db/pool', () => {
  const query = jest.fn();
  return {
    query,
    pool: {
      query,
      connect: jest.fn(),
      on: jest.fn(),
    },
  };
});

const { query } = require('../db/pool');
const { createApp } = require('../server');

describe('Auth routes', () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/auth/register crea usuario y retorna token', async () => {
    query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 7,
            nombre: 'María Test',
            email: 'maria@test.com',
            role: 'usuario',
          },
        ],
      });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'María Test',
        email: 'maria@test.com',
        password: '123456',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          id: 7,
          nombre: 'María Test',
          email: 'maria@test.com',
          role: 'usuario',
        }),
      })
    );
  });

  test('POST /api/auth/login responde 401 con credenciales inválidas', async () => {
    const passwordHash = await bcrypt.hash('password-correcta', 10);

    query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          nombre: 'Admin',
          email: 'admin@conectadeco.com',
          role: 'admin',
          password_hash: passwordHash,
        },
      ],
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@conectadeco.com',
        password: 'mala-clave',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Credenciales inválidas.');
  });

  test('GET /api/auth/me retorna el usuario autenticado', async () => {
    const token = jwt.sign({ sub: '3' }, process.env.JWT_SECRET);

    query.mockResolvedValueOnce({
      rows: [
        {
          id: 3,
          nombre: 'Carla',
          email: 'carla@test.com',
          role: 'usuario',
        },
      ],
    });

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({
      id: 3,
      nombre: 'Carla',
      email: 'carla@test.com',
      role: 'usuario',
    });
  });
});
