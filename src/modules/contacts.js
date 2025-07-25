// Singularity - Contacts Module v6.0 (Project PHOENIX - High-Fidelity & Tactical UI)
if (!Singularity) { var Singularity = {}; }
import { getState, updateState, subscribe } from '../core/state.js';
import { db } from '../core/db.js';

Singularity.contacts = {
    currentFilter: 'all', searchQuery: '', viewMode: 'dossier', // dossier or list
    
    load: function() { this.renderLayout(); this.renderGrid(); },
    load: function() {
        this.renderLayout();
        subscribe(() => this.renderGrid());
        this.renderGrid();
    },
    
    renderLayout: function() {
        const container = document.getElementById('contacts');
        if (container.childElementCount > 0 && container.querySelector('.view-mode-toggle')) return;
        
        const isRTL = Singularity.i18n.isRTL();
        
        container.innerHTML = `
            <div class="search-filters">
                <div class="search-box">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" class="search-input" id="contacts-search" placeholder="${Singularity.i18n.t('searchContacts')}">
                </div>
                <div class="view-mode-toggle">
                    <button class="btn btn-small" data-view="dossier" title="${Singularity.i18n.t('cardView')}">
                        <i class="fas fa-th-large"></i>
                    </button>
                    <button class="btn btn-small" data-view="list" title="${Singularity.i18n.t('listView')}">
                        <i class="fas fa-list"></i>
                    </button>
                </div>
                <button class="btn btn-success">
                    <i class="fas fa-plus"></i> ${Singularity.i18n.t('addContact')}
                </button>
                <button class="btn btn-secondary import-btn">
                    <i class="fas fa-upload"></i> ${Singularity.i18n.t('importCSV')}
                </button>
                <input type="file" class="import-input" accept=".csv" style="display: none;">
            </div>
            <div class="filter-tags-container" id="contacts-filters"></div>
            <div id="contacts-grid"></div>
            <div class="text-center" id="contacts-empty" style="display: none;">
                <i class="fas fa-address-book" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary);">${Singularity.i18n.t('noContactsMessage')}</p>
            </div>
        `;
        
        container.querySelector('.btn-success').addEventListener('click', () => this.showForm());
        container.querySelector('.import-btn').addEventListener('click', () => container.querySelector('.import-input').click());
        container.querySelector('.import-input').addEventListener('change', (e) => { this.handleExternalImport(e.target.files[0]); e.target.value = null; });
        container.querySelector('#contacts-search').addEventListener('input', Singularity.core.debounce((e) => { this.searchQuery = e.target.value; this.renderGrid(); }, 300));
        
        container.querySelectorAll('.view-mode-toggle button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.viewMode = btn.dataset.view;
                this.renderGrid();
                this._updateViewModeToggle();
            });
        });
        this._updateViewModeToggle();
    },
    
    _updateViewModeToggle: function() {
        document.querySelectorAll('.view-mode-toggle button').forEach(btn => {
            btn.classList.toggle('active', this.viewMode === btn.dataset.view);
            // Quick CSS for active state without needing CSS file update
            btn.style.backgroundColor = (this.viewMode === btn.dataset.view) ? 'var(--accent-color)' : '';
            btn.style.color = (this.viewMode === btn.dataset.view) ? '#0d1117' : '';
        });
        const grid = document.getElementById('contacts-grid');
        grid.className = this.viewMode === 'dossier' ? 'cards-grid' : 'list-view-grid';
        if (this.viewMode === 'list') grid.style.cssText = 'display: flex; flex-direction: column; gap: 0.5rem;'; else grid.style.cssText = ''; // Reset for grid
    },
    
    renderGrid: function() {
        const grid = document.getElementById('contacts-grid');
        const emptyMsg = document.getElementById('contacts-empty');
        grid.innerHTML = '';
        const data = getState().contacts || [];
        const filtered = this.getFilteredData(data);
        if (filtered.length === 0) {
            grid.style.display = 'none';
            emptyMsg.style.display = 'block';
        } else {
            grid.style.display = this.viewMode === 'list' ? 'flex' : 'grid';
            emptyMsg.style.display = 'none';
            filtered.forEach(item => {
                const element = (this.viewMode === 'dossier') ? this.createCard(item) : this.createListItem(item);
                grid.appendChild(element);
            });
        }
        this.updateFilters();
    },

    getFilteredData: function() { let data = Singularity.core.state.data.contacts; const query = this.searchQuery.toLowerCase(); if (query) { data = data.filter(item => Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(query)) || (item.organization && Object.values(item.organization).some(val => val.toLowerCase().includes(query))) || (item.phones || []).some(p => p.value.toLowerCase().includes(query)) || (item.emails || []).some(e => e.value.toLowerCase().includes(query))); } if (this.currentFilter !== 'all') { data = data.filter(item => (item.labels || []).includes(this.currentFilter)); } return data.sort((a,b) => a.name.localeCompare(b.name, 'ar')); },
    getFilteredData: function(data) {
        data = data || getState().contacts;
        const query = this.searchQuery.toLowerCase();
        if (query) {
            data = data.filter(item =>
                Object.values(item).some(val => typeof val === 'string' && val.toLowerCase().includes(query)) ||
                (item.organization && Object.values(item.organization).some(val => val && val.toLowerCase().includes(query))) ||
                (item.phones || []).some(p => p.value && p.value.toLowerCase().includes(query)) ||
                (item.emails || []).some(e => e.value && e.value.toLowerCase().includes(query))
            );
        }
        if (this.currentFilter !== 'all') {
            data = data.filter(item => (item.labels || []).includes(this.currentFilter));
        }
        return data.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    },

    createCard: function(item) {
        const card = document.createElement('div'); card.className = 'data-card';
        let photoHTML = `<div class="contact-initials" style="width:60px;height:60px;background:var(--secondary-color);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--accent-color);font-weight:bold;font-size:1.8rem;flex-shrink:0;">${item.name?item.name.charAt(0).toUpperCase():'?'}</div>`;
        if (item.photo) { photoHTML = `<img src="${item.photo}" style="width:60px;height:60px;border-radius:50%;object-fit:cover;border:2px solid var(--border-color);flex-shrink:0;">`; }
        let orgHTML = ''; if (item.organization?.name) { orgHTML = `<div style="color:var(--text-secondary);font-size:0.9rem;">${Singularity.core.sanitize(item.organization.name)}${item.organization.title?`, ${Singularity.core.sanitize(item.organization.title)}`:''}</div>`; }
        
        card.innerHTML = `<div class="card-content"><div class="card-header" style="align-items:center;gap:1rem;">${photoHTML}<div style="flex:1;"><h3 class="card-title">${Singularity.core.sanitize(item.name||'غير محدد')}</h3>${orgHTML}</div></div><div id="collapsible-${item.id}" class="contact-details" style="margin:1.5rem 0 1rem 0; display:none;"></div></div><div class="card-actions"></div>`;
        
        const detailsContainer = card.querySelector('.contact-details');
        const hasDetails = (item.phones && item.phones.length > 0) || (item.emails && item.emails.length > 0) || (item.websites && item.websites.length > 0) || (item.labels && item.labels.length > 0);
        
        if (hasDetails) {
            (item.phones || []).forEach(p => detailsContainer.appendChild(this._createDetailRow('fas fa-phone', p.value, p.label, 'phone')));
            (item.emails || []).forEach(e => detailsContainer.appendChild(this._createDetailRow('fas fa-envelope', e.value, e.label, 'email')));
            (item.websites || []).forEach(w => detailsContainer.appendChild(this._createDetailRow(this._getWebsiteIcon(w.value), w.value, w.label, 'website')));
            if(item.labels && item.labels.length > 0){ const tags = document.createElement('div'); tags.style.cssText="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:1rem;border-top:1px solid var(--border-color);padding-top:1rem;"; (item.labels || []).forEach(l => {const t=document.createElement('span');t.className='filter-tag';t.textContent=l;tags.appendChild(t);}); detailsContainer.appendChild(tags);}
        }
        
        const actionsContainer = card.querySelector('.card-actions');
        (item.websites||[]).forEach(w=>{const i=this._getWebsiteIcon(w.value); if(i!=='fas fa-globe'){actionsContainer.appendChild(this._createActionButton(i,w.value,`Open ${w.label||'Website'}`,false,true));}});
        if(item.phones && item.phones.length > 0){ actionsContainer.appendChild(this._createActionButton('fab fa-whatsapp',`https://wa.me/${this._cleanPhoneNumber(item.phones[0].value)}`,'WhatsApp', false, true)); }
        actionsContainer.appendChild(this._createActionButton('fa-eye',() => {const d=card.querySelector('.contact-details');d.style.display=d.style.display==='none'?'block':'none';},'إظهار/إخفاء التفاصيل', true));
        actionsContainer.appendChild(this._createActionButton('fa-edit', () => this.showForm(item), 'تعديل الملف', true));
        actionsContainer.appendChild(this._createActionButton('fa-trash', () => this.delete(item.id), 'حذف الملف', true, false, true));

        return card;
    },
    
    createListItem: function(item) {
        const li = document.createElement('div');
        li.style.cssText = 'display:flex; align-items:center; gap:1rem; padding:0.75rem; background:var(--primary-color); border-radius:6px; border:1px solid var(--border-color);';
        let photoHTML = `<img src="${item.photo}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;" onerror="this.style.display='none'">`;
        if (!item.photo) { photoHTML = `<div style="width:40px;height:40px;border-radius:50%;background:var(--secondary-color);display:flex;align-items:center;justify-content:center;font-weight:bold;flex-shrink:0;">${item.name.charAt(0).toUpperCase()}</div>`;}
        const primaryPhone = item.phones && item.phones.length > 0 ? `<span style="color:var(--text-secondary);font-size:0.9rem;">${item.phones[0].value}</span>` : '';
        li.innerHTML = `${photoHTML}<div style="flex-grow:1;"><div>${item.name}</div>${primaryPhone}</div><div class="list-item-actions" style="display:flex; gap:0.5rem;"></div>`;
        const actionsContainer = li.querySelector('.list-item-actions');
        actionsContainer.appendChild(this._createActionButton('fa-edit', () => this.showForm(item), 'تعديل', true));
        if(item.phones && item.phones.length > 0) actionsContainer.appendChild(this._createActionButton('fa-copy', () => { navigator.clipboard.writeText(item.phones[0].value); Singularity.ui.showToast('تم نسخ الرقم'); }, 'نسخ', true));
        return li;
    },

    _createActionButton: (icon, action, title, isFunction, isLink=false, isDanger=false) => {
        const btn = document.createElement(isLink ? 'a' : 'button');
        btn.className = `btn btn-small ${isDanger ? 'btn-danger' : 'btn-secondary'}`; btn.title = title;
        if(isLink){ btn.href=action; btn.target='_blank';} else { btn.onclick = action; }
        btn.innerHTML = `<i class="fas ${icon}"></i>`;
        return btn;
    },
    
    _createDetailRow: function(iconClass, value, label, type) { const row=document.createElement('div'); row.style.cssText='display:flex;gap:0.8rem;margin-bottom:0.8rem;align-items:center;'; const icon=document.createElement('i'); icon.className=iconClass; icon.style.cssText='color:var(--text-secondary);width:20px;text-align:center;font-size:1rem;'; const content=document.createElement('div'); content.style.flex='1'; if(label){const l=document.createElement('div');l.textContent=label;l.style.cssText='font-size:0.8rem;color:var(--text-muted);margin-bottom:2px;';content.appendChild(l);} const val=document.createElement('div');val.textContent=value;val.style.cssText='color:var(--text-primary);word-break:break-all;direction:ltr;text-align:left;'; content.appendChild(val); const actions=document.createElement('div'); actions.style.cssText='display:flex;gap:0.5rem;'; if(type==='phone'){actions.innerHTML=`<button class="btn btn-small"><i class="fas fa-copy"></i></button>`;actions.querySelector('button').onclick=()=>{navigator.clipboard.writeText(value);Singularity.ui.showToast('تم نسخ الرقم');};}else if(type==='email'){actions.innerHTML=`<button class="btn btn-small"><i class="fas fa-copy"></i></button>`;actions.querySelector('button').onclick=()=>{navigator.clipboard.writeText(value);Singularity.ui.showToast('تم نسخ البريد الإلكتروني');};} row.append(icon, content, actions); return row; },
    _getWebsiteIcon(url) { if(url.includes('facebook.com'))return 'fab fa-facebook'; if(url.includes('instagram.com'))return'fab fa-instagram';if(url.includes('twitter.com')||url.includes('x.com'))return 'fab fa-twitter';if(url.includes('linkedin.com'))return'fab fa-linkedin';if(url.includes('t.me')||url.includes('telegram'))return'fab fa-telegram'; return 'fas fa-globe'; },
    _cleanPhoneNumber(num) { let c = num.replace(/[\s-()]/g, ''); if (c.startsWith('00')) c='+'+c.substring(2); if(c.startsWith('01'))c='+2'+c;return c;},
    _compressImage: (file, maxSize = 256) => { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload=e=>{ const img = new Image(); img.onload=()=>{ let width=img.width, height=img.height; if(width>height){if(width>maxSize){height*=maxSize/width;width=maxSize;}}else{if(height>maxSize){width*=maxSize/height;height=maxSize;}} const canvas = document.createElement('canvas'); canvas.width=width;canvas.height=height; const ctx=canvas.getContext('2d'); ctx.drawImage(img,0,0,width,height); resolve(canvas.toDataURL('image/jpeg', 0.7)); }; img.onerror=reject; img.src=e.target.result; }; reader.onerror=reject; reader.readAsDataURL(file); });},

    showForm: function(item = null) {
        const isEdit=!!item;const form=document.createElement('form');form.innerHTML=`<fieldset><legend>المعلومات الأساسية</legend><div style="display:flex; align-items:flex-start; gap:1rem; margin-bottom:1rem;"><img id="photo-preview" style="width:80px; height:80px; border-radius:50%; object-fit:cover; background:var(--secondary-color);"><input type="file" name="photo_input" accept="image/*" id="photo-input" style="display:none;"><label for="photo-input" class="btn" style="align-self:center;">اختر صورة</label></div><div class="form-grid"><div class="form-group"><label class="form-label">الاسم الكامل</label><input type="text" class="form-input" name="name" required></div><div class="form-group"><label class="form-label">اللقب</label><input class="form-input" type="text" name="nickname"></div><div class="form-group"><label class="form-label">الشركة</label><input class="form-input" type="text" name="org_name"></div><div class="form-group"><label class="form-label">المنصب</label><input class="form-input" type="text" name="org_title"></div></div></fieldset><fieldset><legend>طرق الاتصال</legend><div id="phone-fields-container"></div><button type="button" class="btn btn-secondary btn-small add-phone-btn mb-3"><i class="fas fa-plus"></i> إضافة رقم</button><div id="email-fields-container"></div><button type="button" class="btn btn-secondary btn-small add-email-btn mb-3"><i class="fas fa-plus"></i> إضافة إيميل</button><div id="website-fields-container"></div><button type="button" class="btn btn-secondary btn-small add-website-btn"><i class="fas fa-plus"></i> إضافة موقع</button></fieldset><fieldset><legend>معلومات إضافية</legend><div class="form-grid"><div class="form-group"><label class="form-label">تاريخ الميلاد</label><input type="text" name="birthday" placeholder="YYYY-MM-DD" class="form-input"></div><div class="form-group"><label class="form-label">التصنيفات (افصل بفاصلة)</label><input type="text" name="labels" class="form-input"></div></div><div class="form-group full-width"><label class="form-label">ملاحظات</label><textarea name="notes" rows="4" class="form-textarea"></textarea></div></fieldset><div class="form-group mt-3"><button type="submit" class="btn btn-success" style="width:100%;"><i class="fas fa-save"></i> ${isEdit ? 'تحديث الملف' : 'حفظ الملف'}</button></div>`;
        const createField=(t,c,d={})=>{const w=document.createElement('div');w.className='flex gap-2 mb-2';w.innerHTML=`<input type="text" name="${t}_label" placeholder="التسمية" value="${Singularity.core.sanitize(d.label||'')}" class="form-input" style="flex-basis:35%"><input type="${t==='email'?'email':(t==='website'?'url':'tel')}" name="${t}_value" placeholder="القيمة" value="${Singularity.core.sanitize(d.value||'')}" required class="form-input" style="flex-grow:1"><button type="button" class="btn btn-danger btn-small remove-btn"><i class="fas fa-trash"></i></button>`;w.querySelector('.remove-btn').onclick=()=>w.remove();c.appendChild(w);};
        form.querySelector('.add-phone-btn').onclick = ()=>createField('phone', form.querySelector('#phone-fields-container')); form.querySelector('.add-email-btn').onclick = ()=>createField('email', form.querySelector('#email-fields-container')); form.querySelector('.add-website-btn').onclick=()=>createField('website', form.querySelector('#website-fields-container'));
        form.querySelector('#photo-input').onchange = (e) => { const file = e.target.files[0]; if(!file)return; const reader=new FileReader();reader.onload=()=>form.querySelector('#photo-preview').src=reader.result;reader.readAsDataURL(file); };
        if(isEdit){form.name.value=item.name||'';form.nickname.value=item.nickname||'';form.birthday.value=item.birthday||'';form.org_name.value=item.organization?.name||'';form.org_title.value=item.organization?.title||'';if(item.photo)form.querySelector('#photo-preview').src=item.photo;(item.phones||[]).forEach(p=>createField('phone',form.querySelector('#phone-fields-container'),p));(item.emails||[]).forEach(e=>createField('email',form.querySelector('#email-fields-container'),e));(item.websites||[]).forEach(w=>createField('website',form.querySelector('#website-fields-container'),w));form.notes.value=item.notes||'';form.labels.value=(item.labels||[]).join(', ');}
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const getFieldsData = (t, c) => {
                const d = [];
                const ls = c.querySelectorAll(`[name=${t}_label]`);
                const vs = c.querySelectorAll(`[name=${t}_value]`);
                for (let i = 0; i < vs.length; i++) {
                    if (vs[i].value) d.push({ label: ls[i].value, value: vs[i].value });
                }
                return d;
            };
            let photoData = isEdit ? item.photo : null;
            const photoInput = form.querySelector('#photo-input');
            if (photoInput.files[0]) {
                photoData = await this._compressImage(photoInput.files[0]);
            }
            const newItem = {
                id: isEdit ? item.id : Singularity.core.generateId(),
                name: form.name.value,
                nickname: form.nickname.value,
                birthday: form.birthday.value,
                organization: { name: form.org_name.value, title: form.org_title.value },
                phones: getFieldsData('phone', form.querySelector('#phone-fields-container')),
                emails: getFieldsData('email', form.querySelector('#email-fields-container')),
                websites: getFieldsData('website', form.querySelector('#website-fields-container')),
                notes: form.notes.value,
                photo: photoData,
                labels: form.labels.value.split(',').map(l => l.trim()).filter(Boolean),
                created: isEdit ? (item.created || Date.now()) : Date.now(),
                updated: Date.now()
            };
            let updatedContacts;
            if (isEdit) {
                updatedContacts = getState().contacts.map(c => c.id === item.id ? newItem : c);
            } else {
                updatedContacts = [newItem, ...getState().contacts];
            }
            updateState({ contacts: updatedContacts });
            // تحديث قاعدة البيانات
            if (isEdit) {
                await db.contacts.put(newItem);
            } else {
                await db.contacts.add(newItem);
            }
            Singularity.ui.closeModal();
            Singularity.ui.showToast(isEdit ? 'تم تحديث الملف' : 'تم إضافة الملف', 'success');
            Singularity.dashboard.load();
        });
        Singularity.ui.showModal(isEdit ? 'تعديل الملف' : 'إضافة ملف جديد', form);
    },

    delete: async function(id) { if(confirm('هل أنت متأكد من حذف هذا الملف؟')){ Singularity.core.state.data.contacts=Singularity.core.state.data.contacts.filter(c=>c.id!==id);await Singularity.core.saveData();Singularity.ui.showToast('تم حذف الملف','success');this.renderGrid();Singularity.dashboard.load();}},
    delete: async function(id) {
        if (confirm('هل أنت متأكد من حذف هذا الملف؟')) {
            const updatedContacts = getState().contacts.filter(c => c.id !== id);
            updateState({ contacts: updatedContacts });
            await db.contacts.delete(id);
            Singularity.ui.showToast('تم حذف الملف', 'success');
            Singularity.dashboard.load();
        }
    },
    updateFilters: function() { const c=document.getElementById('contacts-filters'); c.innerHTML=''; const allTags=new Set(Singularity.core.state.data.contacts.flatMap(i=>i.labels||[])); const createTag=tag=>{const t=document.createElement('div');t.className=`filter-tag ${tag===this.currentFilter?'active':''}`; t.dataset.filter=tag; t.textContent=tag==='all'?'الكل':tag; t.onclick=()=>{this.currentFilter=tag; this.renderGrid();}; return t;}; c.appendChild(createTag('all')); allTags.forEach(t=>c.appendChild(createTag(t)));},
    
    handleExternalImport: function(file) { if(!file)return;const r=new FileReader();r.onload=async e=>{try{const d=this.parseGoogleCSV(e.target.result);if(d.length===0){Singularity.ui.showToast('لم يتم العثور على بيانات صالحة','warning');return;} const confirmed=await this.showImportConfirmation(d); if(confirmed){this.mergeImportedData(d);await Singularity.core.saveData();Singularity.ui.showToast(`تم دمج ${d.length} ملف بنجاح`,'success');this.renderGrid();Singularity.dashboard.load();}}catch(err){console.error("Import failed:",err);Singularity.ui.showToast('فشل معالجة الملف','error');}};r.readAsText(file,'UTF-8');},
    showImportConfirmation: function(data) { return new Promise(r=>{const c=document.createElement('div'); c.innerHTML=`<p class="mb-2">تم العثور على <strong>${data.length}</strong> ملف. هل تود دمجها؟</p><h4 class="mb-1 mt-3">عينة:</h4><div style="background:var(--bg-color);padding:0.8rem;border-radius:8px;font-size:0.9rem;max-height:150px;overflow-y:auto;">${data.slice(0,5).map(i=>`<div><strong>${Singularity.core.sanitize(i.name)}</strong> - ${Singularity.core.sanitize(i.phones?.[0]?.value||'N/A')}</div>`).join('')}</div><div class="flex gap-2 mt-3"><button class="btn btn-success confirm-btn" style="flex:1"><i class="fas fa-check"></i> تأكيد</button><button class="btn btn-danger cancel-btn" style="flex:1"><i class="fas fa-times"></i> إلغاء</button></div>`; c.querySelector('.confirm-btn').onclick=()=>{Singularity.ui.closeModal();r(true);}; c.querySelector('.cancel-btn').onclick=()=>{Singularity.ui.closeModal();r(false);}; Singularity.ui.showModal('تأكيد استيراد',c);});},
    mergeImportedData: function(data) { data.forEach(item=>{item.id=Singularity.core.generateId(); item.created=Date.now(); item.updated=Date.now(); if(!item.labels.includes('مستورد'))item.labels.push('مستورد');const exists=Singularity.core.state.data.contacts.some(c=>c.name===item.name && c.phones?.[0]?.value===item.phones?.[0]?.value); if(!exists)Singularity.core.state.data.contacts.push(item);});},
    parseGoogleCSV: function(csv) { const lines=csv.split(/\r?\n/);if(lines.length<2)return[]; const headers=lines[0].split(',').map(h=>h.trim().replace(/^"|"$/g,'')); const contacts=[]; for(let i=1;i<lines.length;i++){ if(!lines[i].trim())continue;const values=lines[i].match(/(?:"[^"]*(?:""[^"]*)*"|[^,]*),?/g)||[];if(values.length===0)continue;const row={};headers.forEach((h,idx)=>{row[h]=(values[idx]||'').replace(/,$/,'').replace(/^"|"$/g,'').replace(/""/g,'"').trim();});const name=[row['Name Prefix'],row['First Name'],row['Middle Name'],row['Last Name'],row['Name Suffix']].filter(Boolean).join(' ').trim()||row['File As'];if(!name)continue;const contact={name,nickname:row['Nickname']||'',organization:{name:row['Organization Name'],title:row['Organization Title']},phones:[],emails:[],addresses:[],websites:[],labels:(row['Labels']||row['Group Membership']||'').split(' ::: ').map(l=>l.trim()).filter(l=>l&&!l.startsWith('* ')),notes:row['Notes']||'',birthday:row['Birthday']||'',photo:row['Photo']||''};for(let j=1;j<=8;j++){if(row[`Phone ${j} - Value`])(row[`Phone ${j} - Value`]).split(' ::: ').forEach(v=>contact.phones.push({label:row[`Phone ${j} - Label`],value:v.trim()}));if(row[`E-mail ${j} - Value`])contact.emails.push({label:row[`E-mail ${j} - Label`],value:row[`E-mail ${j} - Value`]});if(row[`Address ${j} - Formatted`])contact.addresses.push({label:row[`Address ${j} - Label`],value:row[`Address ${j} - Formatted`]});if(row[`Website ${j} - Value`])contact.websites.push({label:row[`Website ${j} - Label`],value:row[`Website ${j} - Value`]});} contacts.push(contact);} return contacts;},
};
