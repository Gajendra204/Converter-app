"use client";
import { useAuth } from "../context/AuthContext";
import AdvancedFileConverter from "./AdvancedFileConverter";
import Login from "./Login";
import UserProfile from "./UserProfile";

export default function AuthenticatedApp() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-end mb-4">
          <UserProfile />
        </div>
        <AdvancedFileConverter />
      </div>
    </div>
  );
}
