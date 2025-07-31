# CrewDeck - AI-Powered Task Execution Platform

![CrewDeck Logo](https://img.shields.io/badge/CrewDeck-AI%20Powered-4169E1?style=for-the-badge)

CrewDeck is a production-ready SaaS application that allows users to execute complex business tasks using pre-configured AI agent teams powered by Cerebras AI. Watch AI agents collaborate in real-time through our Live Synthesis interface.

## 🚀 Features

- **AI Agent Teams**: Pre-configured crews for market research, content creation, and travel planning
- **Real-time Execution**: WebSocket-powered live synthesis view of AI agents working
- **Credit System**: Pay-per-use monetization model
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Modern UI**: Professional interface with smooth animations
- **Lightning Fast**: Powered by Cerebras AI for unprecedented speed

## 🛠️ Technology Stack

### Backend
- **FastAPI** - High-performance async web framework
- **PostgreSQL** - Robust relational database
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Alembic** - Database migration tool
- **CrewAI** - Multi-agent AI orchestration
- **Cerebras AI** - Ultra-fast LLM inference
- **WebSockets** - Real-time communication

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - Lightweight state management

## 📋 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.9+ (for local development)
- Cerebras API key

### Environment Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/rajshah9305/AICREWAGENTSAPPP.git
    cd AICREWAGENTSAPPP
    ```

2.  **Configure Environment Variables**

    Create a `.env` file in the root directory of the project based on `.env.example`:

    ```dotenv
    # Cerebras API Key (Required)
    CEREBRAS_API_KEY=your_cerebras_api_key

    # PostgreSQL Database (for Docker Compose)
    POSTGRES_USER=crewdeck_user
    POSTGRES_PASSWORD=crewdeck_password
    POSTGRES_DB=crewdeck_db
    DATABASE_URL=postgresql://crewdeck_user:crewdeck_password@db:5432/crewdeck_db

    # JWT Authentication
    SECRET_KEY=your_super_secret_jwt_key
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30

    # Frontend Configuration
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    ```

3.  **Build and Run with Docker Compose**

    Ensure Docker and Docker Compose are installed. From the root of the project, run:

    ```bash
    docker-compose up --build
    ```

    This will build the Docker images for both backend and frontend, and start the services. The backend will be available at `http://localhost:8000` and the frontend at `http://localhost:3000`.

4.  **Database Migrations**

    After the services are up, run database migrations for the backend:

    ```bash
    docker-compose exec backend alembic upgrade head
    ```

## 🚀 Usage

Once the application is running:

1.  **Access the Frontend**: Open your web browser and navigate to `http://localhost:3000`.
2.  **Sign Up/Login**: Create a new account or log in with existing credentials.
3.  **Explore CrewDeck**: Start executing tasks with pre-configured AI agent teams or create your own.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -m 'Add new feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Create a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✨ Acknowledgements

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Frontend powered by [Next.js](https://nextjs.org/)
- AI orchestration by [CrewAI](https://www.crewai.com/)
- High-performance inference by [Cerebras AI](https://www.cerebras.net/)

---

**Developed by Raj Shah**


