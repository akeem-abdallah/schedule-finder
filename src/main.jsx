import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './ErrorBoundary.jsx'
import './index.css'
import App from './App.jsx'
import * as Sentry from "@sentry/react"

Sentry.init({
    dsn: "https://4ea3196ba5d22ff7200e1e6ca8014409@o4511924815593472.ingest.de.sentry.io/4511924830601296",
})

createRoot(document.getElementById('root')).render(
// <StrictMode>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
// </StrictMode>,
)
