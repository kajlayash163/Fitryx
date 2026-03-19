'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Search, ShieldCheck, ShieldOff, Pencil, Trash2,
  X, Check, Loader2, Dumbbell, MapPin, DollarSign, ListChecks
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type Gym = {
  id: number
  name: string
  location: string
  description: string
  price_monthly: number
  price_quarterly: number
  price_yearly: number
  facilities: string[]
  rating: number
  review_count: number
  verified: boolean
  created_at: string
}

const ALL_FACILITIES = [
  'Pool', 'Sauna', 'Parking', 'Lockers', 'Yoga', 'Cardio',
  'CrossFit', 'Personal Training', 'Boxing', 'Cycling',
]

const EMPTY_FORM = {
  name: '', location: '', description: '',
  price_monthly: '', price_quarterly: '', price_yearly: '',
  facilities: [] as string[],
}

function GymModal({
  gym, onClose, onSave,
}: {
  gym: Partial<Gym> | null
  onClose: () => void
  onSave: (data: typeof EMPTY_FORM) => Promise<void>
}) {
  const [form, setForm] = useState({
    name: gym?.name ?? '',
    location: gym?.location ?? '',
    description: gym?.description ?? '',
    price_monthly: String(gym?.price_monthly ?? ''),
    price_quarterly: String(gym?.price_quarterly ?? ''),
    price_yearly: String(gym?.price_yearly ?? ''),
    facilities: gym?.facilities ?? [] as string[],
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  const toggleFacility = (f: string) => {
    setForm(prev => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter(x => x !== f)
        : [...prev.facilities, f],
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="card-surface rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/40">
          <h2 className="text-lg font-semibold text-foreground">
            {gym?.id ? 'Edit Gym' : 'Add New Gym'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Dumbbell className="w-3.5 h-3.5 text-muted-foreground" /> Gym Name
            </label>
            <Input
              required
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Apex Performance Center"
              className="bg-secondary/50 border-border/60"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> Location
            </label>
            <Input
              required
              value={form.location}
              onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              placeholder="e.g. Downtown, New York"
              className="bg-secondary/50 border-border/60"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Describe the gym..."
              rows={3}
              className="w-full rounded-lg bg-secondary/50 border border-border/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary/50"
            />
          </div>

          {/* Pricing */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-muted-foreground" /> Pricing (₹ INR)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['price_monthly', 'price_quarterly', 'price_yearly'] as const).map(key => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground capitalize">{key.replace('price_', '')}</span>
                  <Input
                    type="number"
                    min="0"
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder="0"
                    className="bg-secondary/50 border-border/60"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <ListChecks className="w-3.5 h-3.5 text-muted-foreground" /> Facilities
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_FACILITIES.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFacility(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.facilities.includes(f)
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'bg-accent/40 text-muted-foreground border-border/40 hover:border-primary/20 hover:text-foreground'
                  }`}
                >
                  {form.facilities.includes(f) && <Check className="inline w-3 h-3 mr-1" />}
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 border border-border/60">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 bg-primary text-primary-foreground hover:opacity-90">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (gym?.id ? 'Save Changes' : 'Add Gym')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminGymsPage() {
  const [gyms, setGyms] = useState<Gym[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<{ open: boolean; gym: Partial<Gym> | null }>({ open: false, gym: null })
  const [deleting, setDeleting] = useState<number | null>(null)
  const [toggling, setToggling] = useState<number | null>(null)

  const fetchGyms = useCallback(async () => {
    setLoading(true)
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : ''
      const res = await fetch(`/api/gyms${params}`)
      const data = await res.json()
      setGyms(data.gyms ?? [])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    const t = setTimeout(fetchGyms, 300)
    return () => clearTimeout(t)
  }, [fetchGyms])

  const handleSave = async (form: typeof EMPTY_FORM) => {
    const body = {
      ...form,
      price_monthly: Number(form.price_monthly),
      price_quarterly: Number(form.price_quarterly),
      price_yearly: Number(form.price_yearly),
    }
    const isEdit = !!modal.gym?.id
    const url = isEdit ? `/api/gyms/${modal.gym!.id}` : '/api/gyms'
    const method = isEdit ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      toast.success(isEdit ? 'Gym updated' : 'Gym added')
      setModal({ open: false, gym: null })
      fetchGyms()
    } else {
      const d = await res.json()
      toast.error(d.error ?? 'Failed to save')
    }
  }

  const handleDelete = async (id: number) => {
    setDeleting(id)
    try {
      const res = await fetch(`/api/gyms/${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Gym deleted')
        setGyms(prev => prev.filter(g => g.id !== id))
      } else {
        toast.error('Failed to delete')
      }
    } finally {
      setDeleting(null)
    }
  }

  const handleVerify = async (id: number) => {
    setToggling(id)
    try {
      const res = await fetch(`/api/gyms/${id}/verify`, { method: 'PATCH' })
      if (res.ok) {
        const { gym } = await res.json()
        setGyms(prev => prev.map(g => g.id === id ? { ...g, verified: gym.verified } : g))
        toast.success(gym.verified ? 'Gym verified' : 'Verification removed')
      } else {
        toast.error('Failed to update')
      }
    } finally {
      setToggling(null)
    }
  }

  const filtered = gyms.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gym Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{gyms.length} gyms on the platform</p>
        </div>
        <Button
          onClick={() => setModal({ open: true, gym: null })}
          className="bg-primary text-primary-foreground hover:opacity-90 gap-2"
        >
          <Plus className="w-4 h-4" /> Add Gym
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search gyms..."
          className="pl-9 bg-secondary/50 border-border/60"
        />
      </div>

      {/* Table */}
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gym</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monthly</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rating</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded bg-muted/30 animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Dumbbell className="w-8 h-8 opacity-30" />
                      <p className="text-sm">No gyms found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(gym => (
                  <tr key={gym.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground text-sm">{gym.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{gym.review_count} reviews</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> {gym.location}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-primary">
                      ₹{gym.price_monthly}
                    </td>
                    <td className="px-5 py-4 text-sm text-foreground">
                      {Number(gym.rating).toFixed(1)}
                    </td>
                    <td className="px-5 py-4">
                      {gym.verified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-400 border-amber-400/30 bg-amber-400/5 gap-1">
                          <ShieldOff className="w-3 h-3" /> Pending
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleVerify(gym.id)}
                          disabled={toggling === gym.id}
                          className={`h-8 w-8 p-0 ${gym.verified ? 'text-amber-400 hover:bg-amber-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
                          title={gym.verified ? 'Remove verification' : 'Verify gym'}
                        >
                          {toggling === gym.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : gym.verified ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setModal({ open: true, gym })}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(gym.id)}
                          disabled={deleting === gym.id}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          {deleting === gym.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <Trash2 className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <GymModal
          gym={modal.gym}
          onClose={() => setModal({ open: false, gym: null })}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
