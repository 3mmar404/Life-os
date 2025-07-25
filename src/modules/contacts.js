if (!window.Singularity) window.Singularity = {};

window.Singularity.contacts = {
    currentFilter: 'all', searchQuery: '', viewMode: 'dossier', // dossier or list

    load: function() {
        this.renderLayout();
        window.Singularity.core.subscribe(() => this.renderGrid());
        this.renderGrid();
    },
    
    renderLayout: function() {
        const container = document.getElementById('contacts');
        if (container.childElementCount > 0 && container.querySelector('.view-mode-toggle')) return;
        
        const isRTL = window.Singularity.i18n.isRTL();
        
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
        container.querySelector('#contacts-search').addEventListener('input', window.Singularity.core.debounce((e) => { this.searchQuery = e.target.value; this.renderGrid(); }, 300));
        
        container.querySelectorAll('.view-mode-toggle button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.viewMode = btn.dataset.view;
                this.renderGrid();
                this._updateViewModeToggle();
            });
        });

// Contacts Module - ES Module Version
import { getState, updateState, subscribe } from '../core/state.js';
// import { db } from '../core/db.js'; // Uncomment if needed

let container = null;
let unsubscribe = null;

function renderGrid() {
    if (!container) return;
    const contacts = (getState().contacts || []);
    container.innerHTML = '';
    if (!contacts.length) {
        container.innerHTML = '<p class="empty-state">لا يوجد جهات اتصال.</p>';
        return;
    }
    const fragment = document.createDocumentFragment();
    contacts.forEach(contact => {
        const div = document.createElement('div');
        div.textContent = contact.name || 'Contact';
        fragment.appendChild(div);
    });
    container.appendChild(fragment);
}

async function init(mainContainer) {
    container = mainContainer;
    container.innerHTML = '<div id="contacts-grid"></div>';
    const grid = container.querySelector('#contacts-grid');
    unsubscribe = subscribe(renderGrid);
    renderGrid();
}

function destroy() {
    if (unsubscribe) unsubscribe();
    if (container) container.innerHTML = '';
    container = null;
}

export default { init, destroy };

