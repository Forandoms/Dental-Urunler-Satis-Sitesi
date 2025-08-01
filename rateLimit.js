export const checkRateLimit = (key, delayMinutes) => {
  if (typeof window === 'undefined') return { canSubmit: true, remainingTime: 0 };
  
  const lastSubmissionTime = localStorage.getItem(key);
  if (!lastSubmissionTime) return { canSubmit: true, remainingTime: 0 };

  const now = Date.now();
  const timeDiff = now - parseInt(lastSubmissionTime);
  const delayMs = delayMinutes * 60 * 1000;

  if (timeDiff < delayMs) {
    const remainingTime = Math.ceil((delayMs - timeDiff) / 1000);
    return { canSubmit: false, remainingTime };
  }

  return { canSubmit: true, remainingTime: 0 };
};

export const setLastSubmissionTime = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, Date.now().toString());
  }
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

