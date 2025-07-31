// Performance monitoring utility
export const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`⏱️ ${name}: ${(end - start).toFixed(2)}ms`);
  return result;
};

export const trackPageLoad = (pageName) => {
  const loadTime = performance.now();
  console.log(`📄 ${pageName} loaded in ${loadTime.toFixed(2)}ms`);
  
  // Send to analytics if available
  if (window.gtag) {
    window.gtag('event', 'page_load', {
      page_name: pageName,
      load_time: loadTime
    });
  }
};

export const trackUserAction = (action, details = {}) => {
  console.log(`👤 User action: ${action}`, details);
  
  // Send to analytics if available
  if (window.gtag) {
    window.gtag('event', 'user_action', {
      action: action,
      ...details
    });
  }
};

export const trackError = (error, context = {}) => {
  console.error(`❌ Error in ${context.component || 'unknown'}:`, error);
  
  // Send to error tracking if available
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      ...context
    });
  }
}; 