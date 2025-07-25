// Singularity - UI Module v4.0 (Based on LifeOS)
if (!Singularity) { var Singularity = {}; }

Singularity.ui = {
    init: function() {
        // Event listeners for static UI elements
        document.querySelector('.theme-toggle').addEventListener('click', this.toggleTheme.bind(this));
        
        // Settings button navigation
        document.querySelector('.settings-btn').addEventListener('click', () => Singularity.router.navigate('tools'));
        
        // Modal close on outside click
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('modal')) {
                this.closeModal();
            }
        });

        // Initialize language switcher and theme
        this.buildLangSwitcher();
        this.applyTheme();
    },

    buildLangSwitcher: function() {
        const langSwitcher = document.getElementById('lang-switcher');
        if (!langSwitcher) return;

        langSwitcher.innerHTML = `
            <select onchange="Singularity.i18n.setLanguage(this.value)" class="form-select">
                <option value="en" ${Singularity.core.state.data.settings.language === 'en' ? 'selected' : ''}>English</option>
                <option value="ar" ${Singularity.core.state.data.settings.language === 'ar' ? 'selected' : ''}>العربية</option>
            </select>
        `;
    },
    
    showModal: function(title, content) {
        document.querySelector('.modal-title').textContent = title;
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = '';
        if (typeof content === 'string') {
            modalBody.innerHTML = content;
        } else {
            modalBody.appendChild(content);
        }
        document.getElementById('modal').classList.add('active');
    },

    closeModal: function() {
        document.getElementById('modal').classList.remove('active');
    },

    showToast: function(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = document.querySelector('.toast-message');
        messageEl.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    },

    applyTheme: function() {
        const theme = Singularity.core.state.data.settings.theme;
        const themeIcon = document.querySelector('.theme-toggle i');

        if (theme === 'light') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-palette';
        }
    },

    toggleTheme: function() {
        this.showToast('Theme switching will be added in future updates', 'warning');
    },

    promptForPassword: function() {
        return new Promise(resolve => {
            const form = document.createElement('form');
            form.innerHTML = `
                <p class="mb-2" style="color: var(--text-secondary);">${Singularity.i18n.t('enterPassword')}</p>
                <div class="form-group">
                    <label class="form-label">${Singularity.i18n.t('masterPassword')}</label>
                    <input type="password" class="form-input" id="auth-password" required>
                </div>
                <button type="submit" class="btn btn-success" style="width: 100%;">
                    <i class="fas fa-unlock-alt"></i> ${Singularity.i18n.t('unlockVault')}
                </button>
            `;
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const password = document.getElementById('auth-password').value;
                this.closeModal();
                resolve(password);
            });
            this.showModal(Singularity.i18n.t('authRequired'), form);
            document.getElementById('auth-password').focus();
        });
    },

    promptForNewPassword: function() {
        return new Promise(resolve => {
            const form = document.createElement('form');
            form.innerHTML = `
                <p class="mb-2" style="color: var(--text-secondary);">${Singularity.i18n.t('welcomeMessage')}</p>
                <div class="form-group">
                    <label class="form-label">${Singularity.i18n.t('newMasterPassword')}</label>
                    <input type="password" class="form-input" id="new-master-password" required minlength="8">
                </div>
                <div class="form-group">
                    <label class="form-label">${Singularity.i18n.t('confirmPassword')}</label>
                    <input type="password" class="form-input" id="confirm-master-password" required>
                </div>
                <button type="submit" class="btn btn-success" style="width: 100%;">
                    <i class="fas fa-shield-halved"></i> ${Singularity.i18n.t('setAndEncrypt')}
                </button>
            `;
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const newPass = document.getElementById('new-master-password').value;
                const confirmPass = document.getElementById('confirm-master-password').value;
                if (newPass.length < 8) { 
                    this.showToast(Singularity.i18n.t('passwordTooShort'), "error"); 
                    return; 
                }
                if (newPass !== confirmPass) { 
                    this.showToast(Singularity.i18n.t('passwordMismatch'), "error"); 
                    return; 
                }
                this.closeModal();
                resolve(newPass);
            });
            this.showModal(Singularity.i18n.t('setupDigitalFortress'), form);
            document.getElementById('new-master-password').focus();
        });
    },

    showFatalError: function(message) {
        document.body.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:center; height:100vh; flex-direction:column; padding: 2rem; text-align:center; background-color: var(--bg-color); color: var(--text-primary);">
                <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: var(--danger-color); margin-bottom: 1rem;"></i>
                <h1 style="color: var(--danger-color);">Fatal Error</h1>
                <p style="font-size: 1.2rem; margin-top: 1rem;">${message}</p>
            </div>
        `;
    }
};