"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Shield, TrendingUp, ChevronRight, Wallet, Copy, Check, Trophy, X } from "lucide-react"

// Tvoja javna adresa trezora
const VAULT_ADDRESS = "GAGQPTC6QEFQRB6ZNHUOLLO6HCFDPVVA63IDCQ62GCUG6GFXKALKXGFF"

declare global {
  interface Window {
    Pi: any;
  }
}

// Logo komponenta
const LegacyPiLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="#2E0A36" stroke="#FBBF24" strokeWidth="2" />
    <path d="M50 25V75M35 25H65" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" />
    <path d="M35 25C35 25 35 45 25 55" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
    <path d="M65 25C65 25 65 45 75 55" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 55C50 55 40 65 40 80H60C60 65 50 55 50 55Z" fill="#FBBF24" fillOpacity="0.3" />
  </svg>
)

// --- GENERIRANJE LAŽNIH PODATAKA ZA LEADERBOARD (Ovo će kasnije zamijeniti prava baza) ---
const generateMockDonors = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    rank: i + 1,
    username: i === 0 ? "CryptoKing_Pi" : i === 1 ? "PiWhale2030" : `Pioneer_${Math.floor(Math.random() * 9000) + 1000}`,
    wallet: `G${Math.random().toString(36).substring(2, 6).toUpperCase()}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    amount: i === 0 ? 5000 : i === 1 ? 2500 : Math.floor(1000 - i * 15)
  }));
};

export default function LegacyPiPage() {
  const [user, setUser] = useState<any>(null)
  const [impactData, setImpactData] = useState({
    totalLocked: 125847.32,
    donorsCount: 8432,
    message: "Together we create a legacy.",
  })
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 })
  const [slidePosition, setSlidePosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")
  const [copied, setCopied] = useState(false)
  
  // --- NOVO STANJE ZA LEADERBOARD ---
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [donorsList, setDonorsList] = useState<any[]>([])

  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Inicijaliziraj lažne podatke kad se komponenta učita
    setDonorsList(generateMockDonors())

    const initPi = async () => {
      try {
        if (window.Pi) {
          window.Pi.init({ version: "2.0", sandbox: true })
        }
      } catch (err) {
        console.error("Pi SDK Init Error:", err)
      }
    }
    const timer = setTimeout(initPi, 1000)
    return () => clearTimeout(timer)
  }, [])

  const connectWallet = async () => {
    if (!window.Pi) {
      alert("Molimo otvorite ovu aplikaciju unutar Pi Browsera.")
      return
    }
    try {
      const scopes = ['username', 'payments']
      const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound)
      setUser(authResult.user)
    } catch (err) {
      console.error("Authentication failed", err)
      alert("Povezivanje nije uspjelo.")
    }
  }

  const onIncompletePaymentFound = (payment: any) => {
    console.log("Nedovršeno plaćanje:", payment)
  };

  const handleDonation = async () => {
    if (!user) {
      await connectWallet()
      if (!user) {
        setSlidePosition(0)
        return 
      }
    }

    setPaymentStatus("processing")

    try {
      const paymentData = {
        amount: 1, 
        memo: "Donacija za Pi Legacy 2030", 
        metadata: { type: "donation_2030" }
      }

      const callbacks = {
        onReadyForServerApproval: (paymentId: string) => {
          alert("Plaćanje inicirano! (ID: " + paymentId + ").")
          completeUiSuccess()
        },
        onServerApproval: (paymentId: string) => { console.log("Server odobrio") },
        onCancel: (paymentId: string) => { 
          setPaymentStatus("idle")
          setSlidePosition(0)
        },
        onError: (error: any, payment: any) => {
          console.error("Greška", error)
          setPaymentStatus("error")
          setSlidePosition(0)
        },
      }
      await window.Pi.createPayment(paymentData, callbacks)
    } catch (err) {
      console.error(err)
      setSlidePosition(0)
      setPaymentStatus("idle")
    }
  }

  const completeUiSuccess = () => {
    setPaymentStatus("success")
    setTimeout(() => {
      setImpactData(prev => ({
        ...prev,
        totalLocked: prev.totalLocked + 1,
        donorsCount: prev.donorsCount + 1
      }))
    }, 500)
    setTimeout(() => {
      setPaymentStatus("idle")
      setSlidePosition(0)
    }, 4000)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(VAULT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Countdown
  useEffect(() => {
    const targetDate = new Date("2030-01-01T00:00:00").getTime()
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now
      if (distance < 0) { clearInterval(interval); return }
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Slider Logic
  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e: MouseEvent) => { if (sliderRef.current) moveSlider(e.clientX) }
    const handleMouseUp = () => endDrag()
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  const moveSlider = (clientX: number) => {
    if (!sliderRef.current) return
    const rect = sliderRef.current.getBoundingClientRect()
    const pos = Math.max(0, Math.min(clientX - rect.left, rect.width))
    const pct = (pos / rect.width) * 100
    setSlidePosition(pct)
    if (pct >= 95) {
      setIsDragging(false)
      handleDonation()
    }
  }
  
  const endDrag = () => {
    setIsDragging(false)
    if (slidePosition < 95) setSlidePosition(0)
  }
  const handleTouchStart = () => setIsDragging(true)
  const handleTouchMove = (e: React.TouchEvent) => { if (isDragging) moveSlider(e.touches[0].clientX) }

  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i, left: Math.random() * 100, delay: Math.random() * 10, duration: 15 + Math.random() * 10, size: 2 + Math.random() * 4,
  }))

  return (
    <div className="min-h-screen bg-[#1a0b2e] relative overflow-hidden text-white font-sans flex flex-col">
      
      {/* --- LEADERBOARD MODAL (OVERLAY) --- */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#2E0A36] w-full max-w-lg h-[80vh] rounded-2xl border border-yellow-500/30 flex flex-col shadow-2xl relative">
            
            {/* Header Modala */}
            <div className="p-6 border-b border-yellow-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Hall of Fame</h2>
              </div>
              <button 
                onClick={() => setShowLeaderboard(false)}
                className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Lista Donatora */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              <div className="flex justify-between px-4 pb-2 text-[10px] text-gray-500 uppercase tracking-widest">
                <span>Rank & User</span>
                <span>Amount Locked</span>
              </div>
              
              {donorsList.map((donor) => (
                <div 
                  key={donor.rank} 
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    donor.rank === 1 ? "bg-yellow-500/10 border-yellow-500/50" :
                    donor.rank === 2 ? "bg-gray-300/10 border-gray-300/50" :
                    donor.rank === 3 ? "bg-orange-700/10 border-orange-700/50" :
                    "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                      donor.rank === 1 ? "bg-yellow-500 text-black" :
                      donor.rank === 2 ? "bg-gray-300 text-black" :
                      donor.rank === 3 ? "bg-orange-700 text-white" :
                      "bg-white/10 text-gray-400"
                    }`}>
                      {donor.rank}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">{donor.username}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{donor.wallet}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-yellow-500">{donor.amount} Pi</div>
                  </div>
                </div>
              ))}
              
              <div className="text-center py-4 text-xs text-gray-500">
                Showing top 50 guardians (simulated)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- SUCCESS MESSAGE --- */}
      {paymentStatus === "success" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 fixed">
          <div className="text-center p-8 bg-[#2E0A36] border border-yellow-500 rounded-2xl shadow-[0_0_50px_rgba(234,179,8,0.3)] mx-4">
            <LegacyPiLogo className="w-20 h-20 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Thank You, Guardian!</h2>
            <p className="text-gray-300">Your Pi is locked until 2030.</p>
          </div>
        </div>
      )}

      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div key={p.id} className="absolute rounded-full bg-yellow-400/20 blur-[1px]"
            style={{ left: `${p.left}%`, width: `${p.size}px`, height: `${p.size}px`, bottom: "-20px", animation: `float ${p.duration}s infinite linear`, animationDelay: `${p.delay}s` }} />
        ))}
      </div>

      {/* --- MAIN UI --- */}
      <div className="relative z-10 flex flex-col flex-1 w-full max-w-md mx-auto">
        <header className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LegacyPiLogo className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">LegacyPi</h1>
                <p className="text-[10px] text-yellow-500/80 uppercase tracking-widest">Humanitarian Fund</p>
              </div>
            </div>
            
            <Button 
              onClick={connectWallet}
              variant="outline" 
              size="sm" 
              className={`text-xs border-yellow-500/30 rounded-full px-4 transition-all duration-300 ${user ? 'bg-yellow-500/20 text-yellow-400' : 'bg-transparent text-yellow-500 hover:bg-yellow-500/10'}`}
            >
              {user ? (
                <span className="flex items-center gap-2">
                  <Wallet className="w-3 h-3" />
                  {user.username}
                </span>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 w-full">
          <div className="w-full space-y-8">
            
            {/* HERO */}
            <div className="flex items-center justify-center py-4">
              <div className="relative group cursor-default">
                <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-2xl scale-110 animate-pulse" />
                <div className="relative w-64 h-64 rounded-full bg-gradient-to-b from-[#3a1c42] to-[#1a0b2e] border border-yellow-500/30 flex items-center justify-center shadow-2xl shadow-purple-900/50">
                  <div className="text-center z-10">
                    <Heart className="w-8 h-8 text-yellow-500 fill-yellow-500/20 animate-pulse mx-auto mb-3" />
                    <div className="text-4xl font-bold text-white mb-1 tabular-nums tracking-tighter">
                      {impactData.totalLocked.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-sm font-medium text-yellow-500 uppercase tracking-widest">Pi Locked</div>
                    <div className="text-xs text-gray-400 mt-2">Until 2030</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-lg text-gray-300">Potential for Help:</p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">
                Immense & Growing
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 bg-white/5 backdrop-blur-md border-white/10 text-center">
                <Users className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{impactData.donorsCount.toLocaleString()}</div>
                <div className="text-[10px] text-gray-400 uppercase">Guardians</div>
              </Card>
              <Card className="p-4 bg-white/5 backdrop-blur-md border-white/10 text-center">
                <Shield className="w-5 h-5 text-green-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">100%</div>
                <div className="text-[10px] text-gray-400 uppercase">Secure</div>
              </Card>
            </div>

            {/* --- LEADERBOARD GUMB --- */}
            <Button 
              onClick={() => setShowLeaderboard(true)}
              className="w-full bg-yellow-500/10 border border-yellow-500/50 hover:bg-yellow-500/20 text-yellow-500 h-12 rounded-xl flex items-center justify-between px-6 group"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Hall of Fame (Top 1000)</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
            </Button>

            {/* SLIDER */}
            <div className="space-y-4 pt-4 relative">
              <div
                ref={sliderRef}
                className="relative h-16 bg-black/40 rounded-full overflow-hidden border border-white/10 select-none touch-none cursor-pointer shadow-inner"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={endDrag}
                onMouseDown={() => setIsDragging(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-600/50 transition-all duration-75 ease-out" style={{ width: `${slidePosition}%` }} />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <span className={`text-sm font-semibold tracking-wider transition-opacity duration-300 ${slidePosition > 20 ? 'opacity-0' : 'text-gray-400'}`}>
                    {paymentStatus === "processing" ? "PROCESSING..." : "SLIDE TO DONATE (1 Pi)"}
                  </span>
                </div>

                <div
                  className="absolute top-1/2 -translate-y-1/2 h-14 w-14 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)] z-10 transition-transform duration-75 ease-out active:scale-95"
                  style={{ left: `${slidePosition}%`, transform: `translate(${slidePosition > 90 ? '-90%' : '-10%'}, -50%)` }}
                >
                  <ChevronRight className="w-8 h-8 text-black ml-1" />
                </div>
              </div>
            </div>
            
            {/* VAULT ADDRESS DISPLAY */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
               <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Vault Contract Address (Verify)</p>
               <div className="flex items-center justify-center gap-2 bg-black/30 p-2 rounded-lg border border-white/5">
                 <code className="text-[10px] text-yellow-500/70 font-mono truncate max-w-[200px]">
                   {VAULT_ADDRESS}
                 </code>
                 <button onClick={copyAddress} className="text-gray-400 hover:text-white transition-colors">
                   {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                 </button>
               </div>
            </div>

          </div>
        </main>

        <footer className="px-4 py-8 border-t border-white/5 bg-black/20 mt-auto">
          <div className="text-center space-y-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Unlock Date: Jan 1, 2030</p>
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
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}