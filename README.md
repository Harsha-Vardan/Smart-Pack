# Smart-Pack 🎒

Smart-Pack is an AI-powered smart packing assistant that uses the 0/1 Knapsack algorithm (Dynamic Programming) to optimize your luggage. Stop guessing what to pack and let the algorithm maximize the utility of the items you carry within your bag's weight limit.

## Features
- **Smart Item Selection**: Picks the best items based on importance and weight using DP.
- **Weight Optimization**: Maximize what you carry while staying under your limit.
- **Modern UI**: A sleek, premium dashboard built with React and Tailwind CSS.
- **Secure Backend**: Node.js backend with MongoDB and JWT authentication.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB URI (if running locally, or MongoDB Atlas)

### Setup
1. Clone the repository
2. Backend:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory with:
   ```
   PORT=3000
   MONGO_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   ```
   Start the backend:
   ```bash
   npm start
   ```

3. Frontend:
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend:
   ```bash
   npm run dev
   ```

## License
MIT
