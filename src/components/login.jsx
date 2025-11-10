import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loginui from "./loginui";
import { toast } from "react-toastify";

 const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [page, setPage] = useState(true);
  const [lastResendTime, setLastResendTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
 

  const canResend = () => Date.now() - lastResendTime >= 30000;

   useEffect(() => {
    if (resendTimer === 0) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    if (!page && otp.length !== 6) {
      toast.error("OTP must be exactly 6 digits");
      return;
    }

    if (page) {
      const res = await axios.post(`${API_URL}/sendotp`, { email });
      if (res.status === 200) {
        setPage(false);
        setResendTimer(30);
        toast.success("OTP sent successfully!");
      }
    } else {
      const res = await axios.post(`${API_URL}/verifyotp`, { email, otp }, { withCredentials: true });

      if (res.status === 200) {
        toast.success("OTP verified successfully!");
        const { userId, role } = res.data;

        if (role === 1) {
          window.location.href = `http://localhost:3000/admin/${userId}`;
        } else {
          navigate(`/success/${userId}`);
        }
      }
    }
  } catch (err) {
    console.log(err);
    page ? toast.error("Error sending OTP") : toast.error("Invalid OTP");
  } finally {
    setLoading(false);
  }
};


  const handleResend = async () => {
    if (!canResend()) {
      toast.info("Please wait 30 seconds before resending OTP.");
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/resendotp`, {
        email,
      });
      if (res.status === 200) {
        setOtp("");
        setResendTimer(30); 
        setLastResendTime(Date.now());
        toast.success("New OTP sent!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Error resending OTP");
    }
  };

  return (
    <Loginui
      page={page}
      email={email}
      setEmail={setEmail}
      otp={otp}
      setOtp={setOtp}
      handleSubmit={handleSubmit}
      handleResend={handleResend}
      canResend={canResend}
      loading={loading} 
      resendTimer={resendTimer}
    />
  );
}
