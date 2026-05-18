import { useState } from 'react';

const KEY = 'statify_time_range';
const VALID = ['short_term', 'medium_term', 'long_term'];

function read() {
  const v = localStorage.getItem(KEY);
  return VALID.includes(v) ? v : 'medium_term';
}

export function useTimeRange() {
  const [timeRange, setTimeRangeState] = useState(read);

  function setTimeRange(value) {
    if (VALID.includes(value)) {
      localStorage.setItem(KEY, value);
      setTimeRangeState(value);
    }
  }

  return [timeRange, setTimeRange];
}
