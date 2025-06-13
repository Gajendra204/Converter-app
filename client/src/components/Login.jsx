"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { signInWithGoogle } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    try {
      setError("")
      setLoading(true)
      await signInWithGoogle()
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Universal File Converter</h1>
          <p className="text-gray-600">Sign in to access the file converter</p>
        </div>

        {error && <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-3 mb-4"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
              fill="#4285F4"
            />
            <path
              d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.19 18.63 6.8 16.73 5.95 14.09H2.27V16.95C4.08 20.53 7.76 23 12 23Z"
              fill="#34A853"
            />
            <path
              d="M5.95 14.09C5.73 13.44 5.61 12.74 5.61 12C5.61 11.26 5.73 10.56 5.95 9.91V7.05H2.27C1.46 8.55 1 10.22 1 12C1 13.78 1.46 15.45 2.27 16.95L5.95 14.09Z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.37C13.62 5.37 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.76 1 4.08 3.47 2.27 7.05L5.95 9.91C6.8 7.27 9.19 5.37 12 5.37Z"
              fill="#EA4335"
            />
          </svg>
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <p className="text-center text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
