import { Component } from "react"
import * as Sentry from "@sentry/react"

class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="page-main">
                    <div className="card">
                        <div className="status-strip">
                            <h1 className="strip-title">AURAK Schedule Finder</h1>
                        </div>
                        <div style={{ padding: "24px 13px", textAlign: "center" }}>
                            <p style={{ marginBottom: "16px" }}>Something went wrong. Please refresh the page.</p>
                            <button className="btn-primary" onClick={() => window.location.reload()}>RELOAD</button>
                        </div>
                    </div>
                </div>
            )
        }
        return this.props.children
    }

    componentDidCatch(error, info) {
        Sentry.captureException(error)
    }
}

export default ErrorBoundary