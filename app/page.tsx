"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Shield, TrendingUp, ChevronRight } from "lucide-react"
import { LegacyPiLogo } from "@/components/legacy-pi-logo"

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
    const fetchImpactData = async () => {
      try {
        const response = await fetch("/api/impact")
        const result = await response.json()

        if (result.success) {
          setImpactData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch impact data:", error)
      }
    }

    fetchImpactData()

    const impactInterval = setInterval(fetchImpactData, 30000)

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
      clientX = e.touches[0].clientX
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

    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user_demo_123",
          amount: 10,
          message: "Supporting humanitarian mission",
        }),
      })

      const result = await response.json()

      if (result.status === "Success") {
        setImpactData((prev) => ({
          ...prev,
          totalLocked: prev.totalLocked + 10,
        }))
      }
    } catch (error) {
      console.error("Donation error:", error)
    }

    setTimeout(() => {
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {showGoldenFlash && <div className="absolute inset-0 bg-primary z-50 animate-flash pointer-events-none" />}

      {showThankYou && (
        <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-primary text-primary-foreground px-8 py-6 rounded-2xl text-2xl font-bold text-center shadow-2xl animate-scale-in">
            Thank you for building the future.
          </div>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute animate-float rounded-full bg-primary/60 blur-sm"
            style={{
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
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
                <h1 className="text-xl font-bold text-foreground">LegacyPi</h1>
                <p className="text-xs text-muted-foreground">Humanitarian Fund</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              Connect Wallet
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="max-w-md w-full space-y-8">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl scale-150 animate-breathe" />
                <div
                  className="absolute inset-0 rounded-full bg-primary/10 blur-3xl scale-[2] animate-breathe"
                  style={{ animationDelay: "1s" }}
                />

                <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/50 flex items-center justify-center animate-breathe backdrop-blur-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Heart className="w-8 h-8 text-primary fill-primary/20" />
                    </div>
                    <div className="text-5xl font-bold text-foreground mb-1">
                      {impactData.totalLocked.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm font-medium text-primary uppercase tracking-wider">Pi</div>
                    <div className="text-xs text-muted-foreground mt-2">Heart of Treasury</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-2xl font-semibold text-foreground">Potential for Help:</p>
              <p className="text-3xl font-bold text-primary">Immense</p>
              <p className="text-sm text-muted-foreground italic mt-2">{impactData.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Users className="w-6 h-6 text-primary" />
                  <div className="text-xs text-muted-foreground">Community</div>
                  <div className="text-lg font-bold text-foreground">{impactData.donorsCount.toLocaleString()}</div>
                </div>
              </Card>

              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="flex flex-col items-center text-center space-y-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <div className="text-xs text-muted-foreground">Security</div>
                  <div className="text-lg font-bold text-foreground">100%</div>
                </div>
              </Card>

              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 col-span-2">
                <div className="flex flex-col items-center text-center space-y-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <div className="text-xs text-muted-foreground">Projects Supported</div>
                  <div className="text-lg font-bold text-foreground">47</div>
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <div
                ref={sliderRef}
                className="relative h-16 bg-secondary/30 rounded-full overflow-hidden border-2 border-primary/30 cursor-pointer"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={(e) => isDragging && handleTouchMove(e)}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
              >
                <div className="absolute inset-0 bg-primary/20 transition-all" style={{ width: `${slidePosition}%` }} />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-lg font-semibold text-foreground">
                    {slidePosition < 20 ? "Slide to Pledge" : slidePosition < 95 ? "Keep Going..." : "Complete!"}
                  </span>
                </div>

                <div
                  className="absolute top-2 left-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg transition-all"
                  style={{
                    transform: `translateX(${(slidePosition / 100) * (sliderRef.current?.offsetWidth ? sliderRef.current.offsetWidth - 64 : 0)}px)`,
                  }}
                >
                  <ChevronRight className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-primary/50 text-foreground hover:bg-primary/10 py-6 text-lg bg-transparent"
              >
                Browse Projects
              </Button>
            </div>
          </div>
        </main>

        <footer className="px-4 py-6 border-t border-border/30">
          <div className="max-w-md mx-auto">
            <div className="text-center space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Treasury Unlock 2030</p>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary tabular-nums">
                    {String(countdown.days).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Days</div>
                </div>
                <div className="text-2xl text-primary/50 font-thin">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary tabular-nums">
                    {String(countdown.hours).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Hours</div>
                </div>
                <div className="text-2xl text-primary/50 font-thin">:</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary tabular-nums">
                    {String(countdown.minutes).padStart(2, "0")}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Minutes</div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
