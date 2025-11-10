import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Success from "./components/success";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import ProductDetails from "./components/productdetails";
import Addtocart from "./components/addtocart";
import Wishlist from "./components/wishlist";
import Userorders from "./components/userorders";
import Createorder from "./components/createorder";
import Ordersuccess from "./components/ordersuccess";
import Plans from "./components/plans";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/notfound";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/success/:id" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/product/:userid/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/addtocart/:userid" element={<ProtectedRoute><Addtocart /></ProtectedRoute>} />
        <Route path="/wishlist/:userid" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/userorders/:userId" element={<ProtectedRoute><Userorders /></ProtectedRoute>} />
        <Route path="/createorder/:userid" element={<ProtectedRoute><Createorder /></ProtectedRoute>} />
        <Route path="/ordersuccess" element={<ProtectedRoute><Ordersuccess /></ProtectedRoute>} />
        <Route path="/plans/:userId" element={<ProtectedRoute><Plans/></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={2000} 
        hideProgressBar={true}
        newestOnTop={false}
        theme="dark"
        closeButton={false} 
        toastClassName="text-sm"
      />
    </Router>
  );
}



