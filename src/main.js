// Singularity - Main Entry Point v4.0 (Based on LifeOS)
// Initializes the application when the DOM is ready.

document.addEventListener('DOMContentLoaded', () => {
    // Global Singularity object should be available now.
    // The core init function will handle everything.
    if (window.Singularity) {
        Singularity.core.init();
    } else {
        console.error("FATAL: Singularity Core not found. Check script loading order.");
        document.body.innerHTML = "<h1>Fatal error loading application.</h1>";
    }
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('🚨 Global Error Caught:', event.error);
    
    if (window.Singularity && Singularity.ui && Singularity.ui.showToast) {
        Singularity.ui.showToast('An unexpected error occurred. Please refresh the page.', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('🚨 Unhandled Promise Rejection:', event.reason);
    
    if (window.Singularity && Singularity.ui && Singularity.ui.showToast) {
        Singularity.ui.showToast('A system error occurred. Please try again.', 'error');
    }
});