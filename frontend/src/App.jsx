import { useState } from 'react'
import QRGenerator from './components/QRGenerator'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <QRGenerator />
      </main>
      <Footer />
    </div>
  )
}

export default App

