import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { createProductionApiCall } from '@/utils/productionApi';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId: string;
  retryCount: number;
  showDetails: boolean;
  copied: boolean;
  reportSent: boolean;
  userFeedback: string;
}

const searilizeError = (error: any) => {
  if (error instanceof Error) {
    return error.message + '\n' + error.stack;
  }
  return JSON.stringify(error, null, 2);
};

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
      retryCount: 0,
      showDetails: false,
      copied: false,
      reportSent: false,
      userFeedback: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `err_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error details
    this.logError(error, errorInfo);
  }

  private logError = async (error: Error, errorInfo: ErrorInfo) => {
    const errorData = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem('user_id') || 'anonymous'
    };

    try {
      // In production, send to error reporting service
      if (process.env.NODE_ENV === 'production') {
        const apiCall = createProductionApiCall('/api/errors/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify(errorData)
        });
        await apiCall();
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private sendUserReport = async () => {
    try {
      const apiCall = createProductionApiCall('/api/errors/user-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          errorId: this.state.errorId,
          feedback: this.state.userFeedback,
          reproduction: 'User provided feedback'
        })
      });
      await apiCall();
      
      this.setState({ reportSent: true });
    } catch (error) {
      console.error('Failed to send user report:', error);
    }
  };

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: this.state.retryCount + 1,
        showDetails: false,
        copied: false
      });
    }
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  copyErrorDetails = () => {
    const errorDetails = `Error ID: ${this.state.errorId}\nMessage: ${this.state.error?.message}\nURL: ${window.location.href}\nTimestamp: ${new Date().toISOString()}`;
    
    navigator.clipboard.writeText(errorDetails).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Simple fallback for development
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="p-4 border border-red-500 rounded">
            <h2 className="text-red-500">Something went wrong.</h2>
            <pre className="mt-2 text-sm">{searilizeError(this.state.error)}</pre>
            <div className="mt-4 space-x-2">
              <Button onClick={this.handleRetry} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        );
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const errorMessage = this.state.error?.message || 'Unknown error';
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
      const isChunkError = errorMessage.includes('chunk') || errorMessage.includes('Loading');

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                {isNetworkError && 'Network connection issue detected.'}
                {isChunkError && 'Application update detected. Please refresh the page.'}
                {!isNetworkError && !isChunkError && 'We encountered an unexpected error.'}
              </CardDescription>
              
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="outline-solid" className="text-xs">
                  Error ID: {this.state.errorId}
                </Badge>
                {this.state.retryCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Retry {this.state.retryCount}/{this.maxRetries}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {canRetry ? (
                  <Button onClick={this.handleRetry} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                ) : (
                  <Button onClick={this.handleReload} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                )}
                
                <Button onClick={this.handleGoHome} variant="outline" className="w-full">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* User Feedback Section */}
              {!this.state.reportSent && (
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <h4 className="text-sm font-medium">Help us improve</h4>
                  <Textarea
                    placeholder="What were you trying to do when this error occurred? (optional)"
                    value={this.state.userFeedback}
                    onChange={(e) => this.setState({ userFeedback: e.target.value })}
                    className="text-sm"
                    rows={3}
                  />
                  <Button
                    onClick={this.sendUserReport}
                    size="sm"
                    variant="outline"
                    className="w-full"
                    disabled={this.state.reportSent}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Report
                  </Button>
                </div>
              )}

              {this.state.reportSent && (
                <Alert>
                  <Check className="w-4 h-4" />
                  <AlertDescription>
                    Thank you for your feedback! We'll use it to improve the platform.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Details (Collapsible) */}
              <Collapsible open={this.state.showDetails} onOpenChange={(open) => this.setState({ showDetails: open })}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full">
                    <Bug className="w-4 h-4 mr-2" />
                    {this.state.showDetails ? 'Hide' : 'Show'} Technical Details
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2">
                  <div className="p-3 bg-muted rounded text-xs font-mono">
                    <div className="mb-2">
                      <strong>Error:</strong> {errorMessage}
                    </div>
                    <div className="mb-2">
                      <strong>Time:</strong> {new Date().toLocaleString()}
                    </div>
                    <div>
                      <strong>Page:</strong> {window.location.pathname}
                    </div>
                  </div>
                  <Button
                    onClick={this.copyErrorDetails}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    {this.state.copied ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    {this.state.copied ? 'Copied!' : 'Copy Error Details'}
                  </Button>
                </CollapsibleContent>
              </Collapsible>
              
              <p className="text-xs text-muted-foreground text-center">
                If this problem persists, please contact support with the error ID above.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;