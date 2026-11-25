import React from 'react'
import { createRoot } from 'react-dom/client'
import HomePage from './HomePage'
import HomePage2 from './HomePage2'
import './styles.css'

const path = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = path === '/home-2' ? HomePage2 : HomePage

createRoot(document.getElementById('root')).render(
  <React.StrictMode><Page /></React.StrictMode>,
)
