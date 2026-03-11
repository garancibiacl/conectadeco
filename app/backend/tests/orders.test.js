const jwt = require('jsonwebtoken');
const request = require('supertest');

jest.mock('../db/pool', () => {
  const query = jest.fn();
  const connect = jest.fn();
  return {
    query,
    pool: {
      query,
      connect,
      on: jest.fn(),
    },
  };
});

const { query, pool } = require('../db/pool');
const { createApp } = require('../server');

describe('Orders routes', () => {
  const app = createApp();
  const token = jwt.sign({ sub: '5' }, process.env.JWT_SECRET);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /api/orders requiere autenticación', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({ items: [{ product_id: 1, qty: 1 }] });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token Bearer requerido.');
  });

  test('POST /api/orders crea un pedido autenticado', async () => {
    query.mockResolvedValueOnce({
      rows: [
        {
          id: 5,
          nombre: 'Ana',
          email: 'ana@test.com',
          role: 'usuario',
        },
      ],
    });

    const client = {
      query: jest
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({
          rows: [
            { id: 1, nombre: 'Funda A', precio: 29900, stock: 4 },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            { id: 22, total: 29900, estado: 'procesando', created_at: '2026-03-11T00:00:00.000Z' },
          ],
        })
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({}),
      release: jest.fn(),
    };

    pool.connect.mockResolvedValueOnce(client);

    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ product_id: 1, qty: 1 }] });

    expect(response.status).toBe(201);
    expect(response.body.pedido).toEqual(
      expect.objectContaining({
        id: 22,
        total: 29900,
        estado: 'procesando',
      })
    );
    expect(client.release).toHaveBeenCalled();
  });

  test('GET /api/orders/me retorna historial del usuario', async () => {
    query
      .mockResolvedValueOnce({
        rows: [
          {
            id: 5,
            nombre: 'Ana',
            email: 'ana@test.com',
            role: 'usuario',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: 10,
            total: '29900.00',
            estado: 'procesando',
            created_at: '2026-03-11T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            pedido_id: 10,
            producto_id: 1,
            cantidad: 1,
            precio_unitario: '29900.00',
            nombre: 'Funda A',
          },
        ],
      });

    const response = await request(app)
      .get('/api/orders/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(1);
    expect(response.body.pedidos[0]).toEqual(
      expect.objectContaining({
        id: 10,
        estado: 'procesando',
      })
    );
  });
});
