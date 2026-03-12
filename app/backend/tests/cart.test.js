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

describe('Cart routes', () => {
  const app = createApp();
  const token = jwt.sign({ sub: '5' }, process.env.JWT_SECRET);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/cart agrega producto al carrito', async () => {
    query
      .mockResolvedValueOnce({
        rows: [{ id: 5, nombre: 'Ana', email: 'ana@test.com', role: 'usuario' }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            nombre: 'Funda A',
            descripcion: 'Desc A',
            precio: '29900.00',
            stock: 5,
            categoria: 'iPhone 15',
            modelo: 'iPhone 15 Pro',
            imagen_url: 'https://example.com/a.jpg',
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [{ id: 14, producto_id: 1, cantidad: 2, created_at: '2026-03-11T00:00:00.000Z' }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 14,
            producto_id: 1,
            cantidad: 2,
            created_at: '2026-03-11T00:00:00.000Z',
            nombre: 'Funda A',
            descripcion: 'Desc A',
            precio: '29900.00',
            stock: 5,
            categoria: 'iPhone 15',
            modelo: 'iPhone 15 Pro',
            imagen_url: 'https://example.com/a.jpg',
          },
        ],
      });

    const response = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ product_id: 1, qty: 2 });

    expect(response.status).toBe(201);
    expect(response.body.item).toEqual(
      expect.objectContaining({
        id: 14,
        productoId: 1,
        cantidad: 2,
        subtotal: 59800,
      })
    );
  });

  test('GET /api/cart retorna items y subtotal', async () => {
    query
      .mockResolvedValueOnce({
        rows: [{ id: 5, nombre: 'Ana', email: 'ana@test.com', role: 'usuario' }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 14,
            producto_id: 1,
            cantidad: 2,
            created_at: '2026-03-11T00:00:00.000Z',
            nombre: 'Funda A',
            descripcion: 'Desc A',
            precio: '29900.00',
            stock: 5,
            categoria: 'iPhone 15',
            modelo: 'iPhone 15 Pro',
            imagen_url: 'https://example.com/a.jpg',
          },
        ],
      });

    const response = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.subtotal).toBe(59800);
    expect(response.body.items[0]).toEqual(
      expect.objectContaining({
        productoId: 1,
        cantidad: 2,
      })
    );
  });
});
