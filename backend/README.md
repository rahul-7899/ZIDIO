# Chart Analyzer Backend

## Features
- User/admin authentication (JWT)
- Excel file upload and parsing
- Chart analysis history (MongoDB)
- Admin panel endpoints

## Setup

1. Install dependencies:  
   `npm install`

2. Set up `.env` file with:
   ```
   PORT=5000
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key
   ```

3. Run server:  
   `npm run dev`

## API Endpoints

- `POST /api/users/register` - Register
- `POST /api/users/login` - Login
- `POST /api/files/upload` - Upload Excel (auth required)
- `POST /api/charts/save` - Save chart config (auth required)
- `GET /api/charts/my` - Get user charts (auth required)
- `GET /api/admin/users` - All users (admin only)
- `GET /api/admin/charts` - All charts (admin only)