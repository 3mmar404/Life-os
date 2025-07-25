// Singularity - Advanced Performance Optimization System v3.0 (Project GENESIS)
// Professional performance monitoring and optimization for enterprise-grade applications
if (!window.Singularity) { window.Singularity = {}; }

Singularity.performance = {
    // Cache management
    cache: new Map(),
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    
    // Performance metrics
    metrics: {
        loadTime: 0,
        renderTime: 0,
        memoryUsage: 0,
        cacheHits: 0,
        cacheMisses: 0,
        operationTimes: new Map()
    },
    
    // Initialize performance monitoring
    init() {
        this.startPerformanceMonitoring();
        this.setupIntersectionObserver();
        this.setupImageLazyLoading();
        this.optimizeAnimations();
        this.setupMemoryMonitoring();
        
        console.log('🚀 Singularity Performance System initialized');
    },
    
    // Start performance monitoring
    startPerformanceMonitoring() {
        // Measure initial load time
        if (performance.timing) {
            this.metrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        }
        
        // Monitor memory usage
        if (performance.memory) {
            this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
        }
        
        // Monitor render performance
        this.setupRenderMonitoring();
    },
    
    // Setup render performance monitoring
    setupRenderMonitoring() {
        if (!window.PerformanceObserver) return;
        
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'measure' && entry.name.startsWith('singularity-')) {
                    this.metrics.operationTimes.set(entry.name, entry.duration);
                }
            }
        });
        
        try {
            observer.observe({ entryTypes: ['measure'] });
        } catch (e) {
            console.warn('Performance Observer not fully supported');
        }
        
        // Cleanup on unload
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
        });
    },
    
    // Setup memory monitoring
    setupMemoryMonitoring() {
        if (!performance.memory) return;
        
        setInterval(() => {
            this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
            this.checkMemoryUsage();
        }, 30000); // Check every 30 seconds
    },
    
    // Measure function execution time
    measureTime(name, fn) {
        const measureName = `singularity-${name}`;
        const start = performance.now();
        
        try {
            const result = fn();
            const end = performance.now();
            
            // Record the measurement
            if (performance.mark && performance.measure) {
                performance.mark(`${measureName}-start`);
                performance.mark(`${measureName}-end`);
                performance.measure(measureName, `${measureName}-start`, `${measureName}-end`);
            }
            
            const duration = end - start;
            console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
            
            return result;
        } catch (error) {
            console.error(`❌ Error in ${name}:`, error);
            throw error;
        }
    },
    
    // Async function timing
    async measureTimeAsync(name, fn) {
        const measureName = `singularity-${name}`;
        const start = performance.now();
        
        try {
            const result = await fn();
            const end = performance.now();
            
            const duration = end - start;
            console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
            
            return result;
        } catch (error) {
            console.error(`❌ Error in ${name}:`, error);
            throw error;
        }
    },
    
    // Cache management
    setCache(key, value, timeout = this.cacheTimeout) {
        const expiry = Date.now() + timeout;
        this.cache.set(key, { value, expiry, timestamp: Date.now() });
        
        // Auto cleanup expired entries
        setTimeout(() => {
            this.cleanupCache();
        }, timeout);
    },
    
    getCache(key) {
        const cached = this.cache.get(key);
        
        if (!cached) {
            this.metrics.cacheMisses++;
            return null;
        }
        
        if (Date.now() > cached.expiry) {
            this.cache.delete(key);
            this.metrics.cacheMisses++;
            return null;
        }
        
        this.metrics.cacheHits++;
        return cached.value;
    },
    
    clearCache(pattern = null) {
        if (pattern) {
            for (const [key] of this.cache) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
        console.log(`🧹 Cache cleared${pattern ? ` (pattern: ${pattern})` : ''}`);
    },
    
    cleanupCache() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, cached] of this.cache) {
            if (now > cached.expiry) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
        }
    },
    
    // Memory management
    checkMemoryUsage() {
        if (!performance.memory) return;
        
        const used = performance.memory.usedJSHeapSize;
        const limit = performance.memory.jsHeapSizeLimit;
        const percentage = (used / limit) * 100;
        
        if (percentage > 80) {
            console.warn('⚠️ High memory usage detected:', percentage.toFixed(2) + '%');
            this.optimizeMemory();
        }
    },
    
    optimizeMemory() {
        // Clear old cache entries
        this.cleanupCache();
        
        // Force garbage collection if available (Chrome DevTools)
        if (window.gc) {
            window.gc();
        }
        
        // Clear unused event listeners
        this.cleanupEventListeners();
        
        // Clear old performance entries
        if (performance.clearMeasures) {
            performance.clearMeasures();
        }
        
        console.log('🧹 Memory optimization completed');
    },
    
    cleanupEventListeners() {
        // Remove orphaned event listeners from elements marked for cleanup
        const elements = document.querySelectorAll('[data-cleanup-listeners]');
        elements.forEach(el => {
            const clone = el.cloneNode(true);
            el.parentNode.replaceChild(clone, el);
        });
    },
    
    // Intersection Observer for lazy loading
    setupIntersectionObserver() {
        if (!window.IntersectionObserver) return;
        
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Lazy load images
                    if (element.dataset.src) {
                        element.src = element.dataset.src;
                        element.removeAttribute('data-src');
                        element.classList.add('loaded');
                    }
                    
                    // Trigger animations
                    if (element.classList.contains('animate-on-scroll')) {
                        element.classList.add('animate-in');
                    }
                    
                    // Load content
                    if (element.dataset.loadContent) {
                        this.loadContent(element);
                    }
                    
                    this.intersectionObserver.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
    },
    
    // Image lazy loading
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            // Add loading placeholder
            img.style.background = 'var(--secondary-color)';
            img.style.minHeight = '100px';
            
            if (this.intersectionObserver) {
                this.intersectionObserver.observe(img);
            }
        });
    },
    
    // Animation optimization
    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (this.isLowEndDevice()) {
            document.documentElement.classList.add('reduce-animations');
            console.log('🔧 Reduced animations for low-end device');
        }
        
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            const animations = document.querySelectorAll('[style*="animation"]');
            animations.forEach(el => {
                if (document.hidden) {
                    el.style.animationPlayState = 'paused';
                } else {
                    el.style.animationPlayState = 'running';
                }
            });
        });
    },
    
    // Detect low-end devices
    isLowEndDevice() {
        // Check for various indicators
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        return slowConnection || lowMemory || lowCores;
    },
    
    // Debounce function
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Request Animation Frame optimization
    rafBatch: [],
    scheduleRaf(callback) {
        this.rafBatch.push(callback);
        
        if (this.rafBatch.length === 1) {
            requestAnimationFrame(() => {
                const batch = this.rafBatch.slice();
                this.rafBatch.length = 0;
                
                batch.forEach(cb => {
                    try {
                        cb();
                    } catch (error) {
                        console.error('RAF callback error:', error);
                    }
                });
            });
        }
    },
    
    // Load content lazily
    loadContent(element) {
        const contentUrl = element.dataset.loadContent;
        const cacheKey = `content-${contentUrl}`;
        
        // Check cache first
        const cached = this.getCache(cacheKey);
        if (cached) {
            element.innerHTML = cached;
            return Promise.resolve();
        }
        
        // Show loading state
        element.innerHTML = '<div class="loading-placeholder">جاري التحميل...</div>';
        
        // Load content
        return fetch(contentUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.text();
            })
            .then(content => {
                element.innerHTML = content;
                this.setCache(cacheKey, content);
            })
            .catch(error => {
                element.innerHTML = '<div class="error-placeholder">فشل في التحميل</div>';
                console.error('Content loading failed:', error);
            });
    },
    
    // Preload critical resources
    preloadResources(resources) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.url;
            link.as = resource.type || 'fetch';
            if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
            document.head.appendChild(link);
        });
        
        console.log(`🚀 Preloaded ${resources.length} resources`);
    },
    
    // Get performance report
    getPerformanceReport() {
        const cacheHitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) * 100;
        
        return {
            loadTime: this.metrics.loadTime,
            memoryUsage: this.metrics.memoryUsage,
            cacheSize: this.cache.size,
            cacheHitRate: isNaN(cacheHitRate) ? 0 : cacheHitRate.toFixed(2),
            operationTimes: Object.fromEntries(this.metrics.operationTimes),
            isLowEndDevice: this.isLowEndDevice()
        };
    },
    
    // Log performance report
    logPerformanceReport() {
        const report = this.getPerformanceReport();
        console.group('📊 Singularity Performance Report');
        console.log('Load Time:', report.loadTime + 'ms');
        console.log('Memory Usage:', (report.memoryUsage / 1024 / 1024).toFixed(2) + 'MB');
        console.log('Cache Size:', report.cacheSize + ' entries');
        console.log('Cache Hit Rate:', report.cacheHitRate + '%');
        console.log('Low-End Device:', report.isLowEndDevice);
        if (Object.keys(report.operationTimes).length > 0) {
            console.log('Operation Times:', report.operationTimes);
        }
        console.groupEnd();
    }
};

// Auto-initialize performance monitoring
document.addEventListener('DOMContentLoaded', () => {
    Singularity.performance.init();
});

// Expose performance utilities globally
if (window.Singularity.core) {
    window.Singularity.core.measureTime = Singularity.performance.measureTime.bind(Singularity.performance);
    window.Singularity.core.measureTimeAsync = Singularity.performance.measureTimeAsync.bind(Singularity.performance);
    window.Singularity.core.debounce = Singularity.performance.debounce;
    window.Singularity.core.throttle = Singularity.performance.throttle;
}