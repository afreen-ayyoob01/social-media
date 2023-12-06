import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../config/firebase'

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  console.log(user)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName } = user
        // const { dateOfBirth, mobileNumber, address } = user 
  
        setUser({
          uid,
          email,
          displayName,
        //   dateOfBirth,
        //   mobileNumber,
        //   address,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
  
    return () => unsubscribe()
  }, [])
  


  const signup = async (
    email: string,
    password: string,
    name: string,
    dateOfBirth: string,
    mobileNumber: string,
    address: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  
    const user = userCredential.user
  
    if (user) {
      await user.updateProfile({
        displayName: name,
      })
  
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: name,
        dateOfBirth,
        mobileNumber,
        address,
      })
  
      return user
    }
  
    throw new Error('Failed to create user')
  }


  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    setUser(null)
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}