// Singularity - Router Module v5.0 (Dynamic ES Module Loader)

const mainContent = document.getElementById('main-content');
let currentModule = null;

// Define available modules and their paths
const modules = {
    dashboard: { path: './modules/dashboard.js', loaded: false, instance: null },
    passwords: { path: './modules/passwords.js', loaded: false, instance: null },
    contacts: { path: './modules/contacts.js', loaded: false, instance: null },
    bookmarks: { path: './modules/bookmarks.js', loaded: false, instance: null },
    tools: { path: './modules/tools.js', loaded: false, instance: null },
    about: { path: './modules/about.js', loaded: false, instance: null },
    documentation: { path: './modules/documentation.js', loaded: false, instance: null },
};

// Function to dynamically load a module
async function loadModule(moduleName) {
    const moduleInfo = modules[moduleName];
    if (!moduleInfo) {
        console.error(`Module "${moduleName}" not found.`);
        return null;
    }
    if (!moduleInfo.loaded) {
        try {
            const moduleInstance = await import(moduleInfo.path);
            moduleInfo.instance = moduleInstance.default;
            moduleInfo.loaded = true;
            console.log(`✅ Module dynamically loaded: ${moduleName}`);
        } catch (error) {
            console.error(`Failed to load module ${moduleName}:`, error);
            return null;
        }
    }
    return moduleInfo.instance;
}

// Main navigation function
async function navigate(path) {
    const moduleName = path.replace('#', '') || 'dashboard';
    if (currentModule && typeof currentModule.destroy === 'function') {
        currentModule.destroy();
    }
    if (mainContent) mainContent.innerHTML = '';
    const moduleInstance = await loadModule(moduleName);
    if (moduleInstance) {
        currentModule = moduleInstance;
        if (typeof currentModule.init === 'function') {
            try {
                await currentModule.init(mainContent);
                console.log(`✅ Module initialized: ${moduleName}`);
            } catch (error) {
                console.error(`Error initializing module ${moduleName}:`, error);
                if (mainContent) mainContent.innerHTML = `<p class="error-message">Failed to load content for ${moduleName}.</p>`;
            }
        } else {
            console.error(`Module "${moduleName}" does not have an init method.`);
            if (mainContent) mainContent.innerHTML = `<p class="error-message">Module "${moduleName}" is not configured correctly.</p>`;
        }
    } else {
        if (moduleName !== 'dashboard') {
            window.location.hash = '#dashboard';
        }
    }
}

// Function to initialize the router
function init() {
    window.addEventListener('hashchange', () => navigate(window.location.hash));
}

export const router = {
    init,
    navigate,
};
