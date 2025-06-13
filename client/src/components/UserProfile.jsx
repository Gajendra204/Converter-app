"use client";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { currentUser, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border border-gray-200">
      {currentUser.photoURL ? (
        <img
          src={currentUser.photoURL || "/placeholder.svg"}
          alt={currentUser.displayName || "User"}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
          {currentUser.displayName
            ? currentUser.displayName[0].toUpperCase()
            : "U"}
        </div>
      )}
      <div className="hidden md:block">
        <p className="text-sm font-medium text-gray-900">
          {currentUser.displayName || "User"}
        </p>
        <p className="text-xs text-gray-500">{currentUser.email}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="ml-2 p-1 hover:bg-gray-100 rounded-full"
        title="Sign out"
      >
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
      </button>
    </div>
  );
}
