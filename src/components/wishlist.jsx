import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchWishlistItems,
  removeFromWishlist,
} from "../redux/wishlistslice.js";
import { addToCart } from "../redux/cartslice.js";
import { toast } from "react-toastify";
import { IoMdArrowBack } from "react-icons/io";
import CartFooter from "./cartfooter.jsx";


export default function Wishlist() {
  const { userid } = useParams();
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);
  const navigate = useNavigate();
  

  useEffect(() => {
    dispatch(fetchWishlistItems(userid));
  }, [dispatch, userid]);

  const handleAddToCart = async (productId) => {
    try {
      const res = await dispatch(addToCart({ userId: userid, productId })).unwrap();
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message || "Failed to add to cart");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeFromWishlist({ userId: userid, productId })).unwrap();
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err.message || "Failed to remove from wishlist");
    }
  };

  if (loading)
    return (
      <p className="h-screen flex items-center justify-center text-lg font-medium text-gray-600">
        Loading wishlist...
      </p>
    );

  if (!items.length)
    return (
      <p className="h-screen flex items-center justify-center text-lg font-medium text-gray-600">
        Your wishlist is empty
      </p>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-200 via-white to-blue-100 px-4 sm:px-6 md:px-8">
  {/* Fixed header */}
  <div className="fixed top-0 left-0 w-full bg-gradient-to-br from-indigo-200 via-white to-blue-100 z-40 shadow-md py-4 flex items-center justify-between px-4 sm:px-6 md:px-8">
    <IoMdArrowBack
      className="text-2xl cursor-pointer"
      onClick={() => navigate(`/success/${userid}`)}
    />
    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text text-center flex-1 mx-4">
      Your Wishlist
    </h1>
    <div className="w-6" /> {/* Placeholder to balance flex layout */}
  </div>

  {/* Add top padding so content doesn't go under fixed header */}
  <div className="pt-28">
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full max-w-6xl mx-auto">
      {items.map((item) => (
        <div
          key={item.product_id}
          className="relative group bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 p-4 sm:p-6 flex flex-col items-center text-center"
        >
          <img
            src={item.main_image}
            alt={item.name}
            className="w-full h-40 sm:h-52 object-cover rounded-xl"
          />

          <h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-semibold text-gray-900">
            {item.name}
          </h2>
          <p className="text-gray-500 mt-1 mb-3 sm:mb-4 text-sm sm:text-base">
            ₹{item.price}
          </p>

          <div className="flex flex-col sm:flex-row w-full justify-between gap-2 sm:gap-3">
            {item.stock > 0 ? (
              <button
                onClick={() => handleAddToCart(item.product_id)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-semibold shadow transition-all duration-200"
              >
                Add to Cart
              </button>
            ) : (
              <button
                className="flex-1 bg-gray-400 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl cursor-not-allowed"
                disabled
              >
                Out of Stock
              </button>
            )}

            <button
              onClick={() => handleRemove(item.product_id)}
              className="flex-1 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-semibold shadow transition-all duration-200"
            >
              Remove
            </button>
          </div>

          {/* Glow on hover */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
        </div>
      ))}
    </div>
  </div>
   <CartFooter userId={userid} />
</div>
  );
}
