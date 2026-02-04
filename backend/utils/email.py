import smtplib
import os
from email.message import EmailMessage
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

EMAIL = os.getenv("EMAIL")
PASSWORD = os.getenv("EMAIL_PASSWORD")

def send_invoice_email(to_email: str, pdf_path: str):
    print("DEBUG EMAIL =", EMAIL)
    print("DEBUG PASSWORD =", PASSWORD)

    if not EMAIL or not PASSWORD:
        raise Exception("EMAIL or EMAIL_PASSWORD not set")

    msg = EmailMessage()
    msg["Subject"] = "Your Invoice"
    msg["From"] = EMAIL
    msg["To"] = to_email
    msg.set_content("Please find your invoice attached.")

    with open(pdf_path, "rb") as f:
        msg.add_attachment(
            f.read(),
            maintype="application",
            subtype="pdf",
            filename=os.path.basename(pdf_path),
        )

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(EMAIL, PASSWORD)
        server.send_message(msg)
