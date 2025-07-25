// Singularity - Passwords Module v3.0 (IRIS Project - Complete)
if (!Singularity) { var Singularity = {}; }

Singularity.passwords = {
    currentFilter: 'all',
    searchQuery: '',

    load: function() {
        this.renderLayout();
        this.renderGrid();
    },

    renderLayout: function() {
        const container = document.getElementById('passwords');
        if (container.childElementCount > 0 && container.querySelector('.filter-tags-container')) return;

        const isRTL = Singularity.i18n.isRTL();

        container.innerHTML = `
            <div class="search-filters">
                <div class="search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="passwords-search" class="search-input" placeholder="${Singularity.i18n.t('searchPasswords')}">
                </div>
                <button class="btn btn-success"><i class="fas fa-plus"></i> ${Singularity.i18n.t('addPassword')}</button>
                <button class="btn btn-secondary import-btn"><i class="fas fa-upload"></i> ${Singularity.i18n.t('importJSON')}</button>
                <input type="file" class="import-input" accept=".json" style="display:none">
            </div>
            <div id="passwords-filters" class="filter-tags-container"></div>
            <div id="passwords-grid" class="cards-grid"></div>
            <div id="passwords-empty" style="display:none; text-align:center;">
                <i class="fas fa-key" style="font-size:3rem;color:var(--text-muted);margin-bottom:1rem;"></i>
                <p style="color:var(--text-secondary);">${Singularity.i18n.t('noPasswordsMessage')}</p>
            </div>`;

        container.querySelector('.btn-success').onclick = () => this.showAddForm();
        container.querySelector('.import-btn').onclick = () => container.querySelector('.import-input').click();
        container.querySelector('.import-input').onchange = (e) => {this.handleExternalImport(e.target.files[0]); e.target.value = null;};
        container.querySelector('#passwords-search').oninput = Singularity.core.debounce((e) => { this.searchQuery = e.target.value; this.renderGrid();}, 300);
    },

    renderGrid: function() {
        const grid = document.getElementById('passwords-grid');
        const emptyMsg = document.getElementById('passwords-empty');
        grid.innerHTML = '';
        const data = this.getFilteredData();
        if (data.length === 0) {
            grid.style.display = 'none';
            emptyMsg.style.display = 'block';
        } else {
            grid.style.display = 'grid';
            emptyMsg.style.display = 'none';
            data.forEach(item => { grid.appendChild(this.createCard(item)); });
        }
        this.updateFilters();
    },

    getFilteredData: function() {
        let data = Singularity.core.state.data.passwords;
        const query = this.searchQuery.toLowerCase();
        if (query) {
            data = data.filter(item =>
                item.platform?.toLowerCase().includes(query) ||
                item.username?.toLowerCase().includes(query) ||
                (item.tags || []).some(tag => tag.toLowerCase().includes(query))
            );
        }
        if (this.currentFilter !== 'all') {
            data = data.filter(item => (item.tags || []).includes(this.currentFilter));
        }
        return data.sort((a,b) => a.platform.localeCompare(b.platform));
    },

    createCard: function(item) {
        const card = document.createElement('div');
        card.className = 'data-card';
        card.innerHTML = `
            <div class="card-content">
                <div class="card-header">
                    <i class="fas fa-shield-alt card-icon"></i>
                    <div>
                        <h3 class="card-title">${Singularity.core.sanitize(item.platform || '')}</h3>
                        <span style="font-size:0.9rem; color:var(--text-secondary); direction:ltr; text-align:left; display:block;">${Singularity.core.sanitize(item.username || '')}</span>
                    </div>
                </div>
                <div class="password-field" style="background:var(--secondary-color); padding:0.8rem; border-radius:6px; display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                    <span class="password-span" style="font-family:monospace; user-select:none; color: var(--text-primary);">••••••••••</span>
                    <div style="display:flex; gap:0.5rem;">
                        <button title="إظهار/إخفاء" class="btn btn-small btn-secondary toggle-vis-btn"><i class="fas fa-eye"></i></button>
                        <button title="نسخ كلمة المرور" class="btn btn-small btn-secondary copy-pass-btn"><i class="fas fa-copy"></i></button>
                    </div>
                </div>
                <div class="tags-container" style="display:flex;gap:0.5rem;flex-wrap:wrap; margin-top:auto;"></div>
            </div>
            <div class="card-actions"></div>`;

        const tagsContainer = card.querySelector('.tags-container');
        (item.tags || []).forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'filter-tag';
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
        });
        
        card.querySelector('.toggle-vis-btn').onclick = () => this.togglePassword(item.id, card.querySelector('.password-span'), card.querySelector('.toggle-vis-btn i'));
        card.querySelector('.copy-pass-btn').onclick = () => this.copyPassword(item.id);
        
        const actionsContainer = card.querySelector('.card-actions');
        [{icon:'fa-user-tag', title:'نسخ اسم المستخدم', action:()=>this.copyUsername(item.id)}, {icon:'fa-edit', title:'تعديل', action:()=>this.showForm(item)}, {icon:'fa-trash', title:'حذف', action:()=>this.delete(item.id), danger:true}].forEach(b => {
            const btn = document.createElement('button');
            btn.className = `btn btn-small ${b.danger ? 'btn-danger' : 'btn-secondary'}`;
            btn.title = b.title;
            btn.innerHTML = `<i class="fas ${b.icon}"></i> ${b.title}`;
            btn.onclick = b.action;
            actionsContainer.appendChild(btn);
        });
        return card;
    },

    showForm: function(item = null) {
        const isEdit = !!item;
        const form = document.createElement('form');
        form.innerHTML = `<fieldset><legend>تفاصيل الحساب</legend><div class="form-grid"><div class="form-group"><label class="form-label">المنصة/الموقع</label><input type="text" class="form-input" name="platform" required></div><div class="form-group"><label class="form-label">اسم المستخدم/البريد</label><input type="text" class="form-input" name="username" required></div></div><div class="form-group"><label class="form-label">كلمة المرور</label><input type="password" class="form-input" name="password" required></div><div class="form-group"><label class="form-label">التصنيفات (افصل بفاصلة)</label><input type="text" class="form-input" name="tags"></div></fieldset><div class="form-group"><button type="submit" class="btn btn-success" style="width: 100%;"><i class="fas fa-save"></i> ${isEdit ? 'تحديث الحساب' : 'حفظ الحساب'}</button></div>`;
        if (isEdit) { form.platform.value = item.platform || ''; form.username.value = item.username || ''; form.password.value = item.password || ''; form.tags.value = (item.tags || []).join(', '); }
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const newItem = { id: isEdit ? item.id : Singularity.core.generateId(), platform: formData.get('platform'), username: formData.get('username'), password: formData.get('password'), tags: formData.get('tags').split(',').map(t => t.trim()).filter(Boolean), created: isEdit ? (item.created || Date.now()) : Date.now(), updated: Date.now() };
            if (isEdit) { const index = Singularity.core.state.data.passwords.findIndex(p => p.id === item.id); if (index > -1) Singularity.core.state.data.passwords[index] = newItem; } else { Singularity.core.state.data.passwords.unshift(newItem); }
            await Singularity.core.saveData(); Singularity.ui.closeModal(); Singularity.ui.showToast(isEdit ? 'تم تحديث الحساب' : 'تم إضافة الحساب', 'success'); this.renderGrid(); Singularity.dashboard.load();
        });
        Singularity.ui.showModal(isEdit ? 'تعديل الحساب' : 'إضافة حساب جديد', form);
    },
    
    copyUsername: function(id) { const i = Singularity.core.state.data.passwords.find(p=>p.id===id); if(i) navigator.clipboard.writeText(i.username).then(()=>Singularity.ui.showToast('تم نسخ اسم المستخدم')).catch(()=>Singularity.ui.showToast('فشل النسخ','error')); },
    copyPassword: function(id) { const i = Singularity.core.state.data.passwords.find(p=>p.id===id); if(i) navigator.clipboard.writeText(i.password).then(()=>Singularity.ui.showToast('تم نسخ كلمة المرور')).catch(()=>Singularity.ui.showToast('فشل النسخ','error')); },
    togglePassword: function(id, el, iconEl) { const i=Singularity.core.state.data.passwords.find(p=>p.id===id); if(i){if(el.textContent==='••••••••••'){el.textContent=i.password; el.style.color = 'var(--accent-hover)'; iconEl.className='fas fa-eye-slash';}else{el.textContent='••••••••••'; el.style.color = 'var(--text-primary)'; iconEl.className='fas fa-eye';}}},
    delete: async function(id) { if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) { Singularity.core.state.data.passwords = Singularity.core.state.data.passwords.filter(p => p.id !== id); await Singularity.core.saveData(); Singularity.ui.showToast('تم حذف الحساب', 'success'); this.renderGrid(); Singularity.dashboard.load(); } },

    updateFilters: function() { const container = document.getElementById('passwords-filters'); container.innerHTML = ''; const allTags = new Set(Singularity.core.state.data.passwords.flatMap(item => item.tags || [])); const createTag = (tag) => { const tagEl = document.createElement('div'); tagEl.className = `filter-tag ${tag === this.currentFilter ? 'active' : ''}`; tagEl.dataset.filter = tag; tagEl.textContent = tag === 'all' ? 'الكل' : tag; tagEl.addEventListener('click', () => { this.currentFilter = tag; this.renderGrid(); }); return tagEl; }; container.appendChild(createTag('all')); allTags.forEach(tag => container.appendChild(createTag(tag))); },
    
    handleExternalImport: function(file) { if (!file) return; const reader = new FileReader(); reader.onload = async (e) => { try { const parsedData = this.parseJSON(e.target.result); if (parsedData.length === 0) { Singularity.ui.showToast('لم يتم العثور على بيانات صالحة في الملف', 'warning'); return; } const confirmed = await this.showImportConfirmation(parsedData); if (confirmed) { this.mergeImportedData(parsedData); await Singularity.core.saveData(); Singularity.ui.showToast(`تم دمج ${parsedData.length} حساب بنجاح`, 'success'); this.renderGrid(); Singularity.dashboard.load(); } } catch (error) { console.error("External import failed:", error); Singularity.ui.showToast('فشل في معالجة الملف', 'error'); } }; reader.readAsText(file); },
    showImportConfirmation: function(data) { return new Promise(resolve => { const content = document.createElement('div'); content.innerHTML = `<p class="mb-2">تم العثور على <strong>${data.length}</strong> حساب في الملف. هل تود إضافتها؟</p><h4 class="mb-1 mt-3">عينة:</h4><div style="background: var(--bg-color); padding: 0.8rem; border-radius: 8px; font-size: 0.9rem; max-height: 150px; overflow-y: auto;">${data.slice(0, 5).map(item => `<div><strong>${Singularity.core.sanitize(item.platform || '')}</strong> - ${Singularity.core.sanitize(item.username || '')}</div>`).join('')}</div><div class="flex gap-2 mt-3"><button class="btn btn-success confirm-btn" style="flex:1;"><i class="fas fa-check"></i> تأكيد الدمج</button><button class="btn btn-danger cancel-btn" style="flex:1;"><i class="fas fa-times"></i> إلغاء</button></div>`; content.querySelector('.confirm-btn').onclick = () => { Singularity.ui.closeModal(); resolve(true); }; content.querySelector('.cancel-btn').onclick = () => { Singularity.ui.closeModal(); resolve(false); }; Singularity.ui.showModal('تأكيد استيراد البيانات الخارجية', content); }); },
    mergeImportedData: function(dataToMerge) { dataToMerge.forEach(item => { const newItem = { id: Singularity.core.generateId(), platform: item.platform || item.name || 'غير معروف', username: item.username || item.login?.username || '', password: item.password || item.login?.password || '', tags: item.tags ? [...new Set([...item.tags, 'مستورد'])] : ['مستورد'], created: Date.now(), updated: Date.now() }; if (!newItem.platform || !newItem.username || !newItem.password) return; const exists = Singularity.core.state.data.passwords.some(p => p.platform === newItem.platform && p.username === newItem.username); if (!exists) { Singularity.core.state.data.passwords.push(newItem); } }); },
    parseJSON: function(content) { try { const data = JSON.parse(content); if (Array.isArray(data)) return data; if (data.passwords && Array.isArray(data.passwords)) return data.passwords; if (data.items && Array.isArray(data.items)) { return data.items.filter(i => i.type === 1 && i.login).map(i => ({ platform: i.name, username: i.login.username, password: i.login.password, })); } return []; } catch { return []; } }
};
