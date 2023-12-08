

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import { useRouter } from 'next/navigation'
import { Link } from 'react-router-dom'
import Header from './header/page'
// import { useRouter } from 'next/router'

import { usePathname } from 'next/navigation'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Simply Social',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // const router = useRouter();
  // const isLoginPage = router.pathname === '/';
  // const isRegistrationPage = router.pathname === '/Signup';
  // const isLoginPage = router.push('/');
  // const isRegistrationPage = router.push('/Signup');

  // const isLoginPage = location.pathname === '/';
  // const isRegistrationPage = location.pathname === '/Signup';


  // const pathName= usePathname();




  return (
    <html lang="en">
      <body className={inter.className}>
       
      {/* <Header /> */}
      {/* {
        pathName === '/Dashbord'? 
        <Header /> : null
      } */}
        {/* {!isLoginPage && !isRegistrationPage && <Header />} */}
        {children}
        </body>
    </html>
  )
}
