import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../contexts/app-context"

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true })
    }
  }, [isAuthenticated, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}