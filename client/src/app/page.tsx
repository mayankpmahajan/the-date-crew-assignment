"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, ArrowRight, User, Lock, Target, BarChart3, UserCheck, Phone, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MatchmakerPortal() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem("token", data.token)
        // Redirect to dashboard on success
        router.push("/admin-dashboard")
      } else {
        setError(data.message || "Login failed. Please check your credentials.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/test.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="w-full px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">the date crew</span>
                <p className="text-rose-200 text-sm">Matchmaker Portal</p>
              </div>
            </div>
            <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 bg-transparent">
              SUPPORT
            </Button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
            {/* Left Side - Hero Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-3">
                  <h1 className="text-5xl lg:text-6xl font-black text-white leading-none tracking-tight text-shadow-lg">
                    HELP
                    <span className="block text-rose-400">PEOPLE</span>
                    <span className="block text-white text-shadow-lg">FIND THE</span>
                    <span className="block text-rose-400 text-4xl lg:text-5xl">RIGHT LOVE</span>
                  </h1>
                  <div className="flex items-center space-x-3 mt-4">
                    <div className="h-1 w-16 bg-rose-400"></div>
                    <span className="text-white/90 text-lg font-medium tracking-wide text-shadow-sm">
                      WITH PROFESSIONAL MATCHMAKING
                    </span>
                  </div>
                </div>

                <p className="text-lg text-white/90 max-w-lg leading-relaxed text-shadow-sm">
                  Your professional matchmaking dashboard. Manage client profiles, leverage AI-powered compatibility
                  analysis, and create meaningful connections for your assigned clients.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-rose-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium text-base text-shadow-sm">
                    AI-powered client matching algorithms
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-rose-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium text-base text-shadow-sm">
                    Comprehensive client profile management
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-rose-400 rounded-full shadow-lg"></div>
                  <span className="text-white font-medium text-base text-shadow-sm">
                    Advanced compatibility analytics
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-base font-medium text-white/90 mb-2 text-shadow-sm">
                  contribute to the revolution of
                </p>
                <p className="text-3xl lg:text-4xl font-black text-rose-400 tracking-tight">PROFESSIONAL MATCHMAKING</p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-md">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">Matchmaker Portal</CardTitle>
                  <CardDescription className="text-gray-600">
                    Access your client dashboard and matching tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10 h-11 border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 h-11 border-gray-200 focus:border-rose-500 focus:ring-rose-500"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-rose-600 hover:bg-rose-700 text-white font-semibold disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Signing In...
                        </>
                      ) : (
                        <>
                          Access Dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Need help accessing your account?{" "}
                      <button className="text-rose-600 hover:text-rose-700 font-medium">Contact IT Support</button>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-rose-600/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border border-rose-400/30 shadow-xl">
                <Target className="h-8 w-8 text-rose-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white text-shadow-sm">Client Management</h3>
                <p className="text-white/80 text-sm text-shadow-sm leading-relaxed">
                  Manage your assigned clients, track preferences, and monitor matching progress
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-rose-600/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border border-rose-400/30 shadow-xl">
                <BarChart3 className="h-8 w-8 text-rose-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white text-shadow-sm">AI Analytics</h3>
                <p className="text-white/80 text-sm text-shadow-sm leading-relaxed">
                  Advanced compatibility scoring and match success predictions
                </p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-rose-600/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border border-rose-400/30 shadow-xl">
                <UserCheck className="h-8 w-8 text-rose-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white text-shadow-sm">Success Tracking</h3>
                <p className="text-white/80 text-sm text-shadow-sm leading-relaxed">
                  Monitor match outcomes and optimize your matchmaking approach
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold text-white text-shadow-sm">Ready to revolutionize matchmaking?</h2>
              <p className="text-lg text-white/80 text-shadow-sm">
                Join our team of professional matchmakers and help create lasting connections using cutting-edge AI
                technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 font-semibold">
                  Get Started Today
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/30 hover:bg-white/10 px-6 py-2 font-semibold bg-transparent"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 mt-16 border-t border-white/20">
          <div className="bg-black/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-12">
              <div className="grid md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">the date crew</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Professional matchmaking platform powered by AI technology, helping create meaningful connections
                    for successful professionals.
                  </p>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-white/70 hover:text-rose-400 text-sm transition-colors">
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-rose-400 text-sm transition-colors">
                        Client Management
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-rose-400 text-sm transition-colors">
                        Analytics
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-rose-400 text-sm transition-colors">
                        Support
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Resources */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Resources</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-white/70 hover:text-rose-400 text-sm transition-colors">
                        Training Materials
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-rose-400 text-sm transition-colors">
                        Best Practices
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-rose-400 text-sm transition-colors">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-rose-400 text-sm transition-colors">
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Contact</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-rose-400" />
                      <span className="text-white/70 text-sm">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
 
                      <span className="text-white/70 text-sm">support@thedatecrew.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-rose-400" />
                      <span className="text-white/70 text-sm">New York, NY</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                <p className="text-white/60 text-sm">
                  © 2024 The Date Crew. All rights reserved. Professional matchmaking platform.
                </p>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-white/60 hover:text-rose-400 text-sm transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-white/60 hover:text-rose-400 text-sm transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="text-white/60 hover:text-rose-400 text-sm transition-colors">
                    Security
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}