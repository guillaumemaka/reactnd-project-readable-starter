import React from 'react'
import HeadRoom from 'react-headroom'
import './Header.css'

const Header = () => {
  return (
    <HeadRoom style={{ zIndex: '100' }}>
      <h1 className="brand-logo">Readable</h1>
    </HeadRoom>
  )
}

export default Header
