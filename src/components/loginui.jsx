import { ClipLoader } from "react-spinners";

export default function Loginui({
  page,
  email,
  setEmail,
  otp,
  setOtp,
  handleSubmit,
  handleResend,
  canResend,
  loading,
  resendTimer,
}) {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-96 text-center border border-white/30">
        {/* Header */}
        <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
          {page ? "Login with Email" : "Enter OTP"}
        </h1>
        <p className="text-sm text-blue-100 mb-6">
          Secure access to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {page ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300 disabled:opacity-70"
              >
                {loading ? <ClipLoader size={20} color="#fff" /> : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300 disabled:opacity-70"
              >
                {loading ? <ClipLoader size={20} color="#fff" /> : "Verify OTP"}
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0}
                className={`w-full py-3 rounded-xl font-semibold border border-white/40 text-white transition-all duration-300 mt-2 ${
                  resendTimer === 0
                    ? "hover:bg-white/30 hover:scale-105"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                {resendTimer === 0
                  ? "Resend OTP"
                  : `Resend in ${resendTimer}s`}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
