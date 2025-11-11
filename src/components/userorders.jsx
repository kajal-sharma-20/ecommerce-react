import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CartFooter from "./cartfooter";
import { IoMdArrowBack } from "react-icons/io";

const API_URL = process.env.REACT_APP_API_URL;

export default function UserOrders() {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate()

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/getuserorders/${userId}`);
      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [userId]);

  const handleCancelOrder = async (orderId) => {
    try {
      const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
      if (!confirmCancel) return;

      const res = await axios.put(`${API_URL}/requestCancel/${orderId}`);
      toast.success(res.data.message);

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, cancel_request_status: "Pending" } : o
        )
      );
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send cancel request.");
    }
  };

  if (loading)
    return <div className="p-8 text-center text-gray-600 text-lg">Loading orders...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500 text-lg">{error}</div>;
  if (orders.length === 0)
    return (
      <div className="h-screen flex justify-center items-center text-gray-600 text-xl">
        No orders found 🛍️
      </div>
    );

   return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-200 to-pink-200 p-6">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 w-full bg-gradient-to-br from-blue-100 via-purple-200 to-pink-200 z-40 shadow-md py-4 flex items-center justify-between px-6">
        <IoMdArrowBack
          className="text-2xl cursor-pointer"
          onClick={() => navigate(`/success/${userId}`)}
        />
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center flex-1 mx-4 drop-shadow-sm">
          Your Orders
        </h1>
        <div className="w-6" />
      </div>

      {/* Add top padding so content doesn’t go under fixed header */}
      <div className="pt-28 h-[calc(100vh-100px)] overflow-y-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {orders.map((order) => {
            const firstItem = order.items[0];
            const moreItemsCount = order.items.length - 1;

            return (
              <div
                key={order.orderId}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 p-5 flex flex-col justify-between h-auto"
              >
                {/* Product Image + Summary */}
                <div>
                  <div className="flex flex-col items-center mb-4">
                    <img
                      src={firstItem.main_image}
                      alt={firstItem.name}
                      className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                    <div className="mt-2 text-center text-gray-700">
                      <p className="font-semibold">{firstItem.name}</p>
                      {moreItemsCount > 0 && (
                        <p className="text-sm text-gray-500">+ {moreItemsCount} more items</p>
                      )}
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>
                      <strong>Order ID:</strong>{" "}
                      <span className="text-gray-800">{order.orderId}</span>
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-medium ${
                          order.status === "pending"
                            ? "text-yellow-600"
                            : order.status === "completed"
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <strong>Payment:</strong> {order.paymentMethod}
                    </div>
                    <div>
                      <strong>Total:</strong>{" "}
                      <span className="font-semibold text-emerald-600">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                    <div>
                      <strong>Delivery:</strong> {order.deliveryStatus}
                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                      <strong>Shipping:</strong> {order.name}, {order.phone},{" "}
                      {order.shippingAddress}, {order.email}
                    </div>
                  </div>
                </div>

                {/* Cancel Button */}
                {(order.deliveryStatus === "Order Placed" ||
                  order.deliveryStatus === "Processing" ||
                  order.deliveryStatus === "Packed") && (
                  <button
                    onClick={() => handleCancelOrder(order.orderId)}
                    className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:scale-[1.02] hover:shadow-lg transition-all"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <CartFooter userId={userId} />
    </div>
  );
}
