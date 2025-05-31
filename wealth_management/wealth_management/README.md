# Wealth Management Wizard

A comprehensive wealth management backend built with Python, FastAPI, and PostgreSQL.

## Features

- User authentication and authorization with JWT
- Portfolio management
- Asset tracking and management
- Financial goal setting and tracking
- Transaction history
- Secure API with proper authentication
- Database migrations with Alembic

## Tech Stack

- **Backend**: Python with FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy with elements of Prisma schema design
- **Authentication**: JWT tokens
- **API Documentation**: OpenAPI (Swagger UI and ReDoc)

## Setup Instructions

### Prerequisites

- Python 3.8+
- PostgreSQL
- pip (Python package manager)

### Environment Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd wealth_management
   ```

2. Create and activate a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the project root with the following content:
   ```
   DATABASE_URL=postgresql://postgres:Soham2607@localhost:5432/soham
   SECRET_KEY=your_secret_key_for_jwt_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

### Database Setup

1. Create the PostgreSQL database:

   ```bash
   createdb soham
   ```

2. Run database migrations:
   ```bash
   alembic revision --autogenerate -m "Initial migration"
   alembic upgrade head
   ```

## Running the Application

Start the application with:

```bash
python main.py
```

The API will be available at http://localhost:8000. The auto-generated API documentation can be accessed at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication

- `POST /auth/token` - Get access token

### Users

- `POST /users/` - Create new user
- `GET /users/me` - Get current user
- `PUT /users/me` - Update current user

### Portfolios

- `POST /portfolios/` - Create portfolio
- `GET /portfolios/` - List portfolios
- `GET /portfolios/{portfolio_id}` - Get portfolio
- `PUT /portfolios/{portfolio_id}` - Update portfolio
- `DELETE /portfolios/{portfolio_id}` - Delete portfolio

### Assets

- `POST /assets/` - Create asset
- `GET /assets/` - List assets
- `GET /assets/{asset_id}` - Get asset
- `PUT /assets/{asset_id}` - Update asset
- `DELETE /assets/{asset_id}` - Delete asset

### Financial Goals

- `POST /goals/` - Create goal
- `GET /goals/` - List goals
- `GET /goals/{goal_id}` - Get goal
- `PUT /goals/{goal_id}` - Update goal
- `PATCH /goals/{goal_id}/progress` - Update goal progress
- `DELETE /goals/{goal_id}` - Delete goal

### Transactions

- `POST /transactions/` - Create transaction
- `GET /transactions/` - List transactions
- `GET /transactions/{transaction_id}` - Get transaction
- `DELETE /transactions/{transaction_id}` - Delete transaction

## License

[MIT License](LICENSE)
