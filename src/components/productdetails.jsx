import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartslice.js";
import CartFooter from "./cartfooter.jsx";
import { IoMdArrowBack } from "react-icons/io";

const API_URL = process.env.REACT_APP_API_URL;

export default function ProductDetails() {
  const { id, userid: userId } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

 useEffect(() => {
  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${API_URL}/getproduct/${id}`);
      if (res.status === 200) {
        const productData = res.data.product;

        const allImages = productData.main_image
          ? [
              productData.main_image,
              ...productData.image.filter((img) => img !== productData.main_image),
            ]
          : [...productData.image];

        setProduct({ ...productData, allImages });
        setMainImage(allImages[0] || "");
      } else {
        toast.error("Product not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching product");
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);


  if (loading)
    return (
      <p className="h-screen flex items-center justify-center text-lg text-gray-700">
        Loading...
      </p>
    );

  if (!product)
    return (
      <p className="h-screen flex items-center justify-center text-lg text-gray-700">
        Product not found
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-white to-blue-100 flex flex-col items-center relative">
      {/* Sticky header */}
      <div className="fixed top-0 left-0 w-full bg-gradient-to-br from-indigo-200 via-white to-blue-100 z-50 shadow-md flex items-center px-6 py-4">
        <IoMdArrowBack
          className="text-2xl cursor-pointer"
          onClick={() => navigate(`/success/${userId}`)}
        />
        <h1 className="text-2xl font-bold text-center flex-1">
          Product Details
        </h1>
        <div className="w-6" />
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start w-full max-w-6xl mt-28 px-4 sm:px-6 md:px-8 gap-8">
        {/* Images Section */}
        <div className="flex-1 flex flex-col items-center">
          {mainImage && (
            <div className="w-full md:w-[400px] h-72 md:h-96 overflow-hidden rounded-2xl shadow-lg mb-4">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain transition-all duration-300"
              />
            </div>
          )}

          {/* Thumbnails */}
          {product.allImages && product.allImages.length > 0 && (
            <div className="flex gap-3 flex-wrap justify-center">
              {product.allImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumbnail-${idx}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                    img === mainImage
                      ? "border-blue-500 scale-110"
                      : "border-gray-300 hover:scale-105"
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl font-extrabold mb-3">{product.name}</h1>
          <p className="text-gray-700 mb-3">{product.description}</p>
          <p className="text-gray-600 mb-2 font-medium">Category: {product.category}</p>
          <p className="text-2xl font-bold text-indigo-600 mb-4">₹{product.price}</p>
          <p className={`mb-4 font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </p>

          {product.stock > 0 ? (
            <button
              onClick={async () => {
                try {
                  const res = await dispatch(
                    addToCart({ userId, productId: product.id })
                  ).unwrap();
                  toast.success(res.message);
                } catch (err) {
                  toast.error(err.message || "Something went wrong");
                }
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.03] transition-all"
            >
              Add To Cart
            </button>
          ) : (
            <button
              className="bg-gray-400 text-white px-6 py-3 rounded-xl cursor-not-allowed"
              disabled
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>

      {/* Sticky Cart Footer */}
      <CartFooter userId={userId} />
    </div>
  );
}
