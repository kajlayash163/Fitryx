'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Trash2, ShieldCheck, UserCog, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type User = {
  id: number
  name: string
  email: string
  role: 'user' | 'admin'
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)
  const [updatingRole, setUpdatingRole] = useState<number | null>(null)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (res.status === 403) {
        toast.error('Admin access required')
        return
      }
      const data = await res.json()
      setUsers(data.users ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleDelete = async (id: number) => {
    setDeleting(id)
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        toast.success('User deleted')
        setUsers(prev => prev.filter(u => u.id !== id))
      } else {
        toast.error(data.error ?? 'Failed to delete')
      }
    } finally {
      setDeleting(null)
    }
  }

  const handleRoleToggle = async (user: User) => {
    setUpdatingRole(user.id)
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Role updated to ${newRole}`)
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u))
      } else {
        toast.error(data.error ?? 'Failed to update role')
      }
    } finally {
      setUpdatingRole(null)
    }
  }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const admins = filtered.filter(u => u.role === 'admin').length
  const regularUsers = filtered.filter(u => u.role === 'user').length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{users.length} registered users</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {admins} admin{admins !== 1 ? 's' : ''}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-muted/30 text-muted-foreground border border-border/40">
            {regularUsers} user{regularUsers !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-9 bg-secondary/50 border-border/60"
        />
      </div>

      {/* Table */}
      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-muted/20">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded bg-muted/30 animate-pulse w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="w-8 h-8 opacity-30" />
                      <p className="text-sm">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                          {user.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-5 py-4">
                      {user.role === 'admin' ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20 gap-1">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground border-border/60 gap-1">
                          <UserCog className="w-3 h-3" /> User
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRoleToggle(user)}
                          disabled={updatingRole === user.id}
                          className={`h-8 px-2 text-xs gap-1.5 ${user.role === 'admin' ? 'text-muted-foreground hover:text-foreground hover:bg-accent/50' : 'text-primary hover:bg-primary/10'}`}
                          title={user.role === 'admin' ? 'Remove admin role' : 'Make admin'}
                        >
                          {updatingRole === user.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            : <ShieldCheck className="w-3.5 h-3.5" />}
                          {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(user.id)}
                          disabled={deleting === user.id}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Delete user"
                        >
                          {deleting === user.id
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
    </div>
  )
}
