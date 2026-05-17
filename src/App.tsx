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
import EventsPage from './Components/EventsPage'
import ComingSoonPage from './Components/ComingSoonPage'
import MediaPage from './Components/MediaPage'
import TopBar from './Components/TopBar'

export type Page =
  | 'home'
  | 'login'
  | 'signup'
  | 'books'
  | 'prayer'
  | 'encouragement'
  | 'events'
  | 'media'
  | 'daily-practices'
  | 'give';

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

  const renderPage = () => {
    if (page === 'books') return <BooksPage onBack={() => setPage('home')} />
    if (page === 'prayer') return <PrayerPage onBack={() => setPage('home')} />
    if (page === 'encouragement') return <EncouragementPage onBack={() => setPage('home')} />
    if (page === 'events') return <EventsPage onBack={() => setPage('home')} />
    if (page === 'media') return <MediaPage onBack={() => setPage('home')} />
    if (page === 'daily-practices') return <ComingSoonPage title="Daily Practices" onBack={() => setPage('home')} />
    if (page === 'give') return <ComingSoonPage title="Give" onBack={() => setPage('home')} />

    // Home
    return (
      <>
        <HeroSection />
        <ResourcesSection onPrayersClick={() => setPage('prayer')} />
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
      </>
    )
  }

  return (
    <>
      <TopBar
        onSearchClick={() => setSearchOpen(true)}
        onLoginClick={() => setPage('login')}
        onNavClick={setPage}
      />
      {renderPage()}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}

export default App
