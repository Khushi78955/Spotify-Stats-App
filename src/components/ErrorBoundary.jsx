import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.fallback}>
          <span className={styles.icon}>⚠</span>
          <p className={styles.title}>{this.props.label || 'This section'} couldn't load</p>
          <p className={styles.detail}>{this.state.error.message}</p>
          <button
            className={styles.retry}
            onClick={() => this.setState({ error: null })}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
