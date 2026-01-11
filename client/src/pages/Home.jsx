import React from 'react'
import Banner from '../components/home/banner'
import Hero from '../components/home/Hero'
import Feature from '../components/home/Feature'
import Testimonials from '../components/home/Testimonials'
import CallToAction from '../components/home/CallToAction'
import Footer from '../components/home/Footer'

const Home = () => {
  return (
    <div >
        <Banner/>
        <Hero/>
        <Feature/>
        <Testimonials/>
        <CallToAction/>
        <Footer/>
    </div>
  )
}

export default Home