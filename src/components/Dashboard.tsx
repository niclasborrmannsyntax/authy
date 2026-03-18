import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

export function Dashboard() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setError("");
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Welcome!
      </h1>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-5 rounded text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-5 mb-6 border-l-4 border-indigo-500">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          User Information
        </h2>
        <p className="text-gray-700 text-sm mb-2">
          <strong>Email:</strong> {user?.email}
        </p>
        <p className="text-gray-700 text-sm mb-2">
          <strong>User ID:</strong> {user?.uid}
        </p>
        <p className="text-gray-700 text-sm">
          <strong>Email Verified:</strong> {user?.emailVerified ? "Yes" : "No"}
        </p>
      </div>

      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-md hover:shadow-lg hover:-translate-y-0.5 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
