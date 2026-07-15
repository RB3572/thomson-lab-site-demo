import { lazy, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'

// Split the heavier / secondary pages into their own chunks.
const OurTeam = lazy(() => import('./pages/OurTeam.tsx'))
const Research = lazy(() => import('./pages/Research.tsx'))
const ActiveMatter = lazy(() => import('./pages/ActiveMatter.tsx'))
const MachineLearning = lazy(() => import('./pages/MachineLearning.tsx'))
const SingleCell = lazy(() => import('./pages/SingleCell.tsx'))
const Publications = lazy(() => import('./pages/Publications.tsx'))
const Calendar = lazy(() => import('./pages/Calendar.tsx'))
const Resources = lazy(() => import('./pages/Resources.tsx'))
const Contact = lazy(() => import('./pages/Contact.tsx'))
const Placeholder = lazy(() => import('./pages/Placeholder.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="research" element={<Research />} />
          <Route path="active-matter" element={<ActiveMatter />} />
          <Route path="machine-learning" element={<MachineLearning />} />
          <Route path="single-cell" element={<SingleCell />} />
          <Route path="publications" element={<Publications />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="resources" element={<Resources />} />
          <Route path="our-team" element={<OurTeam />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Placeholder title="Page not found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
