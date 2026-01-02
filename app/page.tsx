"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Shield, TrendingUp, ChevronRight } from "lucide-react"

// Integrirani Logo (da izbjegnemo greške s importom)
const LegacyPiLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#2E0A36" stroke="#FBBF24" strokeWidth="2" />
    <path d="M50 25V75M35 25H65" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
    <path d="M35 25C35 25 35 45 25 55" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
    <path d="M65 25C65 25 65 45 75 55" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 55C50 55 40 65 40 80H60C60 65 50 55 50 55Z" fill="#FBBF24" fillOpacity="0.3" />
  </svg>
)

export default function LegacyPiPage() {
  const [impactData, setImpactData] = useState({
    totalLocked: 125847.32,
    donorsCount: 8432,
    message: "Together we create a legacy.",
  })

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  })

  const [slidePosition, setSlidePosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showGoldenFlash, setShowGoldenFlash] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulacija dohvata podataka (kako ne bi bacalo grešku bez backenda)
    const simulateLiveUpdates = () => {
      setImpactData(prev => ({
        ...prev,
        // Nasumično malo povećaj brojke da izgleda živo
        totalLocked: prev.totalLocked + Math.random() * 2,
        donorsCount: prev.donorsCount + (Math.random() > 0.8 ? 1 : 0)
      }))
    }

    const impactInterval = setInterval(simulateLiveUpdates, 30000)

    return () => clearInterval(impactInterval)
  }, [])

  useEffect(() => {
    const targetDate = new Date("2030-01-01T00:00:00")

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging && e.type !== "mousemove") return
    if (!sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    let clientX: number

    if ("touches" in e) {
      clientX = (e as React.TouchEvent).touches[0].clientX
    } else {
      clientX = (e as React.MouseEvent).clientX
    }

    const position = Math.max(0, Math.min(clientX - rect.left, rect.width - 60))
    const percentage = (position / (rect.width - 60)) * 100

    setSlidePosition(percentage)

    if (percentage >= 95) {
      completeDonation()
    }
  }

  const handleTouchEnd = () => {
    if (slidePosition < 95) {
      setSlidePosition(0)
    }
    setIsDragging(false)
  }

  const completeDonation = async () => {
    setIsDragging(false)
    setShowGoldenFlash(true)

    // Ovdje smo uklonili stvarni 'fetch' poziv jer backend ne postoji u demo okruženju,
    // što je uzrokovalo grešku koju ste vidjeli.
    // Umjesto toga, simuliramo uspješnu transakciju.

    // Simulacija uspjeha na frontendu
    setTimeout(() => {
      setImpactData((prev) => ({
         ...prev,
         totalLocked: prev.totalLocked + 10,
         donorsCount: prev.donorsCount + 1
      }))
      setShowGoldenFlash(false)
      setShowThankYou(true)
      setTimeout(() => {
        setShowThankYou(false)
        setSlidePosition(0)
      }, 3000)
    }, 500)
  }

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    size: 2 + Math.random() * 4,
  }))

  return (
    <div className="min-h-screen bg-[#1a0b2e] relative overflow-hidden font-sans text-white">
      {showGoldenFlash && <div className="absolute inset-0 bg-yellow-400 z-50 animate-flash pointer-events-none opacity-0" />}

      {showThankYou && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none bg-black/50 backdrop-blur-sm">
          <div className="bg-[#2E0A36] border border-yellow-500/50 px-8 py-6 rounded-2xl text-2xl font-bold text-center shadow-2xl animate-scale-in text-yellow-400">
            Thank you for building the future.
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-yellow-400/20 blur-[1px]"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s infinite linear`,
              animationDelay: `${particle.delay}s`,
              bottom: "-20px",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="px-4 py-6">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <LegacyPiLogo className="w-12 h-12" />
              <div>
                <h1 className="text-xl font-bold text-white">LegacyPi</h1>
                <p className="text-xs text-yellow-500/80 uppercase tracking-widest">Humanitarian Fund</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs bg-transparent border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10">
              Connect Wallet
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="max-w-md w-full space-y-8">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl scale-150 animate-pulse" />
                <div
                  className="absolute inset-0 rounded-full bg-purple-500/10 blur-3xl scale-[2] animate-pulse"
                  style={{ animationDelay: "1s" }}
                />

                <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-[#3a1c42] to-[#1a0b2e] border-2 border-yellow-500/50 flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="w-8 h-8 text-yellow-500 fill-yellow-500/20 animate-pulse" />
                    </div>
                    <div className="text-5xl font-bold text-white mb-1 tabular-nums">
                      {impactData.totalLocked.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm font-medium text-yellow-500 uppercase tracking-wider">Pi</div>
                    <div className="text-xs text-gray-400 mt-2">Heart of Treasury</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-2xl font-semibold text-gray-300">Potential for Help:</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">Immense</p>
              <p className="text-sm text-gray-500 italic mt-2">{impactData.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Users className="w-6 h-6 text-purple-400" />
                  <div className="text-xs text-gray-400">Community</div>
                  <div className="text-lg font-bold text-white">{impactData.donorsCount.toLocaleString()}</div>
                </div>
              </Card>

              <Card className="p-4 bg-white/5 backdrop-blur-sm border-white/10 text-center">
                <div className="flex flex-col items-center space-y-2">
                  <Shield className="w-6 h-6 text-green-400" />
                  <div className="text-xs text-gray-400">Security</div>
                  <div className="text-lg font-bold text-white">100%</div>
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <div
                ref={sliderRef}
                className="relative h-16 bg-black/40 rounded-full overflow-hidden border-2 border-yellow-500/30 cursor-pointer touch-none select-none"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={(e) => isDragging && handleTouchMove(e)}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-600/50 transition-all duration-75" style={{ width: `${slidePosition}%` }} />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-lg font-semibold text-gray-300 transition-opacity">
                    {slidePosition < 20 ? "Slide to Pledge" : slidePosition < 95 ? "Keep Going..." : "Complete!"}
                  </span>
                </div>

                <div
                  className="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg transition-transform duration-75 ease-out z-10"
                  style={{
                    left: `${slidePosition}%`,
                    transform: `translate(-${slidePosition}%, -50%)`, // Centriranje gumba
                  }}
                >
                  <ChevronRight className="w-6 h-6 text-black" />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 py-6 text-lg bg-transparent"
              >
                Browse Projects
              </Button>
            </div>
          </div>
        </main>

        <footer className="px-4 py-6 border-t border-white/10 mt-auto">
          <div className="max-w-md mx-auto">
            <div className="text-center space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Treasury Unlock 2030</p>
              <div className="flex items-center justify-center gap-4 text-yellow-500/90">
                <div className="text-center">
                  <div className="text-3xl font-bold tabular-nums">
                    {String(countdown.days).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Days</div>
                </div>
                <div className="text-2xl text-primary/50 font-thin">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold tabular-nums">
                    {String(countdown.hours).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Hours</div>
                </div>
                <div className="text-2xl text-primary/50 font-thin">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold tabular-nums">
                    {String(countdown.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Minutes</div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}