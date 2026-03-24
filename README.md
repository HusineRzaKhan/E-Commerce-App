# Ecommerce App (A2/ecommerce-app)

## 💖 Support my Open-Source Journey

I am a software engineer and student dedicated to building tools that give users back their digital agency. If my work has saved you time, solved a technical headache, or improved your workflow, consider supporting my independent development!

☕ **[Support my work on Patreon (Buy Me a Coffee)](https://patreon.com/HussainRazaKhan)** or 
    **NayaPay ID:** `HusineRzaKhan@nayapay`

This repository contains a demo full-stack E-Commerce app:

- `frontend/` - React Native Expo app (screens + navigation)
- `backend/` - Express.js server with MongoDB (Mongoose)

> MongoDB connection default: `mongodb://localhost:27017/ecommerce` (MongoDB Compass or local)

## Backend - Quick Start

1. Open terminal and go to `backend`:

```bash
cd A2/ecommerce-app/backend
npm install
```

2. Copy `.env.example` to `.env` and adjust if needed:

```
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

3. Seed sample products (optional):

```bash
npm run seed
```

4. Start server:

```bash
npm run dev
# or
npm start
```

Server endpoints:
- `GET /api/products` - list products
- `GET /api/products/:id` - product detail
- `POST /api/auth/register` - register
- `POST /api/auth/login` - login
- `GET/POST/PUT/DELETE /api/cart` - cart ops (auth required)
- `GET/POST /api/orders` - orders (auth required)


## Frontend - Quick Start (Expo)

1. Open terminal and go to `frontend`:

```bash
cd A2/ecommerce-app/frontend
npm install
```

2. Start Expo:

```bash
npm start
# or
npx expo start
```

Notes:
- API base URL in `frontend/api/client.js` defaults to `http://10.0.2.2:5000` (Android emulator). Change to your machine IP or `http://localhost:5000` when using web or iOS simulator.
- The frontend contains sample screens: Home, Product Details, Cart, Checkout, Order Confirmation, Profile, Category.

## Database Setup

### MongoDB (local)
- Install MongoDB Community edition or use MongoDB Compass.
- Ensure MongoDB is running, then server uses `mongodb://localhost:27017/ecommerce` by default.

### MySQL (optional)
- This implementation uses MongoDB. MySQL option is not implemented in this scaffold.

## How frontend communicates with backend

- Frontend uses Axios client (`frontend/api/client.js`) to send HTTP requests to the Express backend.
- Example: home screen calls `GET /api/products` to fetch product list; product details call `GET /api/products/:id`.
- For auth-protected endpoints, frontend should include `Authorization: Bearer <token>` header after login.

## Screenshots
- Add screenshots of each screen in this README (place images under `frontend/assets/screenshots`).

## Next Steps
- Implement full cart/auth UI flows on the frontend (token storage, protected routes)
- Add payment integration for Checkout
- Polish UI and animations using `react-native-animatable` or Reanimated

---

If you want, I can now: install node modules, run the seed script, or push this scaffolding into a GitHub repo. Which would you like next?
