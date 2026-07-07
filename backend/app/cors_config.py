from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app):
    """Configure CORS for the FastAPI app"""
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=3600,
    )