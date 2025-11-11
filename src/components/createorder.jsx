import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart, fetchCartItems } from "../redux/cartslice";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { IoMdArrowBack } from "react-icons/io";

const API_URL = process.env.REACT_APP_API_URL;

export default function Createorder() {
  const { userid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [codChecked, setCodChecked] = useState(false);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");

  const { items, loading } = useSelector((state) => state.cart);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    shippingAddress: "",
    email: "",
  });
  const [summary, setSummary] = useState(null);

  useEffect(() => {
  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_URL}/getordersummary/${userid}`);
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  dispatch(fetchCartItems(userid));
  fetchSummary();
}, [dispatch, userid]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (status === "failed") {
      toast.error("Payment was not successful. Please try again.");
    }
  }, [status]);

  const handleCreateOrder = async () => {
    try {
      const payment_method = codChecked ? "COD" : "CARD";
      const res = await axios.post(`${API_URL}/createorder/${userid}`, {
        ...form,
        payment_method,
      });

      if (payment_method === "CARD") {  
        window.location.href = res.data.sessionUrl;
      } else {
         dispatch(clearCart());
        toast.success("Order placed successfully (Cash on Delivery)");
        navigate("/ordersuccess");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create order");
    }
  };

  if (loading)
    return <p className="p-4 text-lg text-gray-600">Loading cart...</p>;

  if (!items.length)
    return (
      <p className="p-4 text-lg text-gray-600 text-center">
        Your cart is empty
      </p>
    );

  return (
    <div className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl mt-6">
   <IoMdArrowBack className="text-2xl" onClick={()=>navigate(`/addtocart/${userid}`)}/>
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center drop-shadow-sm">
        Checkout
      </h1>

      {/* Cart Items */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg text-gray-800 mb-3">
          Items in your cart:
        </h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.product_id}
              className="flex gap-4 items-center bg-white rounded-xl p-3 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={item.main_image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg border border-gray-200"
              />
              <div className="text-gray-700">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × ₹{item.price}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary */}
      {summary ? (
        <div className="mt-4 bg-white/70 backdrop-blur-lg p-5 rounded-2xl shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Order Summary
          </h3>
          <div className="space-y-1 text-gray-700">
            <p>
              Plan:{" "}
              <span className="font-medium text-gray-900">{summary.plan}</span>
            </p>
            <p>Subtotal: ₹{summary.totalAmount}</p>
            <p>Delivery Fee: ₹{summary.deliveryFee}</p>
            <p>Discount: ₹{summary.discount}</p>
            <p className="font-bold text-blue-600 mt-2">
              Payable Amount: ₹{summary.payableAmount}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">Loading summary...</p>
      )}

      {/* User Info */}
      <div className="space-y-4 mt-6">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="text"
          name="shippingAddress"
          placeholder="Shipping Address"
          value={form.shippingAddress}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 p-3 w-full rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Payment Method */}
      <div className="mt-6 bg-white/80 rounded-2xl shadow-sm p-4">
        <p className="font-semibold text-gray-800 mb-3">
          Select Payment Method:
        </p>
        <div className="flex items-center gap-6 text-gray-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={codChecked === true}
              onChange={() => setCodChecked(true)}
              className="w-4 h-4 accent-blue-600"
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="CARD"
              checked={codChecked === false}
              onChange={() => setCodChecked(false)}
              className="w-4 h-4 accent-purple-600"
            />
            Pay with Card (Stripe)
          </label>
        </div>
      </div>

      <button
        onClick={handleCreateOrder}
        className="mt-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl w-full shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
      >
        Place Order
      </button>
    </div>
  );
}
