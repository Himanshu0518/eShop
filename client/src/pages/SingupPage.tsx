import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Link } from "react-router-dom"

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-slate-700">
          <div className="absolute inset-0 bg-black/20">
          <img
            src="/AuthImage.png"
            alt="Signup Background"
            className="w-full h-full object-cover opacity-80"
          />
          </div>
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <Link to='/'
            className="text-5xl font-light tracking-tight mb-4">eShop</Link>
            <p className="text-lg font-light opacity-90">Elevate your style</p>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-light opacity-80 max-w-md">
              Join thousands of fashion enthusiasts who trust eShop for curated collections and exclusive designs.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-light tracking-tight">eShop</h1>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-light tracking-tight text-slate-900">
                Create Account
              </h2>
              <p className="text-sm text-slate-600 font-light">
                Start your journey with us today
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wide text-slate-700 font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="h-12 border-slate-300 focus:border-slate-900 rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wide text-slate-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 border-slate-300 focus:border-slate-900 rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wide text-slate-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 border-slate-300 focus:border-slate-900 rounded-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wide text-slate-700 font-medium">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-12 border-slate-300 focus:border-slate-900 rounded-none"
                />
              </div>

              <Button 
                onClick={handleSubmit}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-none text-sm uppercase tracking-wider font-medium transition-colors"
              >
                Create Account
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-500 tracking-wide">Or</span>
              </div>
            </div>

            <div className="text-center text-sm">
              <span className="text-slate-600 font-light">Already have an account? </span>
              <Link to="/login" className="text-slate-900 font-medium hover:underline underline-offset-4">
                Sign in
              </Link>
            </div>

            <p className="text-xs text-slate-500 text-center font-light leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline hover:text-slate-900">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="underline hover:text-slate-900">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage