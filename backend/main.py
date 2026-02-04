from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from schemas import BillCreate
import models, schemas, crud
from db import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from analytics import generate_insights
from sqlalchemy import text
from utils.pdf import generate_invoice_pdf
from datetime import datetime
from utils.email import send_invoice_email
from utils.pdf import generate_invoice_pdf
import os
from dotenv import load_dotenv

load_dotenv()

print("EMAIL:", os.getenv("SMTP_EMAIL"))
print("PASSWORD:", os.getenv("SMTP_PASSWORD"))

# create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","http://127.0.0.1:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# DATABASE DEPENDENCY
# --------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------
# USERS
# --------------------

@app.post("/users")
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    return crud.create_or_get_user(db, user.email, user.role)


# --------------------
# CAMPAIGNS
# --------------------

@app.post("/campaigns")
def create_campaign(
    campaign: schemas.CampaignCreate,
    db: Session = Depends(get_db)
):
    return crud.create_campaign(
        db,
        campaign.vendor_id,
        campaign.product_name,
        campaign.description,
    )


@app.get("/campaigns")
def get_campaigns(db: Session = Depends(get_db)):
    return crud.get_all_campaigns(db)


# --------------------
# CHATS
# --------------------

@app.post("/chats")
def create_or_get_chat(
    chat: schemas.ChatCreate,
    db: Session = Depends(get_db)
):
    return crud.create_or_get_chat(
        db,
        chat.campaign_id,
        chat.vendor_id,
        chat.influencer_id,
    )


@app.get("/chats/user/{user_id}")
def get_user_chats(user_id: int, db: Session = Depends(get_db)):
    return crud.get_chats_by_user(db, user_id)


# --------------------
# MESSAGES
# --------------------

@app.post("/messages", response_model=schemas.MessageOut)
def send_message(
    message: schemas.MessageCreate,
    db: Session = Depends(get_db)
):
    return crud.create_message(
        db,
        message.chat_id,
        message.sender_id,
        message.text,
    )


@app.get("/messages/{chat_id}", response_model=List[schemas.MessageOut])
def get_messages(
    chat_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_messages_by_chat(db, chat_id)

# --------------------
# TOKENS
# --------------------

@app.get("/tokens/{user_id}")
def get_tokens(user_id: int, db: Session = Depends(get_db)):
    tokens = crud.get_user_tokens(db, user_id)
    return {"tokens": tokens}


@app.post("/tokens/deduct")
def deduct_user_tokens(
    user_id: int,
    amount: int,
    db: Session = Depends(get_db)
):
    result = crud.deduct_tokens(db, user_id, amount)

    if result == "INSUFFICIENT":
        return {"error": "Not enough tokens"}

    return {"tokens": result}

# -------- PROFILES --------

@app.get("/profile/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    return crud.get_profile(db, user_id)


@app.post("/profile")
def save_profile(
    profile: schemas.ProfileCreate,
    db: Session = Depends(get_db)
):
    return crud.create_or_update_profile(db, profile)

# -------- PRODUCTS --------
@app.post("/products", response_model=schemas.ProductOut)
def add_product(
    product: schemas.ProductCreate,
    db: Session = Depends(get_db)
):
    return crud.create_product(db, product)


@app.get("/products")
def get_products(vendor_id: int, db: Session = Depends(get_db)):
    return crud.get_products(db, vendor_id)


# -------- BILLS --------
@app.post("/bills")
def create_bill(
    bill: schemas.BillCreate,
    db: Session = Depends(get_db),
):
    product = db.query(models.Product).filter(
        models.Product.id == bill.product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.quantity_available < bill.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock")

    total = bill.quantity * bill.selling_price
    cost = bill.quantity * product.cost_price
    profit = total - cost

    new_bill = models.Bill(
        vendor_id=bill.vendor_id,
        product_id=bill.product_id,
        customer_name=bill.customer_name,
        customer_email=bill.customer_email,
        quantity=bill.quantity,
        selling_price=bill.selling_price,
        created_at=datetime.utcnow(),
    )

    product.quantity_available -= bill.quantity

    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)

    # ---------- PDF ----------
    pdf_path = generate_invoice_pdf({
        "bill_id": new_bill.id,
        "customer_name": bill.customer_name,
        "customer_email": bill.customer_email,
        "product_name": product.product_name,
        "quantity": bill.quantity,
        "price": bill.selling_price,
        "total": total,
        "date": new_bill.created_at.strftime("%d %b %Y"),
    })

    # ---------- EMAIL (SAFE) ----------
    try:
        send_invoice_email(bill.customer_email, pdf_path)
    except Exception as e:
        print("⚠️ Email failed:", e)

    return {
        "bill_id": new_bill.id,
        "product_name": product.product_name,
        "quantity": bill.quantity,
        "selling_price": bill.selling_price,
        "total": total,
        "profit": profit,
        "customer_email": bill.customer_email,
        "pdf_path": pdf_path,
    }


@app.get("/analytics/{vendor_id}")
def analytics(vendor_id: int, db: Session = Depends(get_db)):

    sales = db.execute(
        text("""
            SELECT
                p.product_name AS name,
                SUM(b.quantity) AS quantity,

                -- revenue
                SUM(b.quantity * b.selling_price) AS revenue,

                -- cost
                SUM(b.quantity * p.cost_price) AS cost,

                -- profit
                SUM(b.quantity * b.selling_price)
                - SUM(b.quantity * p.cost_price) AS profit

            FROM bills b
            JOIN products p ON p.id = b.product_id
            WHERE b.vendor_id = :vendor_id
            GROUP BY p.product_name
        """),
        {"vendor_id": vendor_id}
    ).mappings().all()

    total_profit = sum(row["profit"] or 0 for row in sales)
    total_units = sum(row["quantity"] or 0 for row in sales)

    low_stock = db.execute(
        text("""
            SELECT product_name, quantity_available
            FROM products
            WHERE vendor_id = :vendor_id
              AND quantity_available < 5
        """),
        {"vendor_id": vendor_id}
    ).mappings().all()

    return {
        "kpis": {
            "total_profit": total_profit,
            "total_units": total_units,
            "product_count": len(sales),
        },
        "sales": sales,
        "low_stock": low_stock,
    }
