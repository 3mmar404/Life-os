// Singularity - Dashboard Module v3.0 (Command & Control Center)
if (!Singularity) { var Singularity = {}; }

Singularity.dashboard = {
    load: function() {
        this.renderLayout();
        this.updateStats();
        this.loadRecentActivity();
    },

    renderLayout: function() {
        const container = document.getElementById('dashboard');
        // Self-healing: if layout is already present but incomplete (e.g., from an old version), re-render.
        if (container.childElementCount > 0 && !container.querySelector('.welcome-header')) {
            container.innerHTML = '';
        }
        if (container.childElementCount > 0) return; // Already rendered correctly

        const isRTL = Singularity.i18n.isRTL();
        
        container.innerHTML = `
            <h2 class="welcome-header" style="margin-bottom: 2rem;">${Singularity.i18n.t('dashboardWelcome')}</h2>
            <div class="dashboard-grid">
                <div class="dashboard-card">
                    <div class="card-header"><i class="card-icon fas fa-key"></i><h3 class="card-title">${Singularity.i18n.t('passwords')}</h3></div>
                    <div class="card-stats">
                        <div class="stat-item"><div class="stat-number" id="passwords-count">0</div><div class="stat-label">${Singularity.i18n.t('items')}</div></div>
                        <div class="stat-item"><div class="stat-number" id="passwords-categories">0</div><div class="stat-label">${Singularity.i18n.t('categories')}</div></div>
                    </div>
                    <div class="card-actions"><button class="btn btn-small" onclick="Singularity.router.navigate('passwords')"><i class="fas fa-arrow-${isRTL ? 'left' : 'right'}"></i> ${Singularity.i18n.t('manage')}</button></div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><i class="card-icon fas fa-address-book"></i><h3 class="card-title">${Singularity.i18n.t('contacts')}</h3></div>
                    <div class="card-stats">
                        <div class="stat-item"><div class="stat-number" id="contacts-count">0</div><div class="stat-label">${Singularity.i18n.t('items')}</div></div>
                        <div class="stat-item"><div class="stat-number" id="contacts-recent">0</div><div class="stat-label">${Singularity.i18n.t('recentlyAdded')}</div></div>
                    </div>
                     <div class="card-actions"><button class="btn btn-small" onclick="Singularity.router.navigate('contacts')"><i class="fas fa-arrow-${isRTL ? 'left' : 'right'}"></i> ${Singularity.i18n.t('manage')}</button></div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><i class="card-icon fas fa-bookmark"></i><h3 class="card-title">${Singularity.i18n.t('bookmarks')}</h3></div>
                    <div class="card-stats">
                        <div class="stat-item"><div class="stat-number" id="bookmarks-count">0</div><div class="stat-label">${Singularity.i18n.t('items')}</div></div>
                        <div class="stat-item"><div class="stat-number" id="bookmarks-categories">0</div><div class="stat-label">${Singularity.i18n.t('categories')}</div></div>
                    </div>
                     <div class="card-actions"><button class="btn btn-small" onclick="Singularity.router.navigate('bookmarks')"><i class="fas fa-arrow-${isRTL ? 'left' : 'right'}"></i> ${Singularity.i18n.t('manage')}</button></div>
                </div>
                <div class="dashboard-card">
                    <div class="card-header"><i class="card-icon fas fa-hdd"></i><h3 class="card-title">${Singularity.i18n.t('systemStats')}</h3></div>
                    <div class="card-stats">
                        <div class="stat-item"><div class="stat-number" id="total-items">0</div><div class="stat-label">${Singularity.i18n.t('totalItems')}</div></div>
                        <div class="stat-item"><div class="stat-number" id="storage-used">0</div><div class="stat-label">KB ${isRTL ? '(مشفّر)' : '(encrypted)'}</div></div>
                    </div>
                </div>
            </div>
            <div class="dashboard-card" style="margin-top: 2rem;">
                <div class="card-header"><i class="card-icon fas fa-history"></i><h3 class="card-title">${Singularity.i18n.t('recentActivity')}</h3></div>
                <div id="recent-activity-container" style="display: flex; flex-direction: column; gap: 0.8rem;">
                    <p class="text-center" style="color: var(--text-secondary);"><i class="fas fa-info-circle"></i> ${Singularity.i18n.t('noRecentActivity')}</p>
                </div>
            </div>
        `;
    },

    updateStats: function() {
        const { passwords, contacts, bookmarks } = Singularity.core.state.data;
        document.getElementById('passwords-count').textContent = passwords.length;
        document.getElementById('contacts-count').textContent = contacts.length;
        document.getElementById('bookmarks-count').textContent = bookmarks.length;
        document.getElementById('total-items').textContent = passwords.length + contacts.length + bookmarks.length;
        
        const passCats = new Set(passwords.flatMap(p => p.tags || []));
        document.getElementById('passwords-categories').textContent = passCats.size;
        
        const recentContacts = contacts.filter(c => new Date(c.created || 0) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
        document.getElementById('contacts-recent').textContent = recentContacts;
        
        const bookCats = new Set(bookmarks.flatMap(b => b.categories || []));
        document.getElementById('bookmarks-categories').textContent = bookCats.size;

        const encryptedData = localStorage.getItem('Singularity_EncryptedData');
        const storageUsed = encryptedData ? Math.round(encryptedData.length / 1024) : 0;
        document.getElementById('storage-used').textContent = storageUsed;
    },

    loadRecentActivity: function() {
        const activityContainer = document.getElementById('recent-activity-container');
        const allItems = [
            ...Singularity.core.state.data.passwords.map(p => ({ type: 'password', name: p.platform, date: p.updated || p.created })),
            ...Singularity.core.state.data.contacts.map(c => ({ type: 'contact', name: c.name, date: c.updated || c.created })),
            ...Singularity.core.state.data.bookmarks.map(b => ({ type: 'bookmark', name: b.title, date: b.updated || b.created }))
        ];

        const recent = allItems
            .filter(item => item.date)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        activityContainer.innerHTML = '';
        if (recent.length === 0) {
            const placeholder = document.createElement('p');
            placeholder.className = 'text-center';
            placeholder.style.color = 'var(--text-secondary)';
            placeholder.innerHTML = `<i class="fas fa-info-circle"></i> لا توجد أنشطة حديثة`;
            activityContainer.appendChild(placeholder);
            return;
        }

        const icons = {
            password: 'fas fa-key',
            contact: 'fas fa-address-book',
            bookmark: 'fas fa-bookmark'
        };

        recent.forEach(item => {
            const activityElement = document.createElement('div');
            activityElement.style.cssText = "display: flex; align-items: center; gap: 1rem; padding: 0.8rem; background-color: var(--secondary-color); border-radius: var(--border-radius); border-left: 3px solid var(--accent-color)";
            
            const icon = document.createElement('i');
            icon.className = `${icons[item.type]} card-icon`;
            icon.style.fontSize = '1.2rem';

            const textDiv = document.createElement('div');
            textDiv.style.flex = '1';

            const nameDiv = document.createElement('div');
            nameDiv.style.fontWeight = '500';
            nameDiv.textContent = item.name || 'عنصر';

            const dateDiv = document.createElement('div');
            dateDiv.style.color = 'var(--text-secondary)';
            dateDiv.style.fontSize = '0.9rem';
            dateDiv.textContent = this._getRelativeTime(item.date);

            textDiv.append(nameDiv, dateDiv);
            activityElement.append(icon, textDiv);
            activityContainer.appendChild(activityElement);
        });
    },
    
    _getRelativeTime: function(date) {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now - past) / 1000);

        const intervals = {
            'عام': 31536000,
            'شهر': 2592000,
            'أسبوع': 604800,
            'يوم': 86400,
            'ساعة': 3600,
            'دقيقة': 60
        };

        if (diffInSeconds < 30) return "الآن";
        if (diffInSeconds < 60) return `قبل ${diffInSeconds} ثانية`;
        
        for (const [intervalName, secondsInInterval] of Object.entries(intervals)) {
            const intervalCount = Math.floor(diffInSeconds / secondsInInterval);
            if (intervalCount >= 1) {
                if(intervalCount === 1) return `منذ ${intervalName}`;
                if(intervalCount === 2) return `منذ ${intervalName.replace('ا','').replace('و','ي')}ين`;
                if(intervalCount > 2 && intervalCount < 11) {
                    if(intervalName === 'عام') return `منذ ${intervalCount} أعوام`;
                    if(intervalName === 'شهر') return `منذ ${intervalCount} أشهر`;
                    return `منذ ${intervalCount} ${intervalName === 'أسبوع' ? 'أسابيع' : intervalName === 'يوم' ? 'أيام' : intervalName + 'ات' }`;
                }
                return `منذ ${intervalCount} ${intervalName}`;
            }
        }
        return `قبل ${diffInSeconds} ثانية`;
    }
};
