import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './Components/supabaseClient'

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
  | 'give';

function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [page, setPage] = useState<Page>('home')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function loadAdmin() {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .single()
      setIsAdmin(Boolean(profile?.is_admin))
    }

    supabase.auth.getSession().then(({ data }) => {
      const loggedIn = Boolean(data.session)
      setIsLoggedIn(loggedIn)
      if (loggedIn) loadAdmin()
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const loggedIn = Boolean(session)
      setIsLoggedIn(loggedIn)
      if (loggedIn) {
        loadAdmin()
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setPage('home')
  }

  if (page === 'login') {
    return (
      <LoginPage
        onBack={() => setPage('home')}
        onGoToSignup={() => setPage('signup')}
        onLoggedIn={(admin) => {
          setIsAdmin(admin)
          setPage('home')
        }}
      />
    )
  }

  if (page === 'signup') {
    return (
      <SignupPage
        onBack={() => setPage('home')}
        onGoToLogin={() => setPage('login')}
        onLoggedIn={(admin) => {
          setIsAdmin(admin)
          setPage('home')
        }}
      />
    )
  }

  const renderPage = () => {
    if (page === 'books') return <BooksPage onBack={() => setPage('home')} />
    if (page === 'prayer') return <PrayerPage onBack={() => setPage('home')} />
    if (page === 'encouragement') return <EncouragementPage onBack={() => setPage('home')} />
    if (page === 'events') return <EventsPage onBack={() => setPage('home')} isAdmin={isAdmin} />
    if (page === 'media') return <MediaPage onBack={() => setPage('home')} />
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
        onLogoutClick={handleLogout}
        isLoggedIn={isLoggedIn}
        onNavClick={setPage}
      />
      {renderPage()}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}

export default App
