"use client"
import { AuthContextProvider } from "./Components/AuthContext";
import Login from "./Login";

export default function Home() {
  return (
  <main>
    <AuthContextProvider>
  <Login/>
  </AuthContextProvider>
  </main>
  )
}
