from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import database
import auth
import ollama_client
from datetime import timedelta

app = FastAPI(title="CareerFlux API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Database
database.init_db()

# Pydantic models for request/response
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class ChatRequest(BaseModel):
    message: str
    mode: str = "general"

@app.post("/signup")
async def signup(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = db.query(database.User).filter(database.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = database.User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@app.post("/login")
async def login(user: UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(database.User).filter(database.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": {"name": db_user.name, "email": db_user.email}}

@app.get("/profile")
async def get_profile(current_user: database.User = Depends(auth.get_current_user)):
    return {"name": current_user.name, "email": current_user.email}

@app.post("/chat")
async def chat(request: ChatRequest, current_user: database.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    # Save user message
    user_chat = database.Chat(user_id=current_user.id, role="user", content=request.message, mode=request.mode)
    db.add(user_chat)
    db.commit()
    
    # Generate AI response
    ai_response_content = await ollama_client.generate_response(request.message, request.mode)
    
    # Save AI message
    ai_chat = database.Chat(user_id=current_user.id, role="assistant", content=ai_response_content, mode=request.mode)
    db.add(ai_chat)
    db.commit()
    
    return {"response": ai_response_content}

@app.get("/history")
async def get_history(current_user: database.User = Depends(auth.get_current_user), db: Session = Depends(database.get_db)):
    history = db.query(database.Chat).filter(database.Chat.user_id == current_user.id).order_by(database.Chat.timestamp.asc()).all()
    return history

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
