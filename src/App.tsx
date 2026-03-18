import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Dashboard } from "./components/Dashboard";

function AppContent() {
  const { user, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-indigo-500 to-purple-600 p-5">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-linear-to-br from-indigo-500 to-purple-600 p-5">
      {!user ? (
        authMode === "login" ? (
          <Login onSwitchToRegister={() => setAuthMode("register")} />
        ) : (
          <Register onSwitchToLogin={() => setAuthMode("login")} />
        )
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default AppContent;
