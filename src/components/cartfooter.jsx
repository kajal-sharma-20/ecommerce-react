import { FaShoppingCart, FaHeart,FaBox, FaStar, FaSignOutAlt  } from "react-icons/fa";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { persistor } from "../redux/store";

const API_URL = process.env.REACT_APP_API_URL;

function CartFooter({ userId }) {
  const navigate = useNavigate();

  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_URL}/logout`, // your backend logout route
        {},
        { withCredentials: true } // important to clear cookies
      );
      localStorage.removeItem("token"); 
      toast.success("Logged out successfully!");
      persistor.purge(); // Clears persisted data
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };


  return (
    <div className="h-auto p-12 pb-8">
    <div className="fixed bottom-0 left-0 w-full shadow-md py-2 flex gap-6 justify-start pl-8 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      
      <div className="relative cursor-pointer" onClick={() => navigate(`/addtocart/${userId}`)}>
        <FaShoppingCart className="text-xl text-blue-500" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center text-xs">
            {cartCount}
          </span>
        )}
        <span className="text-xs">Cart</span>
      </div>

      <div
  className="relative flex flex-col items-center cursor-pointer"
  onClick={() => navigate(`/wishlist/${userId}`)}
>
  {/* Icon container */}
  <div className="relative w-6 h-6 flex items-center justify-center">
    <FaHeart className="text-xl text-red-500" />
    {wishlistCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] leading-none">
        {wishlistCount}
      </span>
    )}
  </div>

  {/* Label */}
  <span className="text-xs">Wishlist</span>
</div>

      <div className="relative cursor-pointer" onClick={() => navigate(`/userorders/${userId}`)}>
  <FaBox className="text-xl text-gray-700" />
   <span className="text-xs">Orders</span>
</div>
<div className="relative cursor-pointer" onClick={() => navigate(`/plans/${userId}`)}>
        <FaStar className="text-xl text-purple-500" />
         <span className="text-xs">Plans</span>
      </div>
       <div
          className="relative cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="text-xl text-black" />
          <span className="text-xs">Logout</span>
        </div>
    </div>
    </div>
  );
}

export default CartFooter;
