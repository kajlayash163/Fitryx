'use client'

import { useState, useRef, useEffect } from 'react'
import { Calculator, Flame, Dumbbell, Droplets, Scale, Target, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

/* ──────────── Shared animated result wrapper ──────────── */
function ResultCard({ show, children }: { show: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (show && ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [show])
  if (!show) return null
  return (
    <div ref={ref} className="mt-6 p-5 rounded-2xl bg-secondary/30 border border-border/40 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {children}
    </div>
  )
}

/* ──────────── BMI ──────────── */
function BMICalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null)

  const calculate = () => {
    const w = parseFloat(weight), h = parseFloat(height) / 100
    if (!w || !h) return
    const bmi = w / (h * h)
    let category = '', color = ''
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-400' }
    else if (bmi < 25) { category = 'Normal weight'; color = 'text-green-400' }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-400' }
    else { category = 'Obese'; color = 'text-red-400' }
    setResult({ bmi: Math.round(bmi * 10) / 10, category, color })
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Weight (kg)</label>
          <Input value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="70" className="bg-secondary/50 border-border/60 h-11" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Height (cm)</label>
          <Input value={height} onChange={e => setHeight(e.target.value)} type="number" placeholder="175" className="bg-secondary/50 border-border/60 h-11" /></div>
      </div>
      <Button onClick={calculate} className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 rounded-xl">Calculate BMI</Button>
      <ResultCard show={!!result}>
        {result && (
          <>
            <p className="text-5xl font-bold text-foreground text-center">{result.bmi}</p>
            <p className={`text-sm font-medium mt-1 text-center ${result.color}`}>{result.category}</p>
            <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 mt-5 overflow-hidden">
              <div className="absolute top-0 h-full w-1 bg-white rounded-full shadow-lg transition-all duration-700" style={{ left: `${Math.min((result.bmi / 40) * 100, 98)}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span></div>
          </>
        )}
      </ResultCard>
    </>
  )
}

/* ──────────── Calorie ──────────── */
function CalorieCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [activity, setActivity] = useState('1.55')
  const [result, setResult] = useState<number | null>(null)

  const activityLevels = [
    { label: 'Sedentary', desc: 'Little or no exercise', value: '1.2' },
    { label: 'Light', desc: '1-3 days/week', value: '1.375' },
    { label: 'Moderate', desc: '3-5 days/week', value: '1.55' },
    { label: 'Active', desc: '6-7 days/week', value: '1.725' },
    { label: 'Intense', desc: '2x per day', value: '1.9' },
  ]

  const calculate = () => {
    const a = parseFloat(age), w = parseFloat(weight), h = parseFloat(height), act = parseFloat(activity)
    if (!a || !w || !h) return
    let bmr = 10 * w + 6.25 * h - 5 * a
    bmr = gender === 'male' ? bmr + 5 : bmr - 161
    setResult(Math.round(bmr * act))
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        {(['male', 'female'] as const).map(g => (
          <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${gender === g ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm' : 'bg-secondary/50 text-muted-foreground hover:bg-accent/50 border border-transparent'}`}>
            {g === 'male' ? '♂ Male' : '♀ Female'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Age</label><Input value={age} onChange={e => setAge(e.target.value)} type="number" placeholder="25" className="bg-secondary/50 border-border/60 h-11" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Weight (kg)</label><Input value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="70" className="bg-secondary/50 border-border/60 h-11" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Height (cm)</label><Input value={height} onChange={e => setHeight(e.target.value)} type="number" placeholder="175" className="bg-secondary/50 border-border/60 h-11" /></div>
      </div>
      <label className="text-xs font-medium text-muted-foreground mb-2 block">Activity Level</label>
      <div className="grid grid-cols-5 gap-2 mb-5">
        {activityLevels.map(a => (
          <button key={a.value} onClick={() => setActivity(a.value)} className={`p-2 rounded-xl text-center transition-all ${activity === a.value ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-secondary/40 text-muted-foreground hover:bg-accent/50 border border-transparent'}`}>
            <p className="text-xs font-semibold">{a.label}</p>
            <p className="text-[10px] opacity-70 mt-0.5">{a.desc}</p>
          </button>
        ))}
      </div>
      <Button onClick={calculate} className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 rounded-xl">Calculate Calories</Button>
      <ResultCard show={!!result}>
        {result && (
          <>
            <p className="text-5xl font-bold text-foreground text-center">{result.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground text-center mt-1">calories / day to maintain</p>
            <div className="grid grid-cols-3 gap-3 mt-5">
              <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-xl font-bold text-green-400">{(result - 500).toLocaleString()}</p>
                <p className="text-[10px] text-green-400/80 mt-0.5">Lose weight</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-center">
                <p className="text-xl font-bold text-primary">{result.toLocaleString()}</p>
                <p className="text-[10px] text-primary/80 mt-0.5">Maintain</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                <p className="text-xl font-bold text-blue-400">{(result + 500).toLocaleString()}</p>
                <p className="text-[10px] text-blue-400/80 mt-0.5">Gain muscle</p>
              </div>
            </div>
          </>
        )}
      </ResultCard>
    </>
  )
}

/* ──────────── One Rep Max ──────────── */
function OneRepMaxCalculator() {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    const w = parseFloat(weight), r = parseFloat(reps)
    if (!w || !r || r < 1) return
    setResult(r === 1 ? w : Math.round(w * (1 + r / 30)))
  }

  const zones = [
    { pct: 100, label: '1RM', reps: '1 rep', bg: 'bg-red-500/15', text: 'text-red-400' },
    { pct: 90, label: 'Strength', reps: '3-4', bg: 'bg-orange-500/15', text: 'text-orange-400' },
    { pct: 80, label: 'Hypertrophy', reps: '6-8', bg: 'bg-amber-500/15', text: 'text-amber-400' },
    { pct: 70, label: 'Endurance', reps: '10-12', bg: 'bg-green-500/15', text: 'text-green-400' },
    { pct: 60, label: 'Warmup', reps: '15+', bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  ]

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Weight Lifted (kg)</label>
          <Input value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="80" className="bg-secondary/50 border-border/60 h-11" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Reps Completed</label>
          <Input value={reps} onChange={e => setReps(e.target.value)} type="number" placeholder="5" className="bg-secondary/50 border-border/60 h-11" /></div>
      </div>
      <Button onClick={calculate} className="w-full h-11 bg-primary text-primary-foreground hover:opacity-90 rounded-xl">Calculate 1RM</Button>
      <ResultCard show={!!result}>
        {result && (
          <>
            <p className="text-5xl font-bold text-foreground text-center">{result} kg</p>
            <p className="text-sm text-muted-foreground text-center mt-1">Estimated one-rep max</p>
            <div className="mt-5 flex flex-col gap-2">
              {zones.map(z => (
                <div key={z.pct} className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${z.bg} transition-all hover:scale-[1.01]`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-10 ${z.text}`}>{z.pct}%</span>
                    <span className="text-sm text-foreground font-medium">{z.label}</span>
                    <span className="text-xs text-muted-foreground">({z.reps})</span>
                  </div>
                  <span className={`text-sm font-bold ${z.text}`}>{Math.round(result * z.pct / 100)} kg</span>
                </div>
              ))}
            </div>
          </>
        )}
      </ResultCard>
    </>
  )
}

/* ──────────── Ideal Weight ──────────── */
function IdealWeightCalculator() {
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [result, setResult] = useState<{ robinson: number; miller: number; hamwi: number } | null>(null)

  const calculate = () => {
    const h = parseFloat(height)
    if (!h) return
    const over5ft = Math.max(h / 2.54 - 60, 0)
    const [robinson, miller, hamwi] = gender === 'male'
      ? [52 + 1.9 * over5ft, 56.2 + 1.41 * over5ft, 48 + 2.7 * over5ft]
      : [49 + 1.7 * over5ft, 53.1 + 1.36 * over5ft, 45.5 + 2.2 * over5ft]
    setResult({ robinson: Math.round(robinson), miller: Math.round(miller), hamwi: Math.round(hamwi) })
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        {(['male', 'female'] as const).map(g => (
          <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${gender === g ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-secondary/50 text-muted-foreground hover:bg-accent/50 border border-transparent'}`}>
            {g === 'male' ? '♂ Male' : '♀ Female'}
          </button>
        ))}
      </div>
      <div className="mb-5"><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Height (cm)</label>
        <Input value={height} onChange={e => setHeight(e.target.value)} type="number" placeholder="175" className="bg-secondary/50 border-border/60 h-11" /></div>
      <Button onClick={calculate} className="w-full h-11 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl">Calculate</Button>
      <ResultCard show={!!result}>
        {result && (
          <div className="flex flex-col gap-3">
            {[
              { name: 'Robinson', value: result.robinson, color: 'emerald' },
              { name: 'Miller', value: result.miller, color: 'blue' },
              { name: 'Hamwi', value: result.hamwi, color: 'purple' },
            ].map(f => (
              <div key={f.name} className={`flex items-center justify-between p-3.5 rounded-xl bg-${f.color}-500/10 border border-${f.color}-500/20`}>
                <span className={`text-sm font-medium text-${f.color}-400`}>{f.name} Formula</span>
                <span className={`text-xl font-bold text-${f.color}-400`}>{f.value} kg</span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center mt-1">Average: <span className="text-foreground font-semibold">{Math.round((result.robinson + result.miller + result.hamwi) / 3)} kg</span></p>
          </div>
        )}
      </ResultCard>
    </>
  )
}

/* ──────────── Water Intake ──────────── */
function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('')
  const [activity, setActivity] = useState<'light' | 'moderate' | 'intense'>('moderate')
  const [result, setResult] = useState<{ liters: number; glasses: number } | null>(null)

  const calculate = () => {
    const w = parseFloat(weight)
    if (!w) return
    const mult = activity === 'light' ? 1 : activity === 'moderate' ? 1.2 : 1.5
    const liters = Math.round(w * 0.033 * mult * 10) / 10
    setResult({ liters, glasses: Math.round(liters / 0.25) })
  }

  return (
    <>
      <div className="mb-4"><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Weight (kg)</label>
        <Input value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="70" className="bg-secondary/50 border-border/60 h-11" /></div>
      <label className="text-xs font-medium text-muted-foreground mb-2 block">Activity Level</label>
      <div className="flex gap-2 mb-5">
        {(['light', 'moderate', 'intense'] as const).map(a => (
          <button key={a} onClick={() => setActivity(a)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${activity === a ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-secondary/50 text-muted-foreground hover:bg-accent/50 border border-transparent'}`}>
            {a}
          </button>
        ))}
      </div>
      <Button onClick={calculate} className="w-full h-11 bg-blue-500 text-white hover:bg-blue-600 rounded-xl">Calculate</Button>
      <ResultCard show={!!result}>
        {result && (
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <Droplets className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-4xl font-bold text-blue-400">{result.liters}L</p>
              <p className="text-xs text-muted-foreground mt-1">per day</p>
            </div>
            <div className="w-px h-16 bg-border/40" />
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{result.glasses}</p>
              <p className="text-xs text-muted-foreground mt-1">glasses (250ml)</p>
            </div>
          </div>
        )}
      </ResultCard>
    </>
  )
}

/* ──────────── Body Fat ──────────── */
function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [height, setHeight] = useState('')
  const [hip, setHip] = useState('')
  const [result, setResult] = useState<{ bf: number; category: string; color: string } | null>(null)

  const calculate = () => {
    const w = parseFloat(waist), n = parseFloat(neck), h = parseFloat(height), hp = parseFloat(hip)
    if (!w || !n || !h) return
    let bf: number
    if (gender === 'male') {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450
    } else {
      if (!hp) return
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450
    }
    bf = Math.round(bf * 10) / 10
    let category = '', color = ''
    const thresholds = gender === 'male' ? [6, 14, 18, 25] : [14, 21, 25, 32]
    const labels = ['Essential Fat', 'Athletic', 'Fitness', 'Average', 'Above Average']
    const colors = ['text-red-400', 'text-green-400', 'text-emerald-400', 'text-yellow-400', 'text-orange-400']
    const idx = thresholds.findIndex(t => bf < t)
    category = labels[idx === -1 ? 4 : idx]
    color = colors[idx === -1 ? 4 : idx]
    setResult({ bf, category, color })
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        {(['male', 'female'] as const).map(g => (
          <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${gender === g ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30' : 'bg-secondary/50 text-muted-foreground hover:bg-accent/50 border border-transparent'}`}>
            {g === 'male' ? '♂ Male' : '♀ Female'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Waist (cm)</label><Input value={waist} onChange={e => setWaist(e.target.value)} type="number" placeholder="80" className="bg-secondary/50 border-border/60 h-11" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Neck (cm)</label><Input value={neck} onChange={e => setNeck(e.target.value)} type="number" placeholder="38" className="bg-secondary/50 border-border/60 h-11" /></div>
        <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Height (cm)</label><Input value={height} onChange={e => setHeight(e.target.value)} type="number" placeholder="175" className="bg-secondary/50 border-border/60 h-11" /></div>
        {gender === 'female' && (
          <div><label className="text-xs font-medium text-muted-foreground mb-1.5 block">Hip (cm)</label><Input value={hip} onChange={e => setHip(e.target.value)} type="number" placeholder="95" className="bg-secondary/50 border-border/60 h-11" /></div>
        )}
      </div>
      <Button onClick={calculate} className="w-full h-11 bg-orange-500 text-white hover:bg-orange-600 rounded-xl">Calculate</Button>
      <ResultCard show={!!result}>
        {result && (
          <div className="text-center">
            <p className="text-5xl font-bold text-foreground">{result.bf}%</p>
            <p className={`text-sm font-medium mt-1 ${result.color}`}>{result.category}</p>
          </div>
        )}
      </ResultCard>
    </>
  )
}

/* ──────────── Tool Definitions ──────────── */
const TOOLS = [
  { id: 'bmi', label: 'BMI', icon: Calculator, color: 'text-primary', bg: 'bg-primary/10', Component: BMICalculator, desc: 'Body Mass Index' },
  { id: 'calories', label: 'Calories', icon: Flame, color: 'text-primary', bg: 'bg-primary/10', Component: CalorieCalculator, desc: 'Daily calorie needs' },
  { id: '1rm', label: '1RM', icon: Dumbbell, color: 'text-primary', bg: 'bg-primary/10', Component: OneRepMaxCalculator, desc: 'Max lift estimate' },
  { id: 'ideal', label: 'Ideal Weight', icon: Scale, color: 'text-emerald-400', bg: 'bg-emerald-500/10', Component: IdealWeightCalculator, desc: 'Target weight range' },
  { id: 'water', label: 'Water', icon: Droplets, color: 'text-blue-400', bg: 'bg-blue-500/10', Component: WaterIntakeCalculator, desc: 'Daily hydration' },
  { id: 'bodyfat', label: 'Body Fat', icon: Target, color: 'text-orange-400', bg: 'bg-orange-500/10', Component: BodyFatCalculator, desc: 'US Navy method' },
]

/* ──────────── Main Page ──────────── */
export default function ToolsPage() {
  const [active, setActive] = useState('bmi')
  const tool = TOOLS.find(t => t.id === active)!
  const { Component } = tool

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 mb-3 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>Free Tools</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>Fitness Calculators</h1>
          <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>Science-backed calculators to optimize your training, nutrition, and recovery. No sign-up required.</p>
        </div>

        {/* Tool Selector — horizontal pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          {TOOLS.map(t => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                active === t.id
                  ? `${t.bg} ${t.color} border border-current/20 shadow-sm`
                  : 'bg-secondary/40 text-muted-foreground hover:bg-accent/50 border border-transparent'
              }`}
            >
              <t.icon className="w-4 h-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Active Calculator */}
        <div className="card-surface rounded-2xl p-8 animate-fade-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-12 h-12 rounded-2xl ${tool.bg} flex items-center justify-center`}>
              <tool.icon className={`w-6 h-6 ${tool.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{tool.label} Calculator</h2>
              <p className="text-xs text-muted-foreground">{tool.desc}</p>
            </div>
          </div>
          <Component key={active} />
        </div>

        {/* Quick links */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOOLS.filter(t => t.id !== active).map(t => (
            <button
              key={t.id}
              onClick={() => { setActive(t.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="card-surface rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all group text-left"
            >
              <div className={`w-9 h-9 rounded-xl ${t.bg} flex items-center justify-center shrink-0`}>
                <t.icon className={`w-4 h-4 ${t.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
