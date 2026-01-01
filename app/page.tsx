"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Users, Shield, TrendingUp, ChevronRight, Wallet, Copy, Check, Trophy, X, Lightbulb, ThumbsUp, Medal, Star, History, Lock, Map } from "lucide-react"

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

// --- DEFINICIJA BEDŽEVA ---
const BADGE_TIERS = [
  { id: 1, name: "Bronze Guardian", threshold: 1, color: "text-orange-400", bg: "bg-orange-400/20", border: "border-orange-400/50" },
  { id: 2, name: "Silver Keeper", threshold: 100, color: "text-gray-300", bg: "bg-gray-300/20", border: "border-gray-300/50" },
  { id: 3, name: "Gold Visionary", threshold: 1000, color: "text-yellow-400", bg: "bg-yellow-400/20", border: "border-yellow-400/50" },
  { id: 4, name: "Diamond Legacy", threshold: 10000, color: "text-cyan-400", bg: "bg-cyan-400/20", border: "border-cyan-400/50" }
];

// --- DEFINICIJA ROADMAP-a ---
const ROADMAP_STEPS = [
  { year: "2025", title: "Genesis Launch", description: "LegacyPi App launch. Initial community pledges begin. Smart Contract Deployment.", status: "current" },
  { year: "2026", title: "First Transparency Audit", description: "Public review of the Vault holdings and blockchain verification report.", status: "upcoming" },
  { year: "2028", title: "Governance Test Vote", description: "Trial run of the DAO voting system to prepare for the final consensus.", status: "upcoming" },
  { year: "2029", title: "Final Lock-in Phase", description: "Vault sealed for final accumulation. No new large withdrawals logic updates.", status: "upcoming" },
  { year: "2030", title: "THE UNLOCK", description: "Consensus Day (Jan 1). Funds released to voted causes and liquidity pools.", status: "locked" }
];

