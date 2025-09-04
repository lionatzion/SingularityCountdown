import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global error handlers for frontend to prevent unhandled rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', {
    reason: event.reason,
    promise: event.promise,
    stack: event.reason?.stack,
    message: event.reason?.message,
    type: typeof event.reason
  });
  
  // Log additional context if available
  if (event.reason instanceof Error) {
    console.error('Error details:', {
      name: event.reason.name,
      message: event.reason.message,
      stack: event.reason.stack
    });
  }
  
  event.preventDefault(); // Prevent the default browser behavior
});

window.addEventListener('error', (event) => {
  console.error('Global error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
    stack: event.error?.stack
  });
});

createRoot(document.getElementById("root")!).render(<App />);
