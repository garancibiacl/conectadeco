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

describe('Favorites routes', () => {
  const app = createApp();
  const token = jwt.sign({ sub: '5' }, process.env.JWT_SECRET);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/favorites requiere autenticación', async () => {
    const response = await request(app).get('/api/favorites');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token Bearer requerido.');
  });

  test('POST /api/favorites/:productId agrega favorito', async () => {
    query
      .mockResolvedValueOnce({
        rows: [{ id: 5, nombre: 'Ana', email: 'ana@test.com', role: 'usuario' }],
      })
      .mockResolvedValueOnce({ rows: [{ id: 1 }] })
      .mockResolvedValueOnce({
        rows: [{ id: 9, producto_id: 1, created_at: '2026-03-11T00:00:00.000Z' }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 9,
            producto_id: 1,
            created_at: '2026-03-11T00:00:00.000Z',
            nombre: 'Funda A',
            descripcion: 'Desc A',
            precio: '29900.00',
            stock: 4,
            categoria: 'iPhone 15',
            modelo: 'iPhone 15 Pro',
            imagen_url: 'https://example.com/a.jpg',
          },
        ],
      });

    const response = await request(app)
      .post('/api/favorites/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body.favorito).toEqual(
      expect.objectContaining({
        id: 9,
        productoId: 1,
      })
    );
  });

  test('GET /api/favorites retorna favoritos del usuario', async () => {
    query
      .mockResolvedValueOnce({
        rows: [{ id: 5, nombre: 'Ana', email: 'ana@test.com', role: 'usuario' }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 9,
            producto_id: 1,
            created_at: '2026-03-11T00:00:00.000Z',
            nombre: 'Funda A',
            descripcion: 'Desc A',
            precio: '29900.00',
            stock: 4,
            categoria: 'iPhone 15',
            modelo: 'iPhone 15 Pro',
            imagen_url: 'https://example.com/a.jpg',
          },
        ],
      });

    const response = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.favoritos[0]).toEqual(
      expect.objectContaining({
        id: 9,
        productoId: 1,
      })
    );
  });
});
