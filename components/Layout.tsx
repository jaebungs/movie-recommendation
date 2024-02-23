import React from 'react'
// import Navigation from './Navigation'
// import Footer from './Footer'

interface layoutType {
    children: React.ReactNode
}

const Layout  = ({children} : layoutType) => {
  return (
    <>
        {/* <Navigation /> */}
        <main>{children}</main>
        {/* <Footer /> */}
    </>
  )
}

export default Layout