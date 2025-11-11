import { useSelector, useDispatch } from "react-redux";
import { clearCart, fetchCartItems, removeFromCart, updateCartQuantity } from "../redux/cartslice.js";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdArrowBack } from "react-icons/io";
import CartFooter from "./cartfooter.jsx";


export default function Addtocart() {
  const { userid } = useParams();
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCartItems(userid));
  }, [dispatch, userid]);

const handleQuantityChange = async (productId, newQuantity, stock) => {
  try {
    if (newQuantity < 1) {
    await dispatch(
        removeFromCart({ userId: userid, productId })
      ).unwrap();
      toast.success("Item removed from cart");
      // updatedCart is now the latest array, state is updated automatically
      return;
    }
    if (newQuantity > stock) {
      toast.error("Quantity exceeds stock");
      return;
    }
    await dispatch(
      updateCartQuantity({ userId: userid, productId, quantity: newQuantity })
    ).unwrap();
    toast.success("Quantity updated");
  } catch (err) {
    console.error(err);
    toast.error(err.message || "Failed to update cart");
  }
};


  const handleProceedToOrder = () => {
  navigate(`/createorder/${userid}`); // Navigate to order form page
};

  if (loading)
    return (
      <p className="h-screen text-center mt-20 text-lg text-gray-700">Loading cart...</p>
    );
  if (!items.length)
    return (
      <p className="h-screen text-center mt-20 text-lg text-gray-700">Cart is empty</p>
    );

  return (
   <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-200 via-white to-blue-100">
  {/* Fixed header */}
  <div className="fixed top-0 left-0 w-full bg-gradient-to-br from-indigo-200 via-white to-blue-100 z-40 shadow-md py-4 px-12 flex items-center justify-between">
    <IoMdArrowBack
      className="text-2xl cursor-pointer"
      onClick={() => navigate(`/success/${userid}`)}
    />
    <h1 className="text-3xl font-bold text-center flex-1">
      Your Cart
    </h1>
    <div className="w-6" /> {/* Placeholder to keep heading centered */}
  </div>

  {/* Main content */}
  <div className="flex-1 p-12 flex flex-col items-center pt-28 w-full max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map((item) => (
        <div
          key={item.product_id}
          className="flex gap-4 items-center border p-4 rounded bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300"
        >
          <img
            src={item.main_image}
            className="w-20 h-20 object-cover"
            alt={item.name}
          />
          <div className="flex-1">
            <h2>{item.name}</h2>
            <p>₹{item.price}</p>

            {item.stock === 0 ? (
              <p className="mt-2 font-bold text-red-500">Out of Stock</p>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="bg-purple-300 px-2 py-1 rounded"
                  onClick={() =>
                    handleQuantityChange(
                      item.product_id,
                      item.quantity - 1,
                      item.stock
                    )
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="bg-purple-300 px-2 py-1 rounded"
                  onClick={() =>
                    handleQuantityChange(
                      item.product_id,
                      item.quantity + 1,
                      item.stock
                    )
                  }
                >
                  +
                </button>
              </div>
            )}

            <p>Total: ₹{item.price * item.quantity}</p>
          </div>
        </div>
      ))}
    </div>

    <p className="mt-4 font-bold text-xl">
      Cart Total: ₹
      {items
        .filter((i) => i.stock > 0)
        .reduce((sum, i) => sum + i.price * i.quantity, 0)}
    </p>
    <button
      onClick={handleProceedToOrder}
      className="mt-6 bg-purple-400 text-white px-6 py-2 rounded hover:bg-purple-300 w-full sm:w-96"
    >
      Proceed to Order
    </button>
  </div>
  <CartFooter userId={userid} />
</div>

  );
}
