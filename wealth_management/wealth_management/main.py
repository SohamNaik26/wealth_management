import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, users_router, portfolios_router, assets_router, goals_router, transactions_router, subscriptions
from app.db.database import engine, Base

# Create the database tables
Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI(
    title="Wealth Management API",
    description="API for managing financial assets and tracking wealth growth",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # React frontend
    "http://localhost:8000",  # FastAPI backend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(portfolios_router)
app.include_router(assets_router)
app.include_router(goals_router)
app.include_router(transactions_router)
app.include_router(subscriptions.router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Wealth Management API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 