import { useState } from 'react'
import './App.css'

//Components
import HeroSection from './Components/HeroSection'
import ResourcesSection from './Components/ResourcesSection'
import MediaSection from './Components/MediaSection'
import BottomNav from './Components/BottomNav'
import SearchOverlay from './Components/SearchOverlay'
import LoginPage from './Components/LoginPage'
import SignupPage from './Components/SignupPage'
import MoreMenu from './Components/MoreMenu'
import BooksPage from './Components/BooksPage'
import PrayerPage from './Components/PrayerPage'
import EncouragementPage from './Components/EncouragementPage'
import Events from './Pages/EventPage'


type Page = 'home' | 'login' | 'signup' | 'books' | 'prayer' | 'encouragement' | 'events';

function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
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

  if (page === 'books') {
    return <BooksPage onBack={() => setPage('home')} />
  }

  if (page === 'prayer') {
    return <PrayerPage onBack={() => setPage('home')} />
  }

  if (page === 'encouragement') {
    return <EncouragementPage onBack={() => setPage('home')} />
  }

  if (page === 'events') {
    return <Events onBack={() => setPage('home')} />;
  }

  return (
    <>
      <HeroSection
        onSearchClick={() => setSearchOpen(true)}
        onLoginClick={() => setPage('login')}
      />
      <ResourcesSection />
      <MediaSection />
      <BottomNav
        onMoreClick={() => setMoreOpen(true)}
        onBooksClick={() => setPage('books')}
        onPrayerClick={() => setPage('prayer')}
        onEventsClick={() => setPage('events')}
      />
      <MoreMenu
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        onEncouragementClick={() => setPage('encouragement')}
        onPrayersClick={() => setPage('prayer')}
        onEventsClick={() => setPage('events')}
      />
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}

export default App
