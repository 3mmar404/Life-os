// Singularity - Advanced Loading System v3.0 (Project GENESIS)
// Modern loading states with multiple animation types and performance optimization
if (!window.Singularity) { window.Singularity = {}; }

Singularity.loading = {
    activeLoaders: new Set(),
    
    // Show loading spinner with advanced options
    show(target, options = {}) {
        const {
            type = 'spinner',
            message = Singularity.i18n.t('loading_message') || 'جاري التحميل...',
            overlay = true,
            size = 'medium'
        } = options;
        
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return null;
        
        // Remove existing loader
        this.hide(element);
        
        const loaderId = `loader-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const loader = document.createElement('div');
        loader.className = `singularity-loader ${overlay ? 'overlay' : 'inline'} ${size}`;
        loader.setAttribute('data-loader-id', loaderId);
        
        loader.style.cssText = `
            position: ${overlay ? 'absolute' : 'relative'};
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: ${overlay ? 'rgba(15, 15, 15, 0.9)' : 'transparent'};
            backdrop-filter: ${overlay ? 'blur(8px)' : 'none'};
            z-index: ${overlay ? '1000' : '1'};
            border-radius: inherit;
            gap: 1rem;
            padding: 1.5rem;
            transition: opacity 0.3s ease;
            opacity: 0;
        `;
        
        // Create spinner based on type
        let spinnerHTML = '';
        switch (type) {
            case 'dots':
                spinnerHTML = this.createDotsSpinner(size);
                break;
            case 'pulse':
                spinnerHTML = this.createPulseSpinner(size);
                break;
            case 'bars':
                spinnerHTML = this.createBarsSpinner(size);
                break;
            case 'skeleton':
                spinnerHTML = this.createSkeletonLoader(element);
                break;
            case 'quantum':
                spinnerHTML = this.createQuantumSpinner(size);
                break;
            default:
                spinnerHTML = this.createSpinner(size);
        }
        
        loader.innerHTML = `
            ${spinnerHTML}
            ${message ? `<div class="loader-message">${message}</div>` : ''}
        `;
        
        // Position element relatively if needed
        if (overlay && getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(loader);
        
        // Fade in
        requestAnimationFrame(() => {
            loader.style.opacity = '1';
        });
        
        this.activeLoaders.add(loaderId);
        element.setAttribute('data-loading', 'true');
        
        // Add styles if not already added
        this.addStyles();
        
        return {
            id: loaderId,
            element: loader,
            hide: () => this.hide(element)
        };
    },
    
    // Hide loading spinner
    hide(target) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;
        
        const loaders = element.querySelectorAll('.singularity-loader');
        loaders.forEach(loader => {
            const loaderId = loader.getAttribute('data-loader-id');
            if (loaderId) {
                this.activeLoaders.delete(loaderId);
            }
            
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 300);
        });
        
        element.removeAttribute('data-loading');
    },
    
    // Create default spinner
    createSpinner(size) {
        const sizes = {
            small: '20px',
            medium: '32px',
            large: '48px'
        };
        
        return `
            <div class="spinner-container">
                <div class="spinner" style="width: ${sizes[size]}; height: ${sizes[size]};"></div>
            </div>
        `;
    },
    
    // Create quantum spinner (unique to Singularity)
    createQuantumSpinner(size) {
        const sizes = {
            small: '24px',
            medium: '36px',
            large: '48px'
        };
        
        return `
            <div class="quantum-spinner" style="width: ${sizes[size]}; height: ${sizes[size]};">
                <div class="quantum-ring"></div>
                <div class="quantum-ring"></div>
                <div class="quantum-ring"></div>
            </div>
        `;
    },
    
    // Create dots spinner
    createDotsSpinner(size) {
        const dotSizes = {
            small: '8px',
            medium: '12px',
            large: '16px'
        };
        
        return `
            <div class="dots-spinner">
                <div class="dot" style="width: ${dotSizes[size]}; height: ${dotSizes[size]};"></div>
                <div class="dot" style="width: ${dotSizes[size]}; height: ${dotSizes[size]};"></div>
                <div class="dot" style="width: ${dotSizes[size]}; height: ${dotSizes[size]};"></div>
            </div>
        `;
    },
    
    // Create pulse spinner
    createPulseSpinner(size) {
        const pulseSizes = {
            small: '24px',
            medium: '36px',
            large: '48px'
        };
        
        return `
            <div class="pulse-spinner" style="width: ${pulseSizes[size]}; height: ${pulseSizes[size]};"></div>
        `;
    },
    
    // Create bars spinner
    createBarsSpinner(size) {
        const barHeights = {
            small: '20px',
            medium: '30px',
            large: '40px'
        };
        
        return `
            <div class="bars-spinner" style="height: ${barHeights[size]};">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
        `;
    },
    
    // Create skeleton loader
    createSkeletonLoader(element) {
        const rect = element.getBoundingClientRect();
        const lines = Math.min(Math.floor(rect.height / 24), 5);
        
        let skeletonHTML = '';
        for (let i = 0; i < lines; i++) {
            const width = i === lines - 1 ? '60%' : '100%';
            skeletonHTML += `<div class="skeleton-line" style="width: ${width};"></div>`;
        }
        
        return `<div class="skeleton-container">${skeletonHTML}</div>`;
    },
    
    // Add required styles
    addStyles() {
        if (document.getElementById('singularity-loading-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'singularity-loading-styles';
        style.textContent = `
            .singularity-loader {
                font-family: 'IBM Plex Sans', 'Tajawal', sans-serif;
                color: var(--text-primary);
            }
            
            .loader-message {
                color: var(--text-secondary);
                font-size: 0.9rem;
                font-weight: 500;
                text-align: center;
                margin-top: 0.5rem;
            }
            
            /* Default Spinner */
            .spinner {
                border: 3px solid var(--border-color);
                border-top: 3px solid var(--accent-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Quantum Spinner (Unique to Singularity) */
            .quantum-spinner {
                position: relative;
                display: inline-block;
            }
            
            .quantum-ring {
                position: absolute;
                border: 2px solid transparent;
                border-top: 2px solid var(--accent-color);
                border-radius: 50%;
                animation: quantum-spin 2s linear infinite;
            }
            
            .quantum-ring:nth-child(1) {
                width: 100%;
                height: 100%;
                animation-delay: 0s;
                border-top-color: var(--accent-color);
            }
            
            .quantum-ring:nth-child(2) {
                width: 80%;
                height: 80%;
                top: 10%;
                left: 10%;
                animation-delay: -0.4s;
                animation-direction: reverse;
                border-top-color: #60a5fa;
            }
            
            .quantum-ring:nth-child(3) {
                width: 60%;
                height: 60%;
                top: 20%;
                left: 20%;
                animation-delay: -0.8s;
                border-top-color: #93c5fd;
            }
            
            @keyframes quantum-spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Dots Spinner */
            .dots-spinner {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }
            
            .dots-spinner .dot {
                background: var(--accent-color);
                border-radius: 50%;
                animation: dots-bounce 1.4s ease-in-out infinite both;
            }
            
            .dots-spinner .dot:nth-child(1) { animation-delay: -0.32s; }
            .dots-spinner .dot:nth-child(2) { animation-delay: -0.16s; }
            .dots-spinner .dot:nth-child(3) { animation-delay: 0s; }
            
            @keyframes dots-bounce {
                0%, 80%, 100% {
                    transform: scale(0);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            /* Pulse Spinner */
            .pulse-spinner {
                background: var(--accent-color);
                border-radius: 50%;
                animation: pulse-scale 1s ease-in-out infinite;
            }
            
            @keyframes pulse-scale {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 0;
                }
            }
            
            /* Bars Spinner */
            .bars-spinner {
                display: flex;
                align-items: flex-end;
                gap: 3px;
            }
            
            .bars-spinner .bar {
                width: 4px;
                background: var(--accent-color);
                border-radius: 2px;
                animation: bars-stretch 1.2s ease-in-out infinite;
            }
            
            .bars-spinner .bar:nth-child(1) { animation-delay: -1.2s; }
            .bars-spinner .bar:nth-child(2) { animation-delay: -1.1s; }
            .bars-spinner .bar:nth-child(3) { animation-delay: -1.0s; }
            .bars-spinner .bar:nth-child(4) { animation-delay: -0.9s; }
            .bars-spinner .bar:nth-child(5) { animation-delay: -0.8s; }
            
            @keyframes bars-stretch {
                0%, 40%, 100% {
                    height: 20%;
                }
                20% {
                    height: 100%;
                }
            }
            
            /* Skeleton Loader */
            .skeleton-container {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }
            
            .skeleton-line {
                height: 16px;
                background: linear-gradient(90deg, var(--secondary-color) 25%, var(--border-color) 50%, var(--secondary-color) 75%);
                background-size: 200% 100%;
                border-radius: 4px;
                animation: skeleton-shimmer 1.5s infinite;
            }
            
            @keyframes skeleton-shimmer {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            
            /* Loading States for Elements */
            [data-loading="true"] {
                pointer-events: none;
                user-select: none;
            }
            
            [data-loading="true"] > *:not(.singularity-loader) {
                opacity: 0.6;
                filter: blur(1px);
                transition: all 0.3s ease;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    // Utility methods
    showButton(button, options = {}) {
        const originalText = button.innerHTML;
        const originalDisabled = button.disabled;
        
        button.disabled = true;
        button.innerHTML = `
            <div class="spinner" style="width: 16px; height: 16px; margin-left: 8px; display: inline-block;"></div>
            ${options.text || Singularity.i18n.t('processing') || 'جاري المعالجة...'}
        `;
        
        this.addStyles();
        
        return {
            hide: () => {
                button.disabled = originalDisabled;
                button.innerHTML = originalText;
            }
        };
    },
    
    showCard(card, options = {}) {
        return this.show(card, {
            type: 'skeleton',
            overlay: true,
            ...options
        });
    },
    
    showForm(form, options = {}) {
        return this.show(form, {
            type: 'quantum',
            message: Singularity.i18n.t('saving') || 'جاري الحفظ...',
            overlay: true,
            ...options
        });
    },
    
    // Clean up all loaders
    hideAll() {
        this.activeLoaders.forEach(loaderId => {
            const loader = document.querySelector(`[data-loader-id="${loaderId}"]`);
            if (loader && loader.parentNode) {
                this.hide(loader.parentNode);
            }
        });
        this.activeLoaders.clear();
    }
};

// Auto cleanup on page unload
window.addEventListener('beforeunload', () => {
    Singularity.loading.hideAll();
});

// Integration with existing UI system
if (window.Singularity.ui) {
    window.Singularity.ui.showLoading = (target, options) => {
        return window.Singularity.loading.show(target, options);
    };
    
    window.Singularity.ui.hideLoading = (target) => {
        return window.Singularity.loading.hide(target);
    };
}