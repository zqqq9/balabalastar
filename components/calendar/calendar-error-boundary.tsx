"use client";

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class CalendarErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Calendar Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="border-2 border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">加载日历数据时出错</p>
          <p className="text-sm text-muted-foreground mt-2">
            请刷新页面重试
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

