import { FaHome } from "react-icons/fa";
import { useNavigate} from "react-router-dom";

export default function Ordersuccess() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-6 text-center">
        Thank You for Your Order!
      </h1>
      <p className="text-xl mb-8 text-center">
        Your order has been successfully placed.
      </p>

      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-all"
      >
        <FaHome className="text-2xl" /> Go to Homepage
      </button>
    </div>
  );
}
