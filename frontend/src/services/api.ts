import { CITIES, ACTIVITIES, COMMUNITY_POSTS, ADMIN_STATS, City, Activity, CommunityPost, AdminStats } from './mockData'

const API_BASE_URL = 'http://localhost:3001/api'

// Helper function to safely fetch with a fallback to mock data
async function safeFetch<T>(url: string, fallbackData: T, options?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), 1500) // 1.5s timeout for fast fallback
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(id)

    if (response.ok) {
      return await response.json() as T
    }
  } catch (error) {
    // Silent fallback to mock data when backend is down
    console.warn(`API call to ${url} failed. Falling back to local mock data layer.`, error)
  }
  return fallbackData
}

export const api = {
  // Cities
  async getCities(search?: string, region?: string): Promise<City[]> {
    let url = `${API_BASE_URL}/cities`
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (region && region !== 'All') params.append('region', region)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }

    // Prepare client-side fallback logic
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

  // Activities
  async getActivities(category?: string[], maxPrice?: number, cityId?: string): Promise<Activity[]> {
    let url = `${API_BASE_URL}/activities`
    const params = new URLSearchParams()
    if (category && category.length > 0) params.append('category', category.join(','))
    if (maxPrice) params.append('maxPrice', maxPrice.toString())
    if (cityId) params.append('cityId', cityId)

    if (params.toString()) {
      url += `?${params.toString()}`
    }

    // Client-side fallback
    const fallback = ACTIVITIES.filter(act => {
      const matchesCat = !category || category.length === 0 || category.includes(act.category)
      const matchesPrice = !maxPrice || act.cost <= maxPrice
      const matchesCity = !cityId || act.cityId === cityId
      return matchesCat && matchesPrice && matchesCity
    })

    return safeFetch<Activity[]>(url, fallback)
  },

  // Community
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

  // Admin Metrics
  async getAdminMetrics(timeRange: '7days' | '30days' | '1year' = '30days'): Promise<AdminStats> {
    const url = `${API_BASE_URL}/admin/metrics?timeRange=${timeRange}`
    return safeFetch<AdminStats>(url, ADMIN_STATS)
  }
}
