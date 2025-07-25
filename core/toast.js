// Singularity - Advanced Toast Notification System v3.0 (Project GENESIS)
// Professional notification system with multiple types and animations
if (!window.Singularity) { window.Singularity = {}; }

Singularity.toast = {
    container: null,
    
    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'singularity-toast-container';
            this.container.style.cssText = `
                position: fixed;
                top: 1.5rem;
                right: 1.5rem;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                pointer-events: none;
                max-width: 420px;
            `;
            document.body.appendChild(this.container);
        }
    },
    
    show(message, type = 'info', duration = 4000, options = {}) {
        this.init();
        
        const toast = document.createElement('div');
        toast.className = `singularity-toast toast-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            loading: 'fas fa-spinner fa-spin'
        };
        
        const colors = {
            success: {
                bg: 'rgba(16, 185, 129, 0.1)',
                border: 'var(--success-color)',
                text: 'var(--success-color)',
                icon: 'var(--success-color)'
            },
            error: {
                bg: 'rgba(239, 68, 68, 0.1)',
                border: 'var(--danger-color)',
                text: 'var(--danger-color)',
                icon: 'var(--danger-color)'
            },
            warning: {
                bg: 'rgba(245, 158, 11, 0.1)',
                border: 'var(--warning-color)',
                text: 'var(--warning-color)',
                icon: 'var(--warning-color)'
            },
            info: {
                bg: 'rgba(59, 130, 246, 0.1)',
                border: 'var(--accent-color)',
                text: 'var(--accent-color)',
                icon: 'var(--accent-color)'
            },
            loading: {
                bg: 'rgba(59, 130, 246, 0.1)',
                border: 'var(--accent-color)',
                text: 'var(--text-primary)',
                icon: 'var(--accent-color)'
            }
        };
        
        const color = colors[type] || colors.info;
        
        toast.style.cssText = `
            min-width: 320px;
            max-width: 420px;
            padding: 1rem;
            background: var(--primary-color);
            border: 1px solid ${color.border};
            border-left: 4px solid ${color.border};
            border-radius: 8px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
            color: var(--text-primary);
            font-family: 'IBM Plex Sans', 'Tajawal', sans-serif;
            font-size: 0.9rem;
            line-height: 1.5;
            pointer-events: auto;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
            transform: translateX(100%);
            opacity: 0;
            animation: toast-slide-in 0.3s ease-out forwards;
        `;
        
        // Progress bar
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 2px;
            background: ${color.border};
            width: 100%;
            transform-origin: left;
            animation: toast-progress ${duration}ms linear;
        `;
        
        // Content
        const content = document.createElement('div');
        content.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        `;
        
        const icon = document.createElement('i');
        icon.className = icons[type];
        icon.style.cssText = `
            color: ${color.icon};
            font-size: 1.1rem;
            margin-top: 2px;
            flex-shrink: 0;
        `;
        
        const messageEl = document.createElement('div');
        messageEl.style.cssText = `
            flex: 1;
            font-weight: 500;
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            opacity: 0.7;
            transition: all 0.2s ease;
            flex-shrink: 0;
            font-size: 0.9rem;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.opacity = '1';
            closeBtn.style.background = 'rgba(255,255,255,0.1)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.opacity = '0.7';
            closeBtn.style.background = 'none';
        });
        
        // Add title if provided
        if (options.title) {
            const title = document.createElement('div');
            title.style.cssText = `
                font-weight: 600;
                margin-bottom: 0.25rem;
                font-size: 0.95rem;
                color: ${color.text};
            `;
            title.textContent = options.title;
            messageEl.appendChild(title);
        }
        
        // Add message
        const messageText = document.createElement('div');
        messageText.textContent = message;
        messageEl.appendChild(messageText);
        
        // Add action button if provided
        if (options.action) {
            const actionBtn = document.createElement('button');
            actionBtn.textContent = options.action.text;
            actionBtn.style.cssText = `
                background: ${color.border};
                color: var(--bg-color);
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.8rem;
                font-weight: 600;
                cursor: pointer;
                margin-top: 0.5rem;
                transition: all 0.2s ease;
            `;
            
            actionBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                options.action.callback();
                remove();
            });
            
            messageEl.appendChild(actionBtn);
        }
        
        content.appendChild(icon);
        content.appendChild(messageEl);
        content.appendChild(closeBtn);
        
        toast.appendChild(content);
        if (type !== 'loading') {
            toast.appendChild(progressBar);
        }
        
        // Event listeners
        const remove = () => {
            toast.style.animation = 'toast-slide-out 0.3s ease-in forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            remove();
        });
        
        toast.addEventListener('click', () => {
            if (options.onClick) {
                options.onClick();
            }
            remove();
        });
        
        // Auto remove (except for loading type)
        let timer;
        if (type !== 'loading') {
            timer = setTimeout(remove, duration);
        }
        
        // Pause on hover
        toast.addEventListener('mouseenter', () => {
            if (progressBar && timer) {
                progressBar.style.animationPlayState = 'paused';
                clearTimeout(timer);
            }
        });
        
        toast.addEventListener('mouseleave', () => {
            if (progressBar && type !== 'loading') {
                progressBar.style.animationPlayState = 'running';
                const remainingTime = duration * 0.7; // Approximate remaining time
                timer = setTimeout(remove, remainingTime);
            }
        });
        
        this.container.appendChild(toast);
        
        // Add animations
        this.addStyles();
        
        return {
            element: toast,
            remove: remove
        };
    },
    
    success(message, options = {}) {
        return this.show(message, 'success', 4000, {
            title: options.title || Singularity.i18n.t('success_title') || 'نجح!',
            ...options
        });
    },
    
    error(message, options = {}) {
        return this.show(message, 'error', 6000, {
            title: options.title || Singularity.i18n.t('error_title') || 'خطأ!',
            ...options
        });
    },
    
    warning(message, options = {}) {
        return this.show(message, 'warning', 5000, {
            title: options.title || Singularity.i18n.t('warning_title') || 'تحذير!',
            ...options
        });
    },
    
    info(message, options = {}) {
        return this.show(message, 'info', 4000, options);
    },
    
    loading(message, options = {}) {
        return this.show(message, 'loading', 0, {
            title: options.title || Singularity.i18n.t('loading_title') || 'جاري التحميل...',
            ...options
        });
    },
    
    // Quick methods
    saved() {
        return this.success(
            Singularity.i18n.t('saved_message') || 'تم الحفظ بنجاح',
            { title: Singularity.i18n.t('saved_title') || 'محفوظ!' }
        );
    },
    
    deleted() {
        return this.success(
            Singularity.i18n.t('deleted_message') || 'تم الحذف بنجاح',
            { title: Singularity.i18n.t('deleted_title') || 'محذوف!' }
        );
    },
    
    copied() {
        return this.success(
            Singularity.i18n.t('copied_message') || 'تم النسخ إلى الحافظة',
            { title: Singularity.i18n.t('copied_title') || 'منسوخ!' }
        );
    },
    
    networkError() {
        return this.error(
            Singularity.i18n.t('network_error_message') || 'فشل في الاتصال بالشبكة',
            { title: Singularity.i18n.t('network_error_title') || 'خطأ في الشبكة' }
        );
    },
    
    validationError(message) {
        return this.warning(message, {
            title: Singularity.i18n.t('validation_error_title') || 'تحقق من البيانات'
        });
    },
    
    addStyles() {
        if (document.getElementById('singularity-toast-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'singularity-toast-styles';
        style.textContent = `
            @keyframes toast-slide-in {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes toast-slide-out {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            @keyframes toast-progress {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
            
            .singularity-toast:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4), 0 15px 15px -5px rgba(0, 0, 0, 0.15);
            }
            
            @media (max-width: 640px) {
                #singularity-toast-container {
                    left: 1rem;
                    right: 1rem;
                    top: 1rem;
                }
                
                .singularity-toast {
                    min-width: auto !important;
                    max-width: none !important;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
};

// Integration with existing UI system
if (window.Singularity.ui) {
    window.Singularity.ui.showToast = (message, type = 'success', options = {}) => {
        return window.Singularity.toast.show(message, type, 4000, options);
    };
}