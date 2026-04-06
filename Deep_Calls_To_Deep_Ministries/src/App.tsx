import { useState } from 'react'
import './App.css'
import HeroSection from './Components/HeroSection'
import ResourcesSection from './Components/ResourcesSection'
import MediaSection from './Components/MediaSection'
import BottomNav from './Components/BottomNav'
import SearchOverlay from './Components/SearchOverlay'
import LoginPage from './Components/LoginPage'
import SignupPage from './Components/SignupPage'

type Page = 'home' | 'login' | 'signup';

function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [page, setPage] = useState<Page>('home')

  if (page === 'login') {
    return (
      <LoginPage
        onBack={() => setPage('home')}
        onGoToSignup={() => setPage('signup')}
      />
    )
  }

  if (page === 'signup') {
    return (
      <SignupPage
        onBack={() => setPage('home')}
        onGoToLogin={() => setPage('login')}
      />
    )
  }

  return (
    <>
      <HeroSection
        onSearchClick={() => setSearchOpen(true)}
        onLoginClick={() => setPage('login')}
      />
      <ResourcesSection />
      <MediaSection />
      <BottomNav />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}

export default App
