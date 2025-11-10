import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "react-modal";
import CartFooter from "./cartfooter";
import { IoMdArrowBack } from "react-icons/io";

Modal.setAppElement("#root");

const API_URL = process.env.REACT_APP_API_URL;

export default function Plans() {
  const { userId } = useParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const navigate=useNavigate()

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_URL}/getplans/${userId}`);
      setPlans(res.data.plans);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId) => {
    try {
      const res = await axios.post(`${API_URL}/createsubscription`, {
        userId,
        priceId,
      });
      if (res.data.sessionUrl) {
        window.location.href = res.data.sessionUrl;
      } else {
        toast.error("Failed to start subscription checkout");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create subscription");
    }
  };

  const openCancelModal = (subscriptionId) => {
    setSelectedSubscription(subscriptionId);
    setModalOpen(true);
  };

  const handleCancel = async (immediate) => {
    try {
      if (!selectedSubscription) return;
      const res = await axios.delete(`${API_URL}/cancelsubscription`, {
        data: { subscriptionId: selectedSubscription, immediate },
      });
      toast.success(res.data.message);
      setModalOpen(false);
      setTimeout(fetchPlans, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel subscription");
    }
  };

  if (loading)
    return (
      <p className="h-screen flex items-center justify-center text-lg font-medium text-gray-600">
        Loading plans...
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-blue-100 py-12 px-6 flex flex-col items-center">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 w-full bg-gradient-to-br from-indigo-200 via-white to-blue-100 z-40 shadow-md py-4 flex items-center justify-between px-6">
        <IoMdArrowBack
          className="text-2xl cursor-pointer"
          onClick={() => navigate(`/success/${userId}`)}
        />
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-transparent bg-clip-text flex-1 text-center drop-shadow-sm">
          Subscription Plans
        </h2>
        <div className="w-6" /> {/* placeholder to balance flex layout */}
      </div>

      {/* Add padding so content doesn't go under fixed header */}
      <div className="pt-28 w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="relative group bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-8 flex flex-col items-center text-center"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">
                {plan.plan_name}
              </h3>
              <p className="text-gray-500 mb-5 text-sm leading-relaxed">{plan.description}</p>
              <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                ₹{plan.price}
              </div>

              {plan.subscription_status === "active" ? (
                <button
                  onClick={() => openCancelModal(plan.stripe_subscription_id)}
                  className="w-full py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 transition-all duration-300"
                >
                  Cancel Subscription
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.stripe_price_id)}
                  className="w-full py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                >
                  Subscribe
                </button>
              )}

              {/* Glow on hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      <CartFooter userId={userId} />

      {/* Cancel Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Cancel Subscription"
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-auto p-8 transform transition-all duration-300"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">Cancel Subscription</h2>
        <p className="mb-6 text-gray-600 text-center text-sm">
          Would you like to cancel immediately or at the end of your current billing period?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleCancel(true)}
            className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white px-4 py-3 rounded-xl font-medium shadow transition-all duration-200"
          >
            Cancel Immediately
          </button>

          <button
            onClick={() => handleCancel(false)}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-4 py-3 rounded-xl font-medium shadow transition-all duration-200"
          >
            Cancel at Period End
          </button>

          <button
            onClick={() => setModalOpen(false)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-200"
          >
            Keep Subscription
          </button>
        </div>
      </Modal>
    </div>
  );
}

