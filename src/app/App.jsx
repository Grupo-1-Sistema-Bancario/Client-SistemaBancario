import { useState, useEffect } from 'react'
import reactLogo from '../assets/img/react.svg'
import heroImg from '../assets/img/hero.png'
import viteLogo from '../assets/img/vite.svg'
import Spinner from './components/Spinner'

function App() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500) // 2.5 segundos
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div style={{
        background: '#1A0F2E',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
    </>
  )
}