"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Shield, TrendingUp, ChevronRight } from "lucide-react"

// 1. Integrirana Logo Komponenta (da ne moraš kreirati poseban file)
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
  // Stanje podataka
  const [impactData, setImpactData] = useState({
    totalLocked: 125847.32,
    donorsCount: 8432,
    message: "Together we create a legacy.",
  })

  // Stanje odbrojavanja
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  })

  // Stanje slidera i interakcija
  const [slidePosition, setSlidePosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showGoldenFlash, setShowGoldenFlash] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const sliderRef = useRef<HTMLDivElement>(null)

  // -- SIMULACIJA DOHVATA PODATAKA (Zamjenjuje /api/impact) --
  useEffect(() => {
    // Ovdje bi išao pravi fetch. Za demo, samo simuliramo učitavanje.
    console.log("Connected to Pi Legacy Vault...")
  }, [])

  // -- LOGIKA ODBROJAVANJA (Countdown) --
  useEffect(() => {
    const targetDate = new Date("2030-01-01T00:00:00").getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance < 0) {
        clearInterval(interval)
        return
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // -- LOGIKA SLIDERA (MIŠ) --
  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderRef.current) return
      moveSlider(e.clientX)
    }

    const handleMouseUp = () => {
      endDrag()
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  // Zajednička logika za pomicanje
  const moveSlider = (clientX: number) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const position = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const percentage = (position / rect.width) * 100
    
    setSlidePosition(percentage)
    
    if (percentage >= 95) {
      completeDonation()
    }
  }

  const endDrag = () => {
    setIsDragging(false)
    if (slidePosition < 95) {
      setSlidePosition(0)
    }
  }

  // -- HANDLERI ZA DODIR (TOUCH) --
  const handleTouchStart = () => setIsDragging(true)
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    moveSlider(e.touches[0].clientX)
  }

  // -- LOGIKA DONIRANJA --
  const completeDonation = async () => {
    setIsDragging(false)
    setShowGoldenFlash(true)

    // Simulacija API poziva
    setTimeout(() => {
      setImpactData((prev) => ({
        ...prev,
        totalLocked: prev.totalLocked + 100, // Dodajemo 100 Pi kao primjer
        donorsCount: prev.donorsCount + 1,
      }))
    }, 500)

    // Animacijski slijed
    setTimeout(() => {
      setShowGoldenFlash(false)
      setShowThankYou(true)
      setTimeout(() => {
        setShowThankYou(false)
        setSlidePosition(0)
      }, 3000)
    }, 500)
  }

  // Generiranje čestica za pozadinu
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    size: 2 + Math.random() * 4,
  }))

  return (
    <div className="min-h-screen bg-[#1a0b2e] relative overflow-hidden text-white font-sans">
      {/* 1. Golden flash overlay */}
      {showGoldenFlash && (
        <div className="absolute inset-0 bg-yellow-400 z-50 animate-flash pointer-events-none opacity-0" />
      )}

      {/* 2. Thank you message */}
      {showThankYou && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none bg-black/60 backdrop-blur-sm transition-all duration-500">
          <div className="bg-[#2E0A36] border border-yellow-500/50 px-8 py-10 rounded-2xl text-center shadow-2xl transform scale-100 animate-in fade-in zoom-in duration-300">
            <LegacyPiLogo className="w-16 h-16 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Pledged for 2030</h2>
            <p className="text-gray-300">Thank you for building the future.</p>
          </div>
        </div>
      )}

      {/* 3. Floating particles (Background) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-yellow-400/20 blur-[1px]"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              bottom: "-20px",
              animation: `float ${particle.duration}s infinite linear`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* HEADER */}
        <header className="px-4 py-6">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <LegacyPiLogo className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">LegacyPi</h1>
                <p className="text-[10px] text-yellow-500/80 uppercase tracking-widest">Humanitarian Fund</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 bg-transparent rounded-full px-4">
              Wallet Connected
            </Button>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-2">
          <div className="max-w-md w-full space-y-10">
            
            {/* HERO: The Heart of the Vault */}
            <div className="flex items-center justify-center py-6">
              <div className="relative group cursor-default">
                {/* Glowing effects */}
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl scale-110 animate-pulse" />
                <div className="absolute inset-0 rounded-full bg-yellow-500/10 blur-3xl scale-150" />

                <div className="relative w-64 h-64 rounded-full bg-gradient-to-b from-[#3a1c42] to-[#1a0b2e] border border-yellow-500/30 flex items-center justify-center shadow-2xl shadow-purple-900/50">
                  <div className="text-center z-10">
                    <div className="flex items-center justify-center mb-3">
                      <Heart className="w-8 h-8 text-yellow-500 fill-yellow-500/20 animate-pulse" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-1 tabular-nums tracking-tighter">
                      {impactData.totalLocked.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm font-medium text-yellow-500 uppercase tracking-widest">Pi Locked</div>
                    <div className="text-xs text-gray-400 mt-2">Until 2030</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <div className="text-center space-y-1">
              <p className="text-lg text-gray-300">Potential for Help:</p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
                Immense & Growing
              </p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-white/5 backdrop-blur-md border-white/10 text-center hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-lg font-bold text-white">{impactData.donorsCount.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-400 uppercase">Guardians</div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/5 backdrop-blur-md border-white/10 text-center hover:bg-white/10 transition-colors">
                <div className="flex flex-col items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-lg font-bold text-white">100%</div>
                    <div className="text-[10px] text-gray-400 uppercase">Secure</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* SLIDER INTERACTION */}
            <div className="space-y-4 pt-4">
              <div
                ref={sliderRef}
                className="relative h-16 bg-black/40 rounded-full overflow-hidden border border-white/10 select-none touch-none cursor-pointer shadow-inner"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={endDrag}
                onMouseDown={() => setIsDragging(true)}
              >
                {/* Progress fill */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-600/50 transition-all duration-75 ease-out"
                  style={{ width: `${slidePosition}%` }}
                />

                {/* Text Instructions */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className={`text-sm font-semibold tracking-wider transition-opacity duration-300 ${slidePosition > 20 ? 'opacity-0' : 'text-gray-400'}`}>
                    SLIDE TO PLEDGE
                  </span>
                  <span className={`absolute text-sm font-bold text-white tracking-wider transition-opacity duration-300 ${slidePosition > 20 && slidePosition < 95 ? 'opacity-100' : 'opacity-0'}`}>
                    HOLD TO CONFIRM...
                  </span>
                </div>

                {/* The Knob */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-14 w-14 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)] z-10 transition-transform duration-75 ease-out active:scale-95"
                  style={{
                    left: `${slidePosition}%`,
                    transform: `translate(${slidePosition > 90 ? '-90%' : '-10%'}, -50%)`, // Korekcija da gumb ostane unutar okvira
                  }}
                >
                  <ChevronRight className="w-8 h-8 text-black ml-1" />
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* FOOTER COUNTDOWN */}
        <footer className="px-4 py-8 border-t border-white/5 bg-black/20 mt-auto">
          <div className="max-w-md mx-auto text-center space-y-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Treasury Unlock Date: Jan 1, 2030</p>
            
            <div className="flex items-center justify-center gap-6 text-yellow-500/90">
              <div className="text-center">
                <div className="text-2xl font-bold tabular-nums">{String(countdown.days).padStart(2, "0")}</div>
                <div className="text-[9px] text-gray-500 uppercase mt-1">Days</div>
              </div>
              <div className="text-xl font-thin opacity-30">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold tabular-nums">{String(countdown.hours).padStart(2, "0")}</div>
                <div className="text-[9px] text-gray-500 uppercase mt-1">Hours</div>
              </div>
              <div className="text-xl font-thin opacity-30">:</div>
              <div className="text-center">
                <div className="text-2xl font-bold tabular-nums">{String(countdown.minutes).padStart(2, "0")}</div>
                <div className="text-[9px] text-gray-500 uppercase mt-1">Mins</div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}