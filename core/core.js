// Singularity - Core System v4.0 (Based on LifeOS)
// Manages application state, data persistence, and initialization.

if (!Singularity) { var Singularity = {}; }

Singularity.core = {
    // Application State
    state: {
        currentModule: 'dashboard',
        data: {
            passwords: [],
            contacts: [],
            bookmarks: [],
            settings: {
                theme: 'nightfall',
                language: 'en'
            },
            security: {
                salt: null,
                testString: null
            }
        }
    },

    // State helpers for modules (بدون import/export)
    getState: function() {
        return this.state.data;
    },
    updateState: function(newState) {
        this.state.data = { ...this.state.data, ...newState };
        if (this._listeners) this._listeners.forEach(fn => fn());
    },
    subscribe: function(fn) {
        if (!this._listeners) this._listeners = [];
        this._listeners.push(fn);
        return () => {
            const idx = this._listeners.indexOf(fn);
            if (idx > -1) this._listeners.splice(idx, 1);
        };
    },

    // Initialize the application
    init: async function() {
        console.log('🚀 Singularity v4.0 Starting...');
        this.loadSettings(); // Load non-sensitive settings first
        Singularity.ui.applyTheme();

        const hasMasterPassword = !!localStorage.getItem('Singularity_Security');
        
        if (hasMasterPassword) {
            // If password exists, prompt for it.
            const password = await Singularity.ui.promptForPassword();
            if (!password) {
                Singularity.ui.showFatalError("Master password is required to access your data.");
                return;
            }
            const securityData = JSON.parse(localStorage.getItem('Singularity_Security'));
            const authenticated = await Singularity.security.authenticate(password, securityData.salt, securityData.testString);
            
            if (authenticated) {
                await this.loadEncryptedData();
                this.startApplication();
            } else {
                Singularity.ui.showFatalError("Incorrect password. Please reload the page and try again.");
            }
        } else {
            // No password set, check if there's old unencrypted data to migrate
            const oldData = localStorage.getItem('Singularity_Data');
            if (oldData) {
                // TODO: Implement migration logic for old unencrypted data
                console.warn("Found old unencrypted data. Migration is required.");
            }
            // Prompt to set a new password
            const newPassword = await Singularity.ui.promptForNewPassword();
            if (newPassword) {
                const securityPayload = await Singularity.security.setupMasterPassword(newPassword);
                this.state.data.security = securityPayload;
                localStorage.setItem('Singularity_Security', JSON.stringify(securityPayload));
                this.startApplication();
            } else {
                 Singularity.ui.showFatalError("A master password must be set to use the application.");
            }
        }
    },

    startApplication: function() {
        try {
            console.log('🚀 Starting Singularity v4.0...');
            
            // Initialize i18n first
            if (Singularity.i18n) {
                Singularity.i18n.init();
                console.log('✅ i18n initialized');
            }
            
            // Initialize router
            if (Singularity.router) {
                Singularity.router.init();
                console.log('✅ Router initialized');
            }
            
            // Initialize UI
            if (Singularity.ui) {
                Singularity.ui.init();
                console.log('✅ UI initialized');
            }
            
            // Navigate to dashboard
            if (Singularity.router) {
                Singularity.router.navigate('dashboard');
                console.log('✅ Navigated to dashboard');
            }
            
            console.log('✅ Singularity v4.0 Started Successfully');
        } catch (error) {
            console.error('❌ Error starting application:', error);
        }
    },

    loadSettings: function() {
        const settings = localStorage.getItem('Singularity_Settings');
        if (settings) {
            this.state.data.settings = JSON.parse(settings);
        }
    },

    saveSettings: function() {
        localStorage.setItem('Singularity_Settings', JSON.stringify(this.state.data.settings));
    },

    loadEncryptedData: async function() {
        const encryptedData = localStorage.getItem('Singularity_EncryptedData');
        if (encryptedData) {
            try {
                const decryptedJSON = await Singularity.security.decrypt(encryptedData, Singularity.security.encryptionKey);
                const decryptedData = JSON.parse(decryptedJSON);
                
                // Merge decrypted data into state
                this.state.data.passwords = decryptedData.passwords || [];
                this.state.data.contacts = decryptedData.contacts || [];
                this.state.data.bookmarks = decryptedData.bookmarks || [];

                console.log("Encrypted data loaded and decrypted successfully.");

            } catch (error) {
                console.error("FATAL: Could not decrypt data blob.", error);
                Singularity.ui.showFatalError("Failed to decrypt data. The data may be corrupted.");
            }
        }
    },

    saveData: async function() {
        if (!Singularity.security.isAuthenticated) {
            console.error("Cannot save data: Not authenticated.");
            Singularity.ui.showToast("Error: Not authenticated. Cannot save data.", "error");
            return;
        }

        try {
            // Prepare data blob for encryption (without settings or security info)
            const dataToEncrypt = {
                passwords: this.state.data.passwords,
                contacts: this.state.data.contacts,
                bookmarks: this.state.data.bookmarks,
            };

            const plaintext = JSON.stringify(dataToEncrypt);
            const encryptedData = await Singularity.security.encrypt(plaintext, Singularity.security.encryptionKey);
            
            localStorage.setItem('Singularity_EncryptedData', encryptedData);
            this.saveSettings(); // Save settings separately and unencrypted
            
            console.log("Data saved and encrypted successfully.");

        } catch (error) {
            console.error("FATAL: Could not encrypt and save data.", error);
            Singularity.ui.showToast("Fatal error saving data", 'error');
        }
    },

    generateId: function() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Improved debouncer function
    debounce: function(func, delay = 300) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    },
    
    // Sanitizer to prevent XSS
    sanitize: function(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
};