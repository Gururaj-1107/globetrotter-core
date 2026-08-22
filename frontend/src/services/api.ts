import { CITIES, ACTIVITIES, COMMUNITY_POSTS, ADMIN_STATS, City, Activity, CommunityPost, AdminStats } from './mockData'

const API_BASE_URL = 'http://localhost:3001/api'

// Helper function to safely fetch with a fallback to mock data
async function safeFetch<T>(url: string, fallbackData: T, options?: RequestInit): Promise<T> {
  try {
    const token = localStorage.getItem('globetrotter_token')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }

    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 2000)
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options?.headers || {})
      },
      signal: controller.signal
    })
    clearTimeout(id)

    if (response.ok) {
      return await response.json() as T
    }
  } catch (error) {
    console.warn(`API call to ${url} failed or timed out. Using fallback data layer.`, error)
  }
  return fallbackData
}

export const api = {
  // ── AUTH APIS ──────────────────────────────────────────
  auth: {
    async checkProvider(email: string) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/check-provider`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })
        if (res.ok) return await res.json()
      } catch (e) {
        console.warn('Backend offline, using local provider check')
      }
      // Local fallback check
      const normalized = email.trim().toLowerCase()
      if (normalized === 'rahul@gmail.com') {
        return {
          exists: true,
          provider: 'GOOGLE',
          hasPassword: false,
          message: 'This account was created using Google Sign-In.',
          actionRequired: 'CONTINUE_WITH_GOOGLE'
        }
      }
      return { exists: true, provider: 'EMAIL_PASSWORD', hasPassword: true, actionRequired: 'ENTER_PASSWORD' }
    },

    async login(email: string, password: string) {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      return data
    },

    async register(userData: any) {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      return data
    },

    async googleAuth(googleData: { email: string; firstName?: string; lastName?: string; avatarUrl?: string; googleId?: string }) {
      const res = await fetch(`${API_BASE_URL}/auth/google-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Google Authentication failed')
      return data
    },

    async linkPassword(password: string, confirmPassword: string) {
      const token = localStorage.getItem('globetrotter_token')
      const res = await fetch(`${API_BASE_URL}/auth/link-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password, confirmPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Linking password failed')
      return data
    },

    async getMe() {
      const token = localStorage.getItem('globetrotter_token')
      if (!token) return null
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) return await res.json()
      return null
    },

    async updateProfile(profileData: any) {
      const token = localStorage.getItem('globetrotter_token')
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Profile update failed')
      return data
    }
  },

  // ── TRIPS APIS ─────────────────────────────────────────
  trips: {
    async getAll(status?: string, search?: string) {
      let url = `${API_BASE_URL}/trips`
      const params = new URLSearchParams()
      if (status && status !== 'ALL') params.append('status', status)
      if (search) params.append('search', search)
      if (params.toString()) url += `?${params.toString()}`

      return safeFetch(url, [])
    },

    async getById(id: string) {
      return safeFetch(`${API_BASE_URL}/trips/${id}`, null)
    },

    async create(tripData: any) {
      const res = await fetch(`${API_BASE_URL}/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      })
      return await res.json()
    },

    async updateSections(id: string, sections: any[], budget?: number) {
      const res = await fetch(`${API_BASE_URL}/trips/${id}/sections`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections, budget })
      })
      return await res.json()
    },

    async delete(id: string) {
      const res = await fetch(`${API_BASE_URL}/trips/${id}`, { method: 'DELETE' })
      return await res.json()
    }
  },

  // ── CITIES APIS ────────────────────────────────────────
  async getCities(search?: string, region?: string): Promise<City[]> {
    let url = `${API_BASE_URL}/cities`
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (region && region !== 'All') params.append('region', region)
    if (params.toString()) url += `?${params.toString()}`

    const fallback = CITIES.filter(c => {
      const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.country.toLowerCase().includes(search.toLowerCase())
      const matchRegion = !region || region === 'All' || c.region === region
      return matchSearch && matchRegion
    })

    return safeFetch<City[]>(url, fallback)
  },

  async getCity(id: string): Promise<City & { activities: Activity[] }> {
    const url = `${API_BASE_URL}/cities/${id}`
    const city = CITIES.find(c => c.id === id) || CITIES[0]
    const relatedActivities = ACTIVITIES.filter(a => a.cityId === id)
    const fallback = { ...city, activities: relatedActivities }

    return safeFetch<City & { activities: Activity[] }>(url, fallback)
  },

  // ── ACTIVITIES APIS ────────────────────────────────────
  async getActivities(category?: string[], maxPrice?: number, cityId?: string): Promise<Activity[]> {
    let url = `${API_BASE_URL}/activities`
    const params = new URLSearchParams()
    if (category && category.length > 0) params.append('category', category.join(','))
    if (maxPrice) params.append('maxPrice', maxPrice.toString())
    if (cityId) params.append('cityId', cityId)
    if (params.toString()) url += `?${params.toString()}`

    const fallback = ACTIVITIES.filter(act => {
      const matchesCat = !category || category.length === 0 || category.includes(act.category)
      const matchesPrice = !maxPrice || act.cost <= maxPrice
      const matchesCity = !cityId || act.cityId === cityId
      return matchesCat && matchesPrice && matchesCity
    })

    return safeFetch<Activity[]>(url, fallback)
  },

  // ── COMMUNITY APIS ─────────────────────────────────────
  async getCommunityPosts(): Promise<CommunityPost[]> {
    const url = `${API_BASE_URL}/community`
    return safeFetch<CommunityPost[]>(url, COMMUNITY_POSTS)
  },

  async likeCommunityPost(id: string): Promise<{ success: boolean; likes: number }> {
    const url = `${API_BASE_URL}/community/${id}/like`
    const post = COMMUNITY_POSTS.find(p => p.id === id)
    const fallback = { success: true, likes: post ? post.likes + 1 : 0 }

    return safeFetch<{ success: boolean; likes: number }>(url, fallback, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
  },

  async copyCommunityPost(id: string): Promise<{ success: boolean; copies: number }> {
    const url = `${API_BASE_URL}/community/${id}/copy`
    const post = COMMUNITY_POSTS.find(p => p.id === id)
    const fallback = { success: true, copies: post ? post.copies + 1 : 0 }

    return safeFetch<{ success: boolean; copies: number }>(url, fallback, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
  },

  // ── ADMIN METRICS ──────────────────────────────────────
  async getAdminMetrics(timeRange: '7days' | '30days' | '1year' = '30days'): Promise<AdminStats> {
    const url = `${API_BASE_URL}/admin/metrics?timeRange=${timeRange}`
    return safeFetch<AdminStats>(url, ADMIN_STATS)
  }
}
