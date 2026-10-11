import { Link } from "react-router-dom"
import { Shield, Github, Twitter, Linkedin, Mail, Heart, Terminal, Lock, Zap, Users } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 border-t border-blue-500/20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      
      <div className="relative container mx-auto px-6 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-600 shadow-lg shadow-blue-500/25">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  CYBERVERSE
                </span>
                <span className="text-xs text-slate-400 -mt-1">Learning Platform</span>
              </div>
            </Link>
            
            <p className="text-slate-400 text-sm max-w-xs">
              Enhance your learning through hands-on practice with interactive labs and collaborative environments.
            </p>
            
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-cyan-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Learning Section */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Learning
            </h3>
            <div className="space-y-2">
              <Link to="/labs" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                Interactive Labs
              </Link>
              <Link to="/rooms" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                Attack Rooms
              </Link>
              <Link to="/leaderboard" className="block text-slate-400 hover:text-cyan-400 transition-colors text-sm">
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Security Categories */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              Topics
            </h3>
            <div className="space-y-2">
              <Link to="/labs?category=web" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Web Security
              </Link>
              <Link to="/labs?category=network" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Network Security
              </Link>
              <Link to="/labs?category=crypto" className="block text-slate-400 hover:text-blue-400 transition-colors text-sm">
                Cryptography
              </Link>
            </div>
          </div>

          {/* Support Section */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-400" />
              Support
            </h3>
            <div className="space-y-2">
              <Link to="/help" className="block text-slate-400 hover:text-teal-400 transition-colors text-sm">
                Help Center
              </Link>
              <Link to="/contact" className="block text-slate-400 hover:text-teal-400 transition-colors text-sm">
                Contact Us
              </Link>
              <Link to="/privacy" className="block text-slate-400 hover:text-teal-400 transition-colors text-sm">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-500/20 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-slate-400 text-sm">
              © 2024 CyberVerse. All rights reserved.
            </p>
            
            <div className="text-sm">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-medium">
                Interactive Digital Learning Platform
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}