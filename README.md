# Stock Broker Platform (Groww Clone) - Backend

This backend application powers the Stock Broker platform, including user management, order processing, and real-time market data streaming.

## Architecture
Based on the provided High-Level Design, the system uses a scalable Microservices approach:
- API Gateway
- User Service
- Order Management Service (OMS)
- Price Service
- Exchange Gateway

*Note: This repository currently initializes the core backend structure.*

## Setup & Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and fill in the required values.

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

## Tech Stack
- **Node.js** & **Express.js**
- **PostgreSQL** (via `pg`)
- **dotenv**, **cors**