import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AppProvider } from './contexts/app-context'
import { RealtimeProvider } from './contexts/realtime-context'
import Navbar from './components/navbar'
import Footer from './components/footer'
import { Suspense, lazy } from 'react'
import './App.css'

/* Lightweight Futuristic UI - Performance Optimized */
const futuristicStyles = `
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cyber-glow {
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.5);
}

.cyber-glow:hover {
  box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
}

.neon-text {
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);
}

.futuristic-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.3);
  transition: border-color 0.2s ease;
}

.futuristic-card:hover {
  border-color: rgba(0, 255, 255, 0.5);
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = futuristicStyles
  document.head.appendChild(style)
}

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Labs = lazy(() => import('./pages/Labs'))
const LabDetail = lazy(() => import('./pages/LabDetail'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Premium = lazy(() => import('./pages/Premium'))
const Checkout = lazy(() => import('./pages/Checkout'))
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'))
const Certificates = lazy(() => import('./pages/Certificates'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

const Rooms = lazy(() => import('./pages/Rooms'))
const RoomDetail = lazy(() => import('./pages/RoomDetail'))
const Leaderboard = lazy(() => import('./pages/Leaderboard'))
const Profile = lazy(() => import('./pages/Profile'))
const Settings = lazy(() => import('./pages/Settings'))
const SecureAdminLogin = lazy(() => import('./pages/SecureAdminLogin'))
const SecureAdminDashboard = lazy(() => import('./pages/SecureAdminDashboard'))



// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
)

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/secure-admin')
  
  return (
    <Suspense fallback={<PageLoader />}>
          {isAdminRoute ? (
            <Routes>
              <Route path="/secure-admin-login" element={<SecureAdminLogin />} />
              <Route path="/secure-admin-dashboard" element={<SecureAdminDashboard />} />
            </Routes>
          ) : (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
              <Navbar />
              <main className="flex-1 glass">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/labs" element={<Labs />} />
                  <Route path="/labs/:id" element={<LabDetail />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/premium" element={<Premium />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/certificates" element={<Certificates />} />
                  <Route path="/login" element={<Login />} />
                 <Route path="/signup" element={<Register />} />

                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/rooms/:slug" element={<RoomDetail />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
              <Footer />
            </div>
          )}
    </Suspense>
  )
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppProvider>
        <RealtimeProvider>
          <AppContent />
        </RealtimeProvider>
      </AppProvider>
    </Router>
  )
}

export default App