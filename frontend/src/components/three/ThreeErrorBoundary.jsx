import React from 'react';

export class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('3D rendering error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    // eslint-disable-next-line react/prop-types
    return this.props.children;
  }
}

