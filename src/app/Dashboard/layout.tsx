"use client";
import { useRouter } from "next/navigation";
import Header from "../header/page"

export default function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {

    const router = useRouter();
//   const isLoginPage = router.pathname === '/';
//   const isRegistrationPage = router.pathname === '/Signup';


  const isLoginPage = router.push('/');
  const isRegistrationPage = router.push('/Signup');
    return (
      <section>
        {/* Include shared UI here e.g. a header or sidebar */}
        {/* <nav><Header /></nav> */}
        {/* {!isLoginPage && !isRegistrationPage && <Header />} */}

        {/* {
        pathName === '/Dashbord'? 
        <Header /> : null
      } */}
   
        {children}
      </section>
    )
  }