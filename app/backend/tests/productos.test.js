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

describe('Productos routes', () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/productos entrega listado y total', async () => {
    query
      .mockResolvedValueOnce({ rows: [{ total: 2 }] })
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
          {
            id: 2,
            nombre: 'Funda B',
            descripcion: 'Desc B',
            precio: '19900.00',
            stock: 9,
            categoria: 'iPhone 14',
            modelo: 'iPhone 14',
            imagen_url: 'https://example.com/b.jpg',
          },
        ],
      });

    const response = await request(app).get('/api/productos');

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(2);
    expect(response.body.productos).toHaveLength(2);
    expect(response.body.productos[0]).toEqual(
      expect.objectContaining({
        id: 1,
        nombre: 'Funda A',
        precio: 29900,
      })
    );
  });

  test('GET /api/productos/:id responde 404 cuando no existe', async () => {
    query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/api/productos/999');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Producto no encontrado.');
  });
});
