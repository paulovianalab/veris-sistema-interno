"use client";

import { ReactNode, Component, ErrorInfo } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorCount: number;
}

export class RootErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Only log external script errors as warnings, not full errors
    if (error.message.includes("addEventListener") || error.message.includes("share-modal")) {
      console.warn("[External Script Error]", error.message);
      // Don't show error UI for external script errors
      this.setState({ hasError: false });
      return;
    }

    console.error("Error caught by boundary:", error, errorInfo);
    
    // Increment error count - if too many errors, show UI
    this.setState(prev => ({
      errorCount: prev.errorCount + 1
    }));
  }

  render() {
    // Only show error UI for critical errors (not external script errors)
    if (this.state.hasError && this.state.errorCount > 3) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center">
            <p className="text-foreground text-lg">Um erro inesperado ocorreu</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
