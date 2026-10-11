import { Link } from "react-router-dom"
import { useApp } from "../contexts/app-context"
import { ModernButton } from "../components/ui/modern-button"
import { Shield, Zap, Users, Trophy, Lock, Terminal, Network, Code, ArrowRight, Star, Sparkles, Play, CheckCircle } from "lucide-react"
import { memo, useMemo, useCallback } from "react"

// Memoized feature card component
const FeatureCard = memo(({ feature, index }) => {
  const Icon = feature.icon
  return (
    <div className="group h-full card p-4 flex flex-col transition-all duration-300 hover:border-primary/30">
      <div className="will-change-transform">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold text-text text-sm">{feature.title}</h3>
        </div>
        <p className="text-sm text-muted leading-relaxed flex-1">
          {feature.description}
        </p>
      </div>
    </div>
  )
})

// Memoized category card component
const CategoryCard = memo(({ category, index }) => {
  const Icon = category.icon
  return (
    <Link to="/labs" className="group block h-full">
      <div className="card p-5 text-center h-full transition-all duration-300 hover:border-primary/30">
        <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-text">{category.name}</h3>
        <div className="text-2xl font-bold text-primary mb-1">{category.count}</div>
        <p className="text-xs text-muted/70">Available Labs</p>
      </div>
    </Link>
  )
})

const Home = memo(() => {
  const { isAuthenticated } = useApp()

  // Memoized data to prevent re-renders
  const features = useMemo(() => [
    {
      icon: Terminal,
      title: "Interactive Labs",
      description: "Practice real-world cybersecurity scenarios in isolated virtual environments",
      color: "teal"
    },
    {
      icon: Network,
      title: "Live Attack Rooms",
      description: "Join collaborative hacking challenges with players worldwide",
      color: "coral"
    },
    {
      icon: Trophy,
      title: "Global Leaderboard",
      description: "Compete with hackers globally and climb the ranks",
      color: "sunflower"
    },
    {
      icon: Code,
      title: "Skill Progression",
      description: "Track your learning journey from beginner to expert",
      color: "glow"
    },
  ], [])

  const categories = useMemo(() => [
    { name: "Web Security", icon: Lock, count: 0, color: "coral" },
    { name: "Network Pentesting", icon: Network, count: 0, color: "teal" },
    { name: "Cryptography", icon: Shield, count: 0, color: "glow" },
    { name: "Forensics", icon: Zap, count: 0, color: "glass" },
  ], [])

  // Memoized navigation handlers
  const handleGetStarted = useCallback(() => {
    // Add any analytics or tracking here
  }, [])

  const handleViewLabs = useCallback(() => {
    // Add any analytics or tracking here
  }, [])

  return (
    <div className="page-container bg-[rgb(17,24,39)] text-text">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        
        <div className="container relative mx-auto px-6 max-w-6xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-sm">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-primary">Next-gen security training</span>
            </div>
            
            <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
              Master{" "}
              <span className="gradient-text">technical </span>
              {" "}Skills
            </h1>
            
            <p className="mb-8 text-lg text-muted max-w-2xl mx-auto">
              Learn through hands-on labs, compete in live challenges, and advance your career
            </p>
            
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center mb-12">
              <Link to={isAuthenticated ? "/dashboard" : "/signup"} onClick={handleGetStarted} className="btn-primary group flex items-center justify-center text-base px-6 py-3">
                <span>{isAuthenticated ? "Go to Dashboard" : "Start Free Trial"}</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform will-change-transform" />
              </Link>
              <Link to="/labs" onClick={handleViewLabs} className="btn-ghost group flex items-center justify-center text-base px-6 py-3 rounded-lg">
                View Labs
              </Link>
            </div>

            {/* Compact Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-xs text-muted/70">Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">0</div>
                <div className="text-xs text-muted/70">Labs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-2">24/7</div>
                <div className="text-xs text-muted/70">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-text">Why Choose CyberVerse?</h2>
            <p className="text-muted max-w-2xl mx-auto">Professional training with real-world scenarios</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-2xl font-bold text-text">Learning Paths</h2>
            <p className="text-muted max-w-2xl mx-auto">Choose your specialization and advance your skills</p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, index) => (
              <CategoryCard key={index} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="card text-center p-8">
            <div className="mb-6 mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-text">
              Join Security Professionals
            </h2>
            <p className="mb-8 text-muted max-w-2xl mx-auto">
              Start your cybersecurity journey today with hands-on training and real-world scenarios
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              {!isAuthenticated ? (
                <>
                  <Link to="/signup" className="btn-primary group flex items-center justify-center text-base px-6 py-3">
                    <span>Get Started Free</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform will-change-transform" />
                  </Link>
                  <Link to="/login" className="btn-ghost flex items-center justify-center text-base px-6 py-3 rounded-lg">Sign In</Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn-primary group flex items-center justify-center text-base px-6 py-3">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform will-change-transform" />
                </Link>
              )}
            </div>
            
            <p className="text-xs text-slate-500">
              No credit card required • Free trial • Join in seconds
            </p>
          </div>
        </div>
      </section>
    </div>
  )
})

Home.displayName = 'Home'
export default Home