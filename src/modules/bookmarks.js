// Singularity - Bookmarks Module v3.0 (IRIS Project - Complete)
if (!Singularity) { var Singularity = {}; }
import { getState, updateState, subscribe } from '../core/state.js';
import { db } from '../core/db.js';

Singularity.bookmarks = {
    currentFilter: 'all',
    searchQuery: '',

    load: function() {
        this.renderLayout();
        subscribe(() => this.renderGrid());
        this.renderGrid();
    },

    renderLayout: function() {
        const container = document.getElementById('bookmarks');
        if (container.childElementCount > 0 && container.querySelector('.filter-tags-container')) return;
        
        const isRTL = Singularity.i18n.isRTL();
        
        container.innerHTML = `
            <div class="search-filters">
                <div class="search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="bookmarks-search" placeholder="${Singularity.i18n.t('searchBookmarks')}" class="search-input">
                </div>
                <button class="btn btn-success">
                    <i class="fas fa-plus"></i> ${Singularity.i18n.t('addBookmark')}
                </button>
                <button class="btn btn-secondary import-btn">
                    <i class="fas fa-upload"></i> ${Singularity.i18n.t('importBookmarks')}
                </button>
                <input type="file" class="import-input" accept=".json,.html" style="display:none;">
            </div>
            <div id="bookmarks-filters" class="filter-tags-container"></div>
            <div id="bookmarks-grid" class="cards-grid"></div>
            <div id="bookmarks-empty" style="display:none; text-align:center;">
                <i class="fas fa-bookmark" style="font-size:3rem;color:var(--text-muted);margin-bottom:1rem;"></i>
                <p style="color:var(--text-secondary)">${Singularity.i18n.t('noBookmarksMessage')}</p>
            </div>
        `;
        container.querySelector('.btn-success').onclick = () => this.showAddForm();
        container.querySelector('.import-btn').onclick = () => container.querySelector('.import-input').click();
        container.querySelector('.import-input').onchange = e => { this.handleExternalImport(e.target.files[0]); e.target.value = null; };
        container.querySelector('#bookmarks-search').oninput = Singularity.core.debounce(e => { this.searchQuery = e.target.value; this.renderGrid(); }, 300);
    },

    renderGrid: function() {
        const grid = document.getElementById('bookmarks-grid');
        const emptyMsg = document.getElementById('bookmarks-empty');
        grid.innerHTML = '';
        const data = getState().bookmarks || [];
        const filtered = this.getFilteredData(data);
        if (filtered.length === 0) {
            grid.style.display = 'none';
            emptyMsg.style.display = 'block';
        } else {
            grid.style.display = 'grid';
            emptyMsg.style.display = 'none';
            filtered.forEach(item => { grid.appendChild(this.createCard(item)); });
        }
        this.updateFilters();
    },

    getFilteredData: function() {
        let data = arguments[0] || getState().bookmarks;
        const query = this.searchQuery.toLowerCase();
        if (query) { data = data.filter(item => item.title?.toLowerCase().includes(query) || item.url?.toLowerCase().includes(query) || (item.categories || []).some(cat => cat.toLowerCase().includes(query))); }
        if (this.currentFilter !== 'all') { data = data.filter(item => (item.categories || []).includes(this.currentFilter)); }
        return data.sort((a,b) => a.title.localeCompare(b.title));
    },

    createCard: function(item) {
        const card = document.createElement('div');
        card.className = 'data-card';
        const domain = (item.url.startsWith('http')) ? new URL(item.url).hostname : 'link.invalid';
        const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain_url=${domain}`;
        
        card.innerHTML = `
            <div class="card-content">
                <div class="card-header" style="align-items:flex-start; gap:0.8rem;">
                    <img src="${faviconUrl}" style="width:24px; height:24px; border-radius:4px; margin-top:5px; background:var(--secondary-color);" alt="" onerror="this.style.display='none'">
                    <div style="flex:1">
                        <h3 class="card-title">${Singularity.core.sanitize(item.title || '')}</h3>
                        <a href="${item.url}" target="_blank" style="font-size:0.9rem; color:var(--text-secondary); word-break:break-all; text-decoration:none;">${domain}</a>
                    </div>
                </div>
                <div class="tags-container" style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border-color); display:flex; gap:0.5rem; flex-wrap:wrap;"></div>
            </div>
            <div class="card-actions"></div>`;

        const tagsContainer = card.querySelector('.tags-container');
        (item.categories || []).forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'filter-tag';
            tagEl.textContent = tag;
            tagsContainer.appendChild(tagEl);
        });

        const actionsContainer = card.querySelector('.card-actions');
        [{ icon: 'fa-external-link-alt', title: 'فتح الرابط', action: () => window.open(item.url, '_blank') }, { icon: 'fa-copy', title: 'نسخ الرابط', action: () => this.copyUrl(item.id) }, { icon: 'fa-edit', title: 'تعديل', action: () => this.showForm(item) }, { icon: 'fa-trash', title: 'حذف', action: () => this.delete(item.id), danger: true }].forEach(b => {
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
        form.innerHTML = `<fieldset><legend>تفاصيل الرابط</legend><div class="form-group"><label class="form-label">عنوان الرابط</label><input type="text" class="form-input" name="title" required></div><div class="form-group"><label class="form-label">الرابط (URL)</label><input type="url" class="form-input" name="url" required></div><div class="form-group"><label class="form-label">التصنيفات (افصل بفاصلة)</label><input type="text" class="form-input" name="categories"></div></fieldset><div class="form-group"><button type="submit" class="btn btn-success" style="width: 100%;"><i class="fas fa-save"></i> ${isEdit ? 'تحديث الرابط' : 'حفظ الرابط'}</button></div>`;
        if (isEdit) { form.title.value = item.title || ''; form.url.value = item.url || ''; form.categories.value = (item.categories || []).join(', '); }
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const newItem = { id: isEdit ? item.id : Singularity.core.generateId(), title: formData.get('title'), url: formData.get('url'), categories: formData.get('categories').split(',').map(c => c.trim()).filter(Boolean), created: isEdit ? (item.created || Date.now()) : Date.now(), updated: Date.now() };
            let updatedBookmarks;
            if (isEdit) {
                updatedBookmarks = getState().bookmarks.map(b => b.id === item.id ? newItem : b);
            } else {
                updatedBookmarks = [newItem, ...getState().bookmarks];
            }
            updateState({ bookmarks: updatedBookmarks });
            // تحديث قاعدة البيانات
            if (isEdit) {
                await db.bookmarks.put(newItem);
            } else {
                await db.bookmarks.add(newItem);
            }
            Singularity.ui.closeModal();
            Singularity.ui.showToast(isEdit ? 'تم تحديث الرابط' : 'تم إضافة الرابط', 'success');
            Singularity.dashboard.load();
        });
        Singularity.ui.showModal(isEdit ? 'تعديل الرابط' : 'إضافة رابط', form);
    },
    
    copyUrl: function(id) { const i = Singularity.core.state.data.bookmarks.find(b => b.id === id); if (i) navigator.clipboard.writeText(i.url).then(() => Singularity.ui.showToast('تم نسخ الرابط')).catch(() => Singularity.ui.showToast('فشل النسخ', 'error')); },
    delete: async function(id) { if (confirm('هل أنت متأكد من حذف هذا الرابط؟')) { Singularity.core.state.data.bookmarks = Singularity.core.state.data.bookmarks.filter(b => b.id !== id); await Singularity.core.saveData(); Singularity.ui.showToast('تم حذف الرابط', 'success'); this.renderGrid(); Singularity.dashboard.load(); } },
    delete: async function(id) {
        if (confirm('هل أنت متأكد من حذف هذا الرابط؟')) {
            const updatedBookmarks = getState().bookmarks.filter(b => b.id !== id);
            updateState({ bookmarks: updatedBookmarks });
            await db.bookmarks.delete(id);
            Singularity.ui.showToast('تم حذف الرابط', 'success');
            Singularity.dashboard.load();
        }
    },
    updateFilters: function() { const container = document.getElementById('bookmarks-filters'); container.innerHTML = ''; const allTags = new Set(Singularity.core.state.data.bookmarks.flatMap(item => item.categories || [])); const createTag = (tag) => { const tagEl = document.createElement('div'); tagEl.className = `filter-tag ${tag === this.currentFilter ? 'active' : ''}`; tagEl.dataset.filter = tag; tagEl.textContent = tag === 'all' ? 'الكل' : tag; tagEl.addEventListener('click', () => { this.currentFilter = tag; this.renderGrid(); }); return tagEl; }; container.appendChild(createTag('all')); allTags.forEach(tag => container.appendChild(createTag(tag))); },

    handleExternalImport: function(file) { if (!file) return; const reader = new FileReader(); reader.onload = async (e) => { try { let parsedData = []; if (file.name.endsWith('.json')) { parsedData = this.parseJSON(e.target.result); } else if (file.name.endsWith('.html')) { parsedData = this.parseHTML(e.target.result); } if (parsedData.length === 0) { Singularity.ui.showToast('لم يتم العثور على روابط صالحة في الملف', 'warning'); return; } const confirmed = await this.showImportConfirmation(parsedData); if (confirmed) { this.mergeImportedData(parsedData); await Singularity.core.saveData(); Singularity.ui.showToast(`تم دمج ${parsedData.length} رابط بنجاح`, 'success'); this.renderGrid(); Singularity.dashboard.load(); } } catch (error) { console.error("External import failed:", error); Singularity.ui.showToast('فشل في معالجة الملف', 'error'); } }; reader.readAsText(file); },
    showImportConfirmation: function(data) { return new Promise(resolve => { const content = document.createElement('div'); content.innerHTML = `<p class="mb-2">تم العثور على <strong>${data.length}</strong> رابط في الملف. هل تود إضافتها؟</p><h4 class="mb-1 mt-3">عينة:</h4><div style="background: var(--bg-color); padding: 0.8rem; border-radius: 8px; font-size: 0.9rem; max-height: 150px; overflow-y: auto; text-align:left; direction: ltr;">${data.slice(0, 5).map(item => `<div><strong>${Singularity.core.sanitize(item.title)}</strong></div>`).join('')}</div><div class="flex gap-2 mt-3"><button class="btn btn-success confirm-btn" style="flex:1;"><i class="fas fa-check"></i> تأكيد الدمج</button><button class="btn btn-danger cancel-btn" style="flex:1;"><i class="fas fa-times"></i> إلغاء</button></div>`; content.querySelector('.confirm-btn').onclick = () => { Singularity.ui.closeModal(); resolve(true); }; content.querySelector('.cancel-btn').onclick = () => { Singularity.ui.closeModal(); resolve(false); }; Singularity.ui.showModal('تأكيد استيراد البيانات الخارجية', content); }); },
    mergeImportedData: function(dataToMerge) { dataToMerge.forEach(item => { if (!item.title || !item.url) return; const newItem = { id: Singularity.core.generateId(), title: item.title, url: item.url, categories: item.categories ? [...new Set([...item.categories, 'مستورد'])] : ['مستورد'], created: Date.now(), updated: Date.now() }; const exists = Singularity.core.state.data.bookmarks.some(b => b.url === newItem.url); if (!exists) { Singularity.core.state.data.bookmarks.push(newItem); } }); },
    parseJSON: function(content) { try { const data = JSON.parse(content); if (Array.isArray(data)) return data; if (data.bookmarks && Array.isArray(data.bookmarks)) return data.bookmarks; return []; } catch { return []; } },
    parseHTML: function(html) { const bookmarks = []; const parser = new DOMParser(); const doc = parser.parseFromString(html, 'text/html'); const links = doc.querySelectorAll('a[href]'); links.forEach(link => { const title = link.textContent.trim(); const url = link.getAttribute('href'); if (title && url && url.startsWith('http')) { bookmarks.push({ title, url }); } }); return bookmarks; }
};
