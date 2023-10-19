import React, { useState, useEffect } from 'react';
import Spinner from '../spinner';

function Loading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);

  return isLoading ? (
    <div className="loading">
      <Spinner />
    </div>
  ) : null;
}

export default Loading;
