# 📈 Groww Clone - Microservices Stock Broker Platform

A scalable, event-driven trading platform and stock broker application designed to simulate real-world trading experiences similar to Groww or Zerodha. It features a React Native (Expo) mobile frontend and a high-performance backend powered by Node.js microservices.

## 📖 Project Documentation

- **[Product Requirements Document (PRD)](https://docs.google.com/document/d/1gXboDN_3VVUC4SN4efEztYddWlgWz56r-9_RBzXm6UQ/edit?tab=t.0)**
- **[High-Level Design (HLD)](https://docs.google.com/document/d/1g-FE9NKw3t1VwhHM30OOuzxgrns9VxjGefBiACiqaNY/edit?tab=t.0)**

---

## 🏛 Architecture Overview

The backend uses a completely decoupled Microservices Architecture communicating asynchronously through Apache Kafka.

```mermaid
graph TD
    Client[📱 Mobile App - Expo/React Native] --> Gateway[API Gateway - Port 8000]

    Gateway --> |/api/auth| UserService[User Service - Port 5001]
    Gateway --> |/api/orders| OrderService[Order Service - Port 5002]
    Gateway --> |/api/prices| PriceService[Price Service - Port 5003]

    UserService <--> Postgres[(Supabase PostgreSQL)]
    OrderService <--> Postgres

    OrderService -->|Places Order| KafkaOrderTopic{{Kafka: 'orders'}}
    KafkaOrderTopic --> ExchangeWorker[Exchange Service - Port 5004]

    MockAPI[Mock Market API - Port 8001] -->|Price Ticks| KafkaPriceTopic{{Kafka: 'market-prices'}}
    KafkaPriceTopic --> PriceService
    PriceService <--> Redis[(Redis Express Cache)]
    
    PriceService -.->|Server-Sent Events| Client
```

## 🛠 Technology Stack

### Frontend
- **React Native (Expo)** - Mobile Framework
- **TailwindCSS (NativeWind)** - Styling
- **React Navigation** - App Routing
- **Axios & EventSource** - API and SSE Connections

### Backend
- **Node.js & Express.js** - Microservices Framework
- **Apache Kafka** - Event Streaming & Queue Management
- **Redis (ioredis)** - Real-time Data Caching for Market Prices
- **PostgreSQL (Supabase)** - Primary Database (Users, Orders, Portfolio)
- **PM2 / Concurrently** - Process Management

---

## ⚙️ Services Map

| Service Name | Port | Description |
|---|---|---|
| **API Gateway** | `8000` | Unified entry point routing traffic mapping endpoints. |
| **User Service** | `5001` | Handles authentications, authorizations & user profiles. |
| **Order Service** | `5002` | Places buy/sell orders and manages user portfolios. |
| **Price Service** | `5003` | Streams live market prices to clients over SSE. |
| **Exchange Worker**| `5004` | Consumes `orders` from Kafka & executes them. |
| **Mock Stock API** | `8001` | Generates dummy stock market tickers to Kafka. |

---

## 🚀 Running the Project

### Environment Setup
Create a `.env` file in the root directory (and update credentials as needed):
```env
DB_HOST=localhost
DB_PORT=5432
# Postgres DB credentials mapped to Supabase
DATABASE_URL=postgresql://user:pass@pooler.supabase.com:6543/postgres

KAFKA_BROKER=your.aivencloud.com:19330
KAFKA_SSL=true

# If using local Redis:
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### Local Development
To launch all microservices identically on your local machine:
```bash
# Installs all node modules
npm install

# Starts all 6 services simultaneously
npm run start:services
```

### EC2 / Production Deployment
On a cloud environment, you can use the provided **PM2 Ecosystem Configuration**:
```bash
# Starts all processes in the background using PM2
pm2 start ecosystem.config.js

# To view live logs
pm2 logs
```

### Mobile Frontend Setup
To run the Expo app on your phone, navigate to the `frontend/` directory, set the API Base URL to your local PC IP, and start the Expo bundler:
```bash
cd frontend

# Set EXPO_PUBLIC_API_URL to your Host network IP in .env
# Example: EXPO_PUBLIC_API_URL=http://192.168.1.5:8000/api

npm run start
```