# Daily Work Tracking & Reporting System

A comprehensive, production-ready MERN stack web application for tracking daily work entries and generating professional PDF reports. Designed specifically for single-service deployment (like Render).

## Features

- **Daily Work Entry:** Add client work with automatic amount calculation (Qty × Rate).
- **Date-Wise Filtering:** View work entries by specific dates.
- **Summary Dashboard:** Total Entries, Total Quantity, and Total Amount calculations.
- **PDF Generation:** Download professional PDF reports for any specific date.
- **Branded Reports:** Automatically include your company name in the PDF headers (configured on first launch).
- **Single Service Architecture:** The Express server acts as both the REST API and the static file server for the production-built React frontend.

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS (v4), Axios, Lucide React
- **Backend:** Node.js, Express.js, Mongoose, PDFKit
- **Database:** MongoDB

## Folder Structure

```
daily-work-tracker/
├── dist/                    # Production build of React (after running npm run build)
├── src/
│   ├── client/              # React frontend
│   │   ├── components/      # UI Components (Navbar, Forms, Modals)
│   │   ├── pages/           # Views
│   │   └── services/        # API calls (Axios wrappers)
│   └── server/              # Express backend
│       ├── config/          # Database configuration
│       ├── controllers/     # API logic and PDF generation
│       ├── middleware/      # Error handling
│       ├── models/          # Mongoose models
│       └── routes/          # Express router configurations
├── .env                     # Environment variables
├── package.json             # Root dependencies and scripts
└── vite.config.js           # Vite configuration with proxy for dev
```

## Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

## Development Commands

Start both the Vite frontend development server and the Express backend server concurrently:

```bash
npm run dev
```
- Frontend will run on `http://localhost:5173`
- Backend API will run on `http://localhost:5000`

## Production Commands

To prepare the application for production deployment:

1. Build the React frontend:
   ```bash
   npm run build
   ```

2. Start the Express server (which will serve both the API and the React build):
   ```bash
   npm start
   ```
- The entire application will run on `http://localhost:5000` (or whichever port is defined in `.env`).

## API Endpoints

- `GET /api/work` - Retrieve all work entries
- `POST /api/work` - Create a new work entry
- `GET /api/work/date/:date` - Retrieve work entries for a specific date (YYYY-MM-DD)
- `PUT /api/work/:id` - Update an existing work entry
- `DELETE /api/work/:id` - Delete a work entry
- `GET /api/work/pdf/:date` - Download PDF report for a specific date

## Render Deployment Instructions

This application is designed to be deployed as a **single Web Service** on Render.

1. Create a new **Web Service** on Render and connect your repository.
2. Configure the following settings:
   - **Environment:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
3. Add your Environment Variables in Render:
   - `MONGODB_URI` - Your MongoDB connection string.
4. Deploy! The frontend and backend will be served from the same Render URL.

## Troubleshooting

- **MongoDB Connection Error:** Ensure your `MONGODB_URI` in `.env` is correct and your IP address is whitelisted in MongoDB Atlas.
- **CORS Issues in Development:** The Vite proxy is pre-configured to bypass CORS. Ensure both servers start when running `npm run dev`.
- **404 on Refresh in Production:** The Express server includes a wildcard `*` route to serve `index.html` after the API routes to handle client-side routing. Ensure you ran `npm run build` before `npm start`.
