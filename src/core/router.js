// Singularity - Router Module v4.0 (Based on LifeOS)
// Handles navigation between different application modules.

if (!Singularity) { var Singularity = {}; }

Singularity.router = {
    init: function() {
        // Setup navigation tab event listeners
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const moduleName = e.currentTarget.dataset.module;
                if (moduleName) {
                    this.navigate(moduleName);
                }
            });
        });
        
        // Also setup for any button with data-module attribute
        document.querySelectorAll('button[data-module]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const moduleName = e.currentTarget.dataset.module;
                if (moduleName) {
                    this.navigate(moduleName);
                }
            });
        });
    },

    navigate: function(moduleName) {
        // Hide all modules
        document.querySelectorAll('.module').forEach(mod => {
            mod.classList.remove('active');
        });

        // Deactivate all nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show the target module
        const targetModule = document.getElementById(moduleName);
        if (targetModule) {
            targetModule.classList.add('active');
        }

        // Activate the target nav tab
        const targetTab = document.querySelector(`.nav-tab[data-module="${moduleName}"]`);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Update current module in state
        Singularity.core.state.currentModule = moduleName;

        // Load the module's data and render its content
        this.loadModule(moduleName);
    },

    loadModule: function(moduleName) {
        // Each module object must have a `load()` method
        if (Singularity[moduleName] && typeof Singularity[moduleName].load === 'function') {
            try {
                Singularity[moduleName].load();
                console.log(`✅ Module loaded: ${moduleName}`);
            } catch (error) {
                console.error(`❌ Error loading module ${moduleName}:`, error);
            }
        } else {
            console.warn(`Module "${moduleName}" does not have a load method.`);
        }
    }
};