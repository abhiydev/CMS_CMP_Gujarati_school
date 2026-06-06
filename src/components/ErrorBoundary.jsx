import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error(`[ErrorBoundary:${this.props.name ?? 'unknown'}]`, error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
            {this.props.fallbackTitle ?? 'Something went wrong'}
          </p>
          <p className="mt-3 text-slate-600">
            {this.props.fallbackMessage ?? 'This section could not be displayed. The rest of the site should still work.'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
