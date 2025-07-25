        this.showForm();
    },
    showAddForm: function() {
        this.showForm();
    },
// Singularity - Bookmarks Module v3.0 (IRIS Project - Complete)
if (!window.Singularity) window.Singularity = {};

window.Singularity.bookmarks = {
    currentFilter: 'all',
    searchQuery: '',

    load: function() {
        this.renderLayout();
        window.Singularity.core.subscribe(() => this.renderGrid());
        this.renderGrid();
    },

    renderLayout: function() {

        const container = document.getElementById('bookmarks');
        if (container.childElementCount > 0 && container.querySelector('.filter-tags-container')) return;
        
        const isRTL = window.Singularity.i18n.isRTL();
        
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
        container.querySelector('#bookmarks-search').oninput = window.Singularity.core.debounce(e => { this.searchQuery = e.target.value; this.renderGrid(); }, 300);
    },

    renderGrid: function() {
        const grid = document.getElementById('bookmarks-grid');
        const emptyMsg = document.getElementById('bookmarks-empty');
        grid.innerHTML = '';
        const data = window.Singularity.core.getState().bookmarks || [];
        const filtered = this.getFilteredData(data);
        if (filtered.length === 0) {
            grid.style.display = 'none';

// Bookmarks Module - ES Module Version
import { getState, updateState, subscribe } from '../core/state.js';
// import { db } from '../core/db.js'; // Uncomment if needed

let container = null;
let unsubscribe = null;

function renderGrid() {
    if (!container) return;
    const bookmarks = (getState().bookmarks || []);
    container.innerHTML = '';
    if (!bookmarks.length) {
        container.innerHTML = '<p class="empty-state">لا يوجد روابط محفوظة.</p>';
        return;
    }
    const fragment = document.createDocumentFragment();
    bookmarks.forEach(bookmark => {
        const div = document.createElement('div');
        div.textContent = bookmark.title || 'Bookmark';
        fragment.appendChild(div);
    });
    container.appendChild(fragment);
}

async function init(mainContainer) {
    container = mainContainer;
    container.innerHTML = '<div id="bookmarks-grid"></div>';
    const grid = container.querySelector('#bookmarks-grid');
    unsubscribe = subscribe(renderGrid);
    renderGrid();
}

function destroy() {
    if (unsubscribe) unsubscribe();
    if (container) container.innerHTML = '';
    container = null;
}

export default { init, destroy };

