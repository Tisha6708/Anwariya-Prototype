from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
import os

def generate_invoice_pdf(data: dict):
    os.makedirs("invoices", exist_ok=True)

    file_path = f"invoices/bill_{data['bill_id']}.pdf"
    c = canvas.Canvas(file_path, pagesize=A4)
    width, height = A4

    primary = HexColor("#6D28D9")  # purple

    # ===== HEADER =====
    c.setFillColor(primary)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(40, height - 50, "INVOICE")

    c.setFont("Helvetica", 10)
    c.setFillColorRGB(0, 0, 0)
    c.drawRightString(width - 40, height - 40, f"Date: {data['date']}")
    c.drawRightString(width - 40, height - 55, f"Invoice ID: #{data['bill_id']}")

    # Divider
    c.line(40, height - 70, width - 40, height - 70)

    # ===== CUSTOMER INFO =====
    c.setFont("Helvetica-Bold", 11)
    c.drawString(40, height - 100, "Billed To:")

    c.setFont("Helvetica", 10)
    c.drawString(40, height - 120, data["customer_name"])
    c.drawString(40, height - 135, data["customer_email"])

    # ===== TABLE HEADER =====
    table_y = height - 180
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, table_y, "Product")
    c.drawString(260, table_y, "Qty")
    c.drawString(320, table_y, "Price")
    c.drawString(420, table_y, "Total")

    c.line(40, table_y - 5, width - 40, table_y - 5)

    # ===== TABLE ROW =====
    c.setFont("Helvetica", 10)
    row_y = table_y - 30
    c.drawString(40, row_y, data["product_name"])
    c.drawString(270, row_y, str(data["quantity"]))
    c.drawString(320, row_y, f"₹{data['price']}")
    c.drawString(420, row_y, f"₹{data['total']}")

    # ===== TOTAL =====
    c.line(300, row_y - 30, width - 40, row_y - 30)
    c.setFont("Helvetica-Bold", 12)
    c.drawRightString(width - 40, row_y - 55, f"Grand Total: ₹{data['total']}")

    # ===== FOOTER =====
    c.setFont("Helvetica", 9)
    c.setFillColorRGB(0.4, 0.4, 0.4)
    c.drawCentredString(
        width / 2,
        40,
        "Thank you for your business"
    )

    c.save()
    return file_path
