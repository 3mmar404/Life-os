// Singularity - Internationalization System v1.0
// Advanced translation and localization system

if (!Singularity) { var Singularity = {}; }

Singularity.i18n = {
    currentLanguage: 'en',
    
    init: function() {
        // Load saved language preference
        try {
            const savedLang = (Singularity.core.state && Singularity.core.state.data && Singularity.core.state.data.settings) 
                ? Singularity.core.state.data.settings.language || 'en' 
                : 'en';
            this.setLanguage(savedLang);
        } catch (error) {
            console.warn('Could not load saved language, using default:', error);
            this.setLanguage('en');
        }
    },
    
    setLanguage: function(lang) {
        if (!Singularity.strings[lang]) {
            console.warn(`Language '${lang}' not found, falling back to English`);
            lang = 'en';
        }
        
        this.currentLanguage = lang;
        
        // Save language preference safely
        try {
            if (Singularity.core.state && Singularity.core.state.data && Singularity.core.state.data.settings) {
                Singularity.core.state.data.settings.language = lang;
            }
        } catch (error) {
            console.warn('Could not save language preference:', error);
        }
        
        // Update HTML attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        
        // Update page title
        document.title = this.t('appName') + ' - ' + this.t('appTagline');
        
        // Translate all existing UI elements
        this.translateUI();
        
        // Save settings safely
        try {
            if (Singularity.core.saveSettings) {
                Singularity.core.saveSettings();
            }
        } catch (error) {
            console.warn('Could not save settings:', error);
        }
        
        // Refresh current module to apply translations
        try {
            if (Singularity.core.state && Singularity.core.state.currentModule && Singularity[Singularity.core.state.currentModule]) {
                Singularity[Singularity.core.state.currentModule].load();
            }
        } catch (error) {
            console.warn('Could not refresh current module:', error);
        }
    },
    
    // Get translated string
    t: function(key, params = {}) {
        const strings = Singularity.strings[this.currentLanguage] || Singularity.strings.en;
        let text = strings[key] || key;
        
        // Replace parameters in text
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });
        
        return text;
    },
    
    // Translate all UI elements with data-i18n attribute
    translateUI: function() {
        // Translate navigation
        const navItems = {
            'dashboard': 'dashboard',
            'passwords': 'passwords',
            'contacts': 'contacts',
            'bookmarks': 'bookmarks',
            'tools': 'tools'
        };
        
        Object.keys(navItems).forEach(module => {
            const navTab = document.querySelector(`.nav-tab[data-module="${module}"]`);
            if (navTab) {
                const textElement = navTab.querySelector('.nav-text');
                if (textElement) {
                    textElement.textContent = this.t(navItems[module]);
                }
            }
        });
        
        // Translate header elements
        const appLogo = document.querySelector('.app-logo .logo-text');
        if (appLogo) {
            appLogo.textContent = this.t('appName');
        }
        
        // Translate common buttons and elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'password' || element.type === 'search')) {
                element.placeholder = this.t(key);
            } else {
                element.textContent = this.t(key);
            }
        });
        
        // Update language switcher
        this.updateLanguageSwitcher();
    },
    
    updateLanguageSwitcher: function() {
        const langSwitcher = document.getElementById('lang-switcher');
        if (!langSwitcher) return;
        
        langSwitcher.innerHTML = `
            <select onchange="Singularity.i18n.setLanguage(this.value)" class="form-select">
                <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>English</option>
                <option value="ar" ${this.currentLanguage === 'ar' ? 'selected' : ''}>العربية</option>
            </select>
        `;
    },
    
    // Format numbers according to locale
    formatNumber: function(number) {
        return new Intl.NumberFormat(this.currentLanguage === 'ar' ? 'ar-EG' : 'en-US').format(number);
    },
    
    // Format dates according to locale
    formatDate: function(date, options = {}) {
        const locale = this.currentLanguage === 'ar' ? 'ar-EG' : 'en-US';
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(new Date(date));
    },
    
    // Format relative time (e.g., "2 hours ago")
    formatRelativeTime: function(date) {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);
        
        if (diffInSeconds < 60) return this.t('now');
        if (diffInSeconds < 3600) return Math.floor(diffInSeconds / 60) + (this.currentLanguage === 'ar' ? ' دقيقة' : ' minutes ago');
        if (diffInSeconds < 86400) return Math.floor(diffInSeconds / 3600) + (this.currentLanguage === 'ar' ? ' ساعة' : ' hours ago');
        if (diffInSeconds < 604800) return Math.floor(diffInSeconds / 86400) + (this.currentLanguage === 'ar' ? ' يوم' : ' days ago');
        
        return this.formatDate(date);
    },
    
    // Get available languages
    getAvailableLanguages: function() {
        return Object.keys(Singularity.strings);
    },
    
    // Check if current language is RTL
    isRTL: function() {
        return this.currentLanguage === 'ar';
    }
};