// --- GENERIRANJE LAŽNIH PODATAKA ZA LEADERBOARD ---
const generateMockDonors = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    rank: i + 1,
    username: i === 0 ? "CryptoKing_Pi" : i === 1 ? "PiWhale2030" : `Pioneer_${Math.floor(Math.random() * 9000) + 1000}`,
    wallet: `G${Math.random().toString(36).substring(2, 6).toUpperCase()}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
    amount: i === 0 ? 5000 : i === 1 ? 2500 : Math.floor(1000 - i * 15)
  }));
};

// --- GENERIRANJE LAŽNIH PRIJEDLOGA ZAJEDNICE (PROPOSALS) ---
const generateMockProposals = () => [
  {
    id: 1,
    title: "Global Pi Education Fund",
    recipient: "Verified NGOs (Education)",
    amount: "20% of Vault",
    description: "Building schools in developing regions accepting Pi for tuition.",
    votes: 1245,
    category: "Education"
  },
  {
    id: 2,
    title: "Pi Network Liquidity Pool",
    recipient: "Pi DEX (Automated)",
    amount: "40% of Vault",
    description: "Providing massive liquidity to stabilize Pi value on open markets in 2030.",
    votes: 3892,
    category: "Finance"
  },
  {
    id: 3,
    title: "Clean Water Initiative",
    recipient: "Water.org Partnership",
    amount: "10% of Vault",
    description: "Funding water infrastructure projects. Payment milestones tracked on-chain.",
    votes: 856,
    category: "Humanitarian"
  },
  {
    id: 4,
    title: "Pioneer Startup Grants",
    recipient: "Selected Pi Apps",
    amount: "30% of Vault",
    description: "Seed funding for the most innovative Pi apps built between 2025-2030.",
    votes: 2100,
    category: "Development"
  }
];

export default function LegacyPiPage() {
  const [user, setUser] = useState<any>(null)
  const [userStats, setUserStats] = useState({ totalDonated: 0, donations: [] as any[] }) // Novo stanje za statistiku korisnika
  
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
  
  // --- STANJA ZA MODALE ---
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showProposals, setShowProposals] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showRoadmap, setShowRoadmap] = useState(false) // Novo stanje za Roadmap
  
  const [donorsList, setDonorsList] = useState<any[]>([])
  const [proposalsList, setProposalsList] = useState<any[]>([])

  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    console.log("LegacyPi v1.6 loaded"); // Debug poruka
    setDonorsList(generateMockDonors())
    setProposalsList(generateMockProposals())

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
      
      // Simulacija dohvaćanja podataka o korisniku nakon spajanja
      // U stvarnosti ovo dolazi s backenda
      setUserStats({
        totalDonated: 125, // Simuliramo da je korisnik već donirao nešto
        donations: [
          { date: "2024-12-20", amount: 100, tx: "G...7A" },
          { date: "2024-11-15", amount: 25, tx: "G...9B" }
        ]
      })

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
      // Ažuriraj globalnu statistiku
      setImpactData(prev => ({
        ...prev,
        totalLocked: prev.totalLocked + 1,
        donorsCount: prev.donorsCount + 1
      }))
      // Ažuriraj osobnu statistiku
      setUserStats(prev => ({
        totalDonated: prev.totalDonated + 1,
        donations: [{ date: new Date().toISOString().split('T')[0], amount: 1, tx: "PENDING" }, ...prev.donations]
      }))
    }, 500)
    setTimeout(() => {
      setPaymentStatus("idle")
      setSlidePosition(0)
    }, 4000)
  }

  const handleVote = (id: number) => {
    setProposalsList(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, votes: p.votes + 1 }
      }
      return p
    }))
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
      
      {/* --- LEADERBOARD MODAL --- */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#2E0A36] w-full max-w-lg h-[80vh] rounded-2xl border border-yellow-500/30 flex flex-col shadow-2xl relative">
            <div className="p-6 border-b border-yellow-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Hall of Fame</h2>
              </div>
              <button onClick={() => setShowLeaderboard(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              <div className="flex justify-between px-4 pb-2 text-[10px] text-gray-500 uppercase tracking-widest">
                <span>Rank & User</span>
                <span>Amount Locked</span>
              </div>
              {donorsList.map((donor) => (
                <div key={donor.rank} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${donor.rank === 1 ? "bg-yellow-500/10 border-yellow-500/50" : donor.rank === 2 ? "bg-gray-300/10 border-gray-300/50" : donor.rank === 3 ? "bg-orange-700/10 border-orange-700/50" : "bg-white/5 border-white/5 hover:bg-white/10"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${donor.rank === 1 ? "bg-yellow-500 text-black" : donor.rank === 2 ? "bg-gray-300 text-black" : donor.rank === 3 ? "bg-orange-700 text-white" : "bg-white/10 text-gray-400"}`}>{donor.rank}</div>
                    <div>
                      <div className="font-semibold text-sm text-white">{donor.username}</div>
                      <div className="text-[10px] text-gray-500 font-mono">{donor.wallet}</div>
                    </div>
                  </div>
                  <div className="text-right"><div className="font-bold text-yellow-500">{donor.amount} Pi</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- PROPOSALS MODAL --- */}
      {showProposals && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#2E0A36] w-full max-w-lg h-[80vh] rounded-2xl border border-yellow-500/30 flex flex-col shadow-2xl relative">
            <div className="p-6 border-b border-yellow-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Community Visions</h2>
              </div>
              <button onClick={() => setShowProposals(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-4 bg-yellow-500/5 text-xs text-center text-yellow-500/80 border-b border-yellow-500/10">Proposals for 2030 Fund Distribution.<br/>Vote for where the Pi should go.</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {proposalsList.map((proposal) => (
                <div key={proposal.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-yellow-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 rounded-md bg-white/10 text-[10px] text-gray-400 uppercase tracking-wider">{proposal.category}</span>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                      <ThumbsUp className="w-3 h-3" />
                      {proposal.votes.toLocaleString()}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{proposal.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">{proposal.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="bg-black/30 p-2 rounded-lg">
                      <div className="text-gray-500">Recipient:</div>
                      <div className="text-white font-medium">{proposal.recipient}</div>
                    </div>
                    <div className="bg-black/30 p-2 rounded-lg">
                      <div className="text-gray-500">Requested:</div>
                      <div className="text-white font-medium">{proposal.amount}</div>
                    </div>
                  </div>
                  <Button onClick={() => handleVote(proposal.id)} className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/50">Vote for this Proposal</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- ROADMAP MODAL (NOVO) --- */}
      {showRoadmap && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#2E0A36] w-full max-w-lg h-[80vh] rounded-2xl border border-yellow-500/30 flex flex-col shadow-2xl relative">
            <div className="p-6 border-b border-yellow-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Map className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-white">Timeline 2030</h2>
              </div>
              <button onClick={() => setShowRoadmap(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {ROADMAP_STEPS.map((step, index) => (
                <div key={index} className="flex gap-4 relative">
                  {/* Timeline Line */}
                  {index !== ROADMAP_STEPS.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-[-32px] w-[2px] bg-white/10"></div>
                  )}
                  
                  {/* Status Indicator */}
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 z-10 ${
                    step.status === "current" ? "bg-yellow-500 border-yellow-500 animate-pulse text-black font-bold" :
                    step.status === "locked" ? "bg-red-500/10 border-red-500/50 text-red-500" :
                    "bg-white/5 border-white/20 text-gray-500"
                  }`}>
                    {step.status === "locked" ? <Lock className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current"></div>}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pt-1 ${step.status === "current" ? "opacity-100" : "opacity-70"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                        step.status === "current" ? "bg-yellow-500 text-black" : "bg-white/10 text-gray-400"
                      }`}>
                        {step.year}
                      </span>
                      {step.status === "current" && <span className="text-[10px] text-yellow-500 uppercase tracking-widest animate-pulse">In Progress</span>}
                    </div>
                    <h3 className={`text-lg font-bold ${step.status === "current" ? "text-white" : "text-gray-300"}`}>{step.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-8 pb-4">
                <p className="text-xs text-gray-500 italic">"Patience is the key to building a legacy."</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- USER PROFILE & BADGES MODAL --- */}
      {showProfile && user && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-[#2E0A36] w-full max-w-lg h-[85vh] rounded-2xl border border-yellow-500/30 flex flex-col shadow-2xl relative">
            {/* Profile Header */}
            <div className="p-6 border-b border-yellow-500/20 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center border border-yellow-500/50">
                  <Users className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">My Legacy</h2>
                  <p className="text-xs text-gray-400">@{user.username}</p>
                </div>
              </div>
              <button onClick={() => setShowProfile(false)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              
              {/* Total Donated Card */}
              <div className="bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-xl p-6 text-center border border-yellow-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                <p className="text-sm text-gray-300 uppercase tracking-widest mb-1 relative z-10">Total Locked</p>
                <div className="text-4xl font-bold text-white relative z-10">{userStats.totalDonated} Pi</div>
                <p className="text-xs text-yellow-500/80 mt-2 relative z-10">Thank you for your trust.</p>
              </div>

              {/* Badges Section */}
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Medal className="w-4 h-4" /> Earned Badges
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {BADGE_TIERS.map((badge) => {
                    const isUnlocked = userStats.totalDonated >= badge.threshold;
                    return (
                      <div 
                        key={badge.id}
                        className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                          isUnlocked 
                            ? `${badge.bg} ${badge.border}` 
                            : "bg-black/20 border-white/5 opacity-50 grayscale"
                        }`}
                      >
                        <div className={`mb-2 ${isUnlocked ? badge.color : "text-gray-500"}`}>
                          {isUnlocked ? <Star className="w-6 h-6 fill-current" /> : <Lock className="w-6 h-6" />}
                        </div>
                        <div className={`font-bold text-sm ${isUnlocked ? "text-white" : "text-gray-500"}`}>{badge.name}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{badge.threshold}+ Pi</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Donation History */}
              <div>
                <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <History className="w-4 h-4" /> Pledge History
                </h3>
                <div className="space-y-2">
                  {userStats.donations.length > 0 ? userStats.donations.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                           <Check className="w-4 h-4 text-green-500" />
                         </div>
                         <div>
                           <div className="text-sm font-medium text-white">Donation</div>
                           <div className="text-[10px] text-gray-500">{tx.date}</div>
                         </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-white">{tx.amount} Pi</div>
                        <div className="text-[10px] text-gray-600 font-mono">TX: {tx.tx}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-gray-500 text-sm italic">No donations yet. Be the first!</div>
                  )}
                </div>
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
              onClick={() => user ? setShowProfile(true) : connectWallet()}
              variant="outline" 
              size="sm" 
              className={`text-xs border-yellow-500/30 rounded-full px-4 transition-all duration-300 ${user ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/60' : 'bg-transparent text-yellow-500 hover:bg-yellow-500/10'}`}
            >
              {user ? (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  @{user.username}
                </span>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 w-full">
          <div className="w-full space-y-6">
            
            {/* HERO */}
            <div className="flex items-center justify-center py-2">
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

            {/* --- ACTION BUTTONS --- */}
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => setShowLeaderboard(true)}
                  className="bg-yellow-500/5 border border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-500 h-12 rounded-xl flex items-center justify-center gap-2 group"
                >
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold text-xs">Hall of Fame</span>
                </Button>

                <Button 
                  onClick={() => setShowRoadmap(true)}
                  className="bg-blue-500/5 border border-blue-500/30 hover:bg-blue-500/10 text-blue-400 h-12 rounded-xl flex items-center justify-center gap-2 group"
                >
                  <Map className="w-5 h-5" />
                  <span className="font-semibold text-xs">Timeline 2030</span>
                </Button>
              </div>

              <Button 
                onClick={() => setShowProposals(true)}
                className="w-full bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 h-12 rounded-xl flex items-center justify-between px-6 group"
              >
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-semibold">Community Visions (Vote)</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* SLIDER */}
            <div className="space-y-4 pt-2 relative">
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
                  style={{ left: `${slidePosition}%`, transform: `translate(-${slidePosition}%, -50%)` }}
                >
                  <ChevronRight className="w-8 h-8 text-black ml-1" />
                </div>
              </div>
            </div>
            
            {/* VAULT ADDRESS DISPLAY */}
            <div className="mt-4 pt-6 border-t border-white/5 text-center">
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
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Unlock Date: Jan 1, 2030 • v1.6</p>
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
                <div className="text-[9px] text-gray-500 uppercase mt-1">Minutes</div>
              </div>
            </div>
            
            {/* --- LEGAL LINKS --- */}
            <div className="mt-8 flex items-center justify-center gap-6 text-[10px] text-gray-500 uppercase tracking-widest pt-4 border-t border-white/5">
              <a href="/terms-of-service" className="hover:text-yellow-500 transition-colors">Terms of Service</a>
              <a href="/privacy-policy" className="hover:text-yellow-500 transition-colors">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}