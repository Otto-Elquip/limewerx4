import Head from "next/head";
import Link from "next/link";
import Navbar2 from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Work from "./components/Work";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FadeUp from "./components/FadeUp";
import { Auth } from 'aws-amplify'
import { useState , useEffect} from "react";

export default function Main() {
  const [authenticated, setAuthenticated] = useState();

  useEffect(() => {
    checkAuth();
  })

  const checkAuth = () =>
  {
    
    Promise.all([Auth.currentUserCredentials()])
    .then( result => {
      const [a] = result;
      console.log(a.authenticated)
      if(a.authenticated == true)
      {
        setAuthenticated(true);
      }
      if(a.authenticated == undefined)
      {
        setAuthenticated(false);
      }
    })
  }

  return (
    <>
      <Navbar2 authenticated={authenticated} />
      <Home />
      <About />
      <Work />
      <Contact />
      <Footer />
    </>
  );
}