import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Charge les données au montage
  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          loadProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(userId) {
    try {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (err) {
        console.error('Erreur lors du chargement du profil:', err)
        setError(err.message)
      } else {
        setProfile(data)
        setError(null)
      }
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password) => {
    try {
      setError(null)
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password
      })
      if (err) throw err
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signIn = async (email, password) => {
    try {
      setError(null)
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (err) throw err
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      const { error: err } = await supabase.auth.signOut()
      if (err) throw err
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const isAdmin = profile?.role === 'admin'
  const isRevendeur = profile?.role === 'revendeur'

  return {
    user,
    profile,
    loading,
    error,
    isAdmin,
    isRevendeur,
    signUp,
    signIn,
    signOut
  }
}
