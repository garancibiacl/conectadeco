# ConectaDeco API REST

## AUTH

### POST `/api/auth/register`
Body:
```json
{ "email": "string", "password": "string", "name": "string", "phone": "string?" }
```
Response `201`:
```json
{ "id": "number", "email": "string", "name": "string" }
```

### POST `/api/auth/login`
Body:
```json
{ "email": "string", "password": "string" }
```
Response `200`:
```json
{ "token": "string", "user": { "id": "number", "email": "string", "role": "string" } }
```

## PRODUCTS

### GET `/api/products?category=&model=&q=`
Response `200`:
```json
[{ "id": "number", "name": "string", "price": "number", "stock": "number", "image_url": "string" }]
```

### GET `/api/products/:id`

### POST `/api/products` (admin)

### PUT `/api/products/:id` (admin)

### DELETE `/api/products/:id` (admin)

## ORDERS

### POST `/api/orders` (auth)
Body:
```json
{ "items": [{ "product_id": "number", "qty": "number" }] }
```
Response `201`:
```json
{ "order_id": "number", "total": "number", "status": "string" }
```

## FAVORITES

### POST `/api/favorites/:productId`

### DELETE `/api/favorites/:productId`

### GET `/api/favorites`

## Nota

- Bearer token.
- Privadas requieren token (+role si aplica).
