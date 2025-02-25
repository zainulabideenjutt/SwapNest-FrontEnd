"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  fallback?: ReactNode
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border-2 border-destructive/50 p-6 text-destructive">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Something went wrong</h2>
          </div>
          <p className="mb-4 text-muted-foreground">{this.state.error?.message || "An unexpected error occurred"}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

