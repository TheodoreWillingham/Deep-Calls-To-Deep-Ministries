import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './Components/supabaseClient'

//Components
import HeroSection from './Components/HeroSection'
import ResourcesSection from './Components/ResourcesSection'
import MediaSection from './Components/MediaSection'
import BottomNav from './Components/BottomNav'
import LoginPage from './Components/LoginPage'
import MoreMenu from './Components/MoreMenu'
import BooksPage from './Components/BooksPage'
import PrayerPage from './Components/PrayerPage'
import EncouragementPage from './Components/EncouragementPage'
import EventsPage from './Components/EventsPage'
import GivePage from './Components/GivePage'
import MediaPage from './Components/MediaPage'
import AboutPage from './Components/AboutPage'
import TopBar from './Components/TopBar'
import Footer from './Components/Footer'

export type Page =
  | 'home'
  | 'login'
  | 'books'
  | 'prayer'
  | 'encouragement'
  | 'events'
  | 'media'
  | 'about'
  | 'give';

function App() {
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
        onLoggedIn={(admin) => {
          setIsAdmin(admin)
          setPage('home')
        }}
      />
    )
  }

  const renderPage = () => {
    if (page === 'books') return <BooksPage />
    if (page === 'prayer') return <PrayerPage isAdmin={isAdmin} />
    if (page === 'encouragement') return <EncouragementPage />
    if (page === 'events') return <EventsPage isAdmin={isAdmin} />
    if (page === 'media') return <MediaPage isAdmin={isAdmin} />
    if (page === 'about') return <AboutPage />
    if (page === 'give') return <GivePage />

    // Home
    return (
      <div className="stagger-rise">
        <HeroSection onGiveClick={() => setPage('give')} onMediaClick={() => setPage('media')} />
        <ResourcesSection onPrayersClick={() => setPage('prayer')} onMediaClick={() => setPage('media')} onEventsClick={() => setPage('events')} />
        <MediaSection onGiveClick={() => setPage('give')} onEventsClick={() => setPage('events')} />
      </div>
    )
  }

  return (
    <>
      <TopBar
        onLoginClick={() => setPage('login')}
        onLogoutClick={handleLogout}
        isLoggedIn={isLoggedIn}
        onNavClick={setPage}
        onGiveClick={() => setPage('give')}
      />
      {renderPage()}
      <Footer onNavClick={setPage} onLoginClick={() => setPage('login')} onLogoutClick={handleLogout} isLoggedIn={isLoggedIn} />
      <BottomNav
        onMoreClick={() => setMoreOpen(true)}
        onMediaClick={() => setPage('media')}
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
        onAboutClick={() => setPage('about')}
        onGiveClick={() => setPage('give')}
      />
    </>
  )
}

export default App
