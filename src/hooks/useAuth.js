import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
      setLoading(false)
    }

    getUser()
  }, [])

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { success: false, error: error.message }
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const signup = async (userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })
      if (error) return { success: false, error: error.message }
      
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: data.user.id,
        email: userData.email,
        role: userData.role,
        companyName: userData.companyName,
        responsibleNumber: userData.responsibleNumber,
      }])
      
      if (profileError) return { success: false, error: profileError.message }
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return { user, profile, loading, login, signup, logout }
}
