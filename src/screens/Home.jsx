import React from 'react'
import Navbar from '../components/Navbar'
import Body from '../components/Body'
import Footer from '../components/Footer'
import FaqSection from './FaqSection'

function Home() {
  return (
    <>
      <div><Navbar/></div>
      <div><Body/></div>
      <div><FaqSection/></div>
      <div><Footer/></div>

    </>
  )
}

export default Home
