import { useEffect, useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { api } from "../../services/api";

export default function Billing() {
  const vendorId = Number(localStorage.getItem("userId"));

  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);

  const [bill, setBill] = useState({
    productId: "",
    qty: "",
    price: "",
    customerName: "",
    customerEmail: "",
  });

  useEffect(() => {
    api(`/products?vendor_id=${vendorId}`).then(setProducts);
  }, [vendorId]);

  const selected = products.find(
    (p) => p.id === Number(bill.productId)
  );

  const qty = Number(bill.qty || 0);
  const price = Number(bill.price || 0);
  const total = qty * price;

  const handleGenerate = async () => {
    if (
      !bill.productId ||
      !bill.qty ||
      !bill.price ||
      !bill.customerName ||
      !bill.customerEmail
    ) {
      alert("Please fill all fields");
      return;
    }

    const res = await api("/bills", {
      method: "POST",
      body: JSON.stringify({
        vendor_id: vendorId,
        product_id: Number(bill.productId),
        quantity: qty,
        selling_price: price,
        customer_name: bill.customerName,
        customer_email: bill.customerEmail,
      }),
    });

    setSummary(res);
  };

  return (
    <PageWrapper title="Generate Bill">
      <div className="bg-white p-6 rounded-xl shadow max-w-xl space-y-4">

        {/* CUSTOMER INFO */}
        <input
          className="border p-2 w-full rounded"
          placeholder="Customer Name"
          value={bill.customerName}
          onChange={(e) =>
            setBill({ ...bill, customerName: e.target.value })
          }
        />

        <input
          type="email"
          className="border p-2 w-full rounded"
          placeholder="Customer Email"
          value={bill.customerEmail}
          onChange={(e) =>
            setBill({ ...bill, customerEmail: e.target.value })
          }
        />

        {/* PRODUCT */}
        <select
          className="border p-2 w-full rounded"
          value={bill.productId}
          onChange={(e) =>
            setBill({ ...bill, productId: e.target.value })
          }
        >
          <option value="">Select product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.product_name} (Stock: {p.quantity_available})
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity sold"
          className="border p-2 w-full rounded"
          value={bill.qty}
          onChange={(e) =>
            setBill({ ...bill, qty: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Selling price per unit"
          className="border p-2 w-full rounded"
          value={bill.price}
          onChange={(e) =>
            setBill({ ...bill, price: e.target.value })
          }
        />

        {/* LIVE PREVIEW */}
        {selected && qty > 0 && price > 0 && (
          <div className="bg-gray-50 p-3 rounded text-sm">
            <p><strong>Total:</strong> ₹{total}</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="bg-purple-600 text-white py-2 rounded w-full"
        >
          Generate Bill
        </button>

        {/* SUMMARY (BACKEND-DRIVEN) */}
        {summary && (
          <div className="bg-green-50 p-4 rounded text-sm space-y-1">
            <p className="font-semibold">Bill Generated ✅</p>
            <p>Product: {summary.product_name}</p>
            <p>Quantity: {summary.quantity}</p>
            <p>Total: ₹{summary.total}</p>
            <p>Profit: ₹{summary.profit}</p>
            <p className="text-xs text-gray-600">
              Invoice sent to {summary.customer_email}
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
