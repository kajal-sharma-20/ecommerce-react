import { FaUserCircle, FaSearch, FaCrown, FaHeart, FaRegHeart } from "react-icons/fa";
import Modals from "./modals";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Fuse from "fuse.js";
import { useDispatch, useSelector } from "react-redux";
import { addToCart} from "../redux/cartslice.js";
import CartFooter from "./cartfooter.jsx";
import {
  fetchWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistslice.js";

const API_URL = process.env.REACT_APP_API_URL;

export default function Success() {
  const { id: userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const isModalOpen = searchParams.get("modal") === "open";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4; // smaller cards, more per row
  const [userPlan, setUserPlan] = useState(null);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const openModal = () => setSearchParams({ modal: "open" });
  const closeModal = () => setSearchParams({});


  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/getproducts`);
      if (res.status === 200 && res.data.products) {
        setProducts(res.data.products);
        setCategories([...new Set(res.data.products.map((p) => p.category))]);
        setFilteredProducts(res.data.products);
      } else setProducts([]);
    } catch (err) {
      toast.error("Products could not be fetched");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user plan
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const res = await axios.get(`${API_URL}/getplans/${userId}`);
        const activePlan =
          res.data.plans?.find(
            (p) =>
              p.subscription_status === "active" &&
              ["pro", "premium"].includes(p.plan_name.toLowerCase())
          ) || null;
        setUserPlan(activePlan ? activePlan.plan_name.toLowerCase() : "basic");
      } catch {
        setUserPlan("basic");
      }
    };
    fetchUserPlan();
  }, [userId]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Filter + search
  useEffect(() => {
    let visibleProducts = [...products];
    if (selectedCategory) visibleProducts = visibleProducts.filter(p => p.category === selectedCategory);
    if (debouncedSearchTerm.trim()) {
      const fuse = new Fuse(visibleProducts, {
        keys: [
          { name: "name", weight: 0.6 },
          { name: "description", weight: 0.3 },
          { name: "category", weight: 0.1 },
        ],
        threshold: 0.3,
        distance: 100,
        ignoreLocation: true,
      });
      const results = fuse.search(debouncedSearchTerm);
      visibleProducts = results.map(r => r.item);
    }
    setFilteredProducts(visibleProducts);
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, products]);

  const wishlist = useSelector(state => state.wishlist.items);

  useEffect(() => {
    dispatch(fetchWishlistItems(userId));
  }, [dispatch, userId]);

  const handleToggleWishlist = async (productId) => {
    const isWishlisted = wishlist.some(item => item.product_id === productId);
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist({ userId, productId })).unwrap();
        toast.info("Removed from wishlist");
      } else {
        await dispatch(addToWishlist({ userId, productId })).unwrap();
        toast.success("Added to wishlist");
      }
      dispatch(fetchWishlistItems(userId));
    } catch (err) {
      toast.error(err.message || "Failed to update wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200 p-4 sm:p-6 md:p-8">
  {/* User icon */}
  <div className="fixed top-4 right-4 z-50">
    <FaUserCircle
      className="text-white text-4xl sm:text-5xl cursor-pointer"
      onClick={openModal}
    />
    {["pro","premium"].includes(userPlan) && (
      <FaCrown className="absolute -top-1 -right-1 text-purple-500 text-xl sm:text-2xl" />
    )}
  </div>
   <h1 className="fixed top-0 left-0 w-full text-3xl sm:text-4xl font-bold text-purple-900 bg-gradient-to-r from-blue-100 via-purple-200 to-pink-200 py-4 text-center shadow-md z-40">
  Products
</h1>


  {/* Filters & Search */}
  <div className="mt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
    {/* Category Filter */}
    <div className="flex items-center gap-2 p-2 sm:p-3 rounded shadow-sm w-full sm:w-auto">
      <label className="text-gray-700 font-medium text-sm sm:text-base">Category:</label>
      <select
        className="p-1 sm:p-2 rounded border border-gray-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All</option>
        {categories.map((cat, idx) => (
          <option key={idx} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        ))}
      </select>
    </div>

    {/* Search Bar */}
    <div className="flex items-center p-2 sm:p-3 rounded shadow-sm w-full sm:w-72">
      <input
        type="text"
        placeholder="Search by category,name,description"
        className="flex-1 p-1 sm:p-2 border border-gray-300 rounded text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  </div>

  {/* Products grid */}
  {loading ? (
    <p className="text-center text-teal-950 text-lg sm:text-xl mt-12">Loading products...</p>
  ) : filteredProducts.length === 0 ? (
    <p className="text-center text-teal-950 text-lg sm:text-xl mt-12 h-screen">No products found</p>
  ) : (
    <>
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 p-3 flex flex-col min-h-[240px] cursor-pointer"
            onClick={() => navigate(`/product/${userId}/${product.id}`)}
          >
            <div className="relative w-full h-32 sm:h-36 mb-3 rounded overflow-hidden">
              <img
                src={product.main_image || product.image[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute top-1 right-1"
                onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product.id); }}
              >
                {wishlist.some(item => item.product_id === product.id) ? (
                  <FaHeart className="text-red-500 text-xl sm:text-2xl" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-xl sm:text-2xl hover:text-red-500" />
                )}
              </div>
            </div>
            <h2 className="font-semibold text-sm sm:text-base truncate">{product.name}</h2>
            <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{product.description}</p>
            <p className="font-bold mt-1 text-sm sm:text-base">₹{product.price}</p>
            {product.stock > 0 ? (
              <button
                className="bg-purple-500 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded mt-auto hover:bg-purple-600"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const res = await dispatch(addToCart({ userId, productId: product.id })).unwrap();
                    toast.success(res.message);
                  } catch {
                    toast.error("Something went wrong");
                  }
                }}
              >
                Add To Cart
              </button>
            ) : (
              <button
                className="bg-gray-400 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded mt-auto cursor-not-allowed"
                disabled
              >
                Out of Stock
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-3 w-full sm:w-auto max-w-xs mx-auto">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
    className={`py-1 px-3 rounded font-semibold text-sm transition ${
      currentPage === 1
        ? "bg-gray-400 hover:bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-purple-500 text-white hover:bg-purple-600"
    }`}
  >
    Prev
  </button>

  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm whitespace-nowrap">
    Page {currentPage} of {Math.ceil(filteredProducts.length / productsPerPage)}
  </span>

  <button
    disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
    onClick={() => setCurrentPage((prev) => prev + 1)}
    className={`py-1 px-3 rounded font-semibold text-sm transition ${
      currentPage === Math.ceil(filteredProducts.length / productsPerPage)
        ? "bg-gray-400 hover:bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-purple-500 text-white hover:bg-purple-600"
    }`}
  >
    Next
  </button>
</div>

    </>
  )}

  <Modals isOpen={isModalOpen} onClose={closeModal} userId={userId} />
  <CartFooter userId={userId} />
</div>
  );
}
