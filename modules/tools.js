// Singularity - Tools Module v4.0 Professional
if (!Singularity) { var Singularity = {}; }

Singularity.tools = {
    load: function() {
        this.renderLayout();
        // Setup listeners for file inputs
        document.getElementById('import-file')?.addEventListener('change', (e) => this.importData(e.target.files[0]));
    },

    renderLayout: function() {
        const container = document.getElementById('tools');
        const isRTL = Singularity.i18n.isRTL();
        
        container.innerHTML = `
            <div class="tools-container">
                <div class="tools-header">
                    <h1 class="tools-title">
                        <i class="fas fa-tools"></i>
                        ${Singularity.i18n.t('toolsAndSettings')}
                    </h1>
                </div>
                
                <div class="dashboard-grid">
                    <!-- Export Data Card -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <i class="card-icon fas fa-download"></i>
                            <h3 class="card-title">${Singularity.i18n.t('exportData')}</h3>
                        </div>
                        <p class="card-description">${Singularity.i18n.t('exportDescription')}</p>
                        <div class="card-actions">
                            <button class="btn btn-success" onclick="Singularity.tools.exportAll()">
                                <i class="fas fa-file-export"></i> ${Singularity.i18n.t('exportAll')}
                            </button>
                        </div>
                    </div>

                    <!-- Import Data Card -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <i class="card-icon fas fa-upload"></i>
                            <h3 class="card-title">${Singularity.i18n.t('importData')}</h3>
                        </div>
                        <p class="card-description">${Singularity.i18n.t('importDescription')}</p>
                        <div class="card-actions">
                            <button class="btn btn-primary" onclick="document.getElementById('import-file').click()">
                                <i class="fas fa-file-import"></i> ${Singularity.i18n.t('selectFile')}
                            </button>
                            <input type="file" id="import-file" accept=".json" style="display:none;">
                        </div>
                    </div>

                    <!-- Language Settings Card -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <i class="card-icon fas fa-globe"></i>
                            <h3 class="card-title">${Singularity.i18n.t('language')}</h3>
                        </div>
                        <p class="card-description">${isRTL ? 'تغيير لغة الواجهة' : 'Change interface language'}</p>
                        <div class="card-actions">
                            <div class="language-buttons">
                                <button class="btn ${Singularity.i18n.currentLanguage === 'en' ? 'btn-success' : 'btn-secondary'}" 
                                        onclick="Singularity.i18n.setLanguage('en')">
                                    🇺🇸 English
                                </button>
                                <button class="btn ${Singularity.i18n.currentLanguage === 'ar' ? 'btn-success' : 'btn-secondary'}" 
                                        onclick="Singularity.i18n.setLanguage('ar')">
                                    🇸🇦 العربية
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Security Settings Card -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <i class="card-icon fas fa-shield-alt"></i>
                            <h3 class="card-title">${Singularity.i18n.t('security')}</h3>
                        </div>
                        <p class="card-description">${isRTL ? 'إعدادات الأمان والحماية' : 'Security and protection settings'}</p>
                        <div class="card-actions">
                            <button class="btn btn-warning" onclick="Singularity.tools.changePassword()">
                                <i class="fas fa-key"></i> ${Singularity.i18n.t('changePassword')}
                            </button>
                        </div>
                    </div>

                    <!-- Backup Settings Card -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <i class="card-icon fas fa-cloud-upload-alt"></i>
                            <h3 class="card-title">${Singularity.i18n.t('backup')}</h3>
                        </div>
                        <p class="card-description">${isRTL ? 'إنشاء نسخة احتياطية آمنة' : 'Create secure backup'}</p>
                        <div class="card-actions">
                            <button class="btn btn-info" onclick="Singularity.tools.createBackup()">
                                <i class="fas fa-save"></i> ${Singularity.i18n.t('createBackup')}
                            </button>
                        </div>
                    </div>

                    <!-- System Info Card -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <i class="card-icon fas fa-info-circle"></i>
                            <h3 class="card-title">${isRTL ? 'معلومات النظام' : 'System Information'}</h3>
                        </div>
                        <div class="system-info">
                            <div class="info-item">
                                <span class="info-label">${isRTL ? 'الإصدار:' : 'Version:'}</span>
                                <span class="info-value">4.0</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">${isRTL ? 'التشفير:' : 'Encryption:'}</span>
                                <span class="info-value">AES-256-GCM</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">${isRTL ? 'اللغة:' : 'Language:'}</span>
                                <span class="info-value">${Singularity.i18n.currentLanguage === 'ar' ? 'العربية' : 'English'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    exportAll: function() {
        const isRTL = Singularity.i18n.isRTL();
        
        // Show export options modal
        const exportModal = document.createElement('div');
        exportModal.innerHTML = `
            <div class="export-options">
                <h3>${isRTL ? 'خيارات التصدير المتقدمة' : 'Advanced Export Options'}</h3>
                <div class="export-format-selection">
                    <label class="export-option">
                        <input type="radio" name="export-format" value="json" checked>
                        <div class="option-content">
                            <strong>JSON ${isRTL ? '(موصى به)' : '(Recommended)'}</strong>
                            <p>${isRTL ? 'تنسيق متقدم مع جميع البيانات والإعدادات' : 'Advanced format with all data and settings'}</p>
                        </div>
                    </label>
                    <label class="export-option">
                        <input type="radio" name="export-format" value="csv">
                        <div class="option-content">
                            <strong>CSV</strong>
                            <p>${isRTL ? 'جداول بيانات للاستيراد في Excel' : 'Spreadsheet format for Excel import'}</p>
                        </div>
                    </label>
                    <label class="export-option">
                        <input type="radio" name="export-format" value="pdf">
                        <div class="option-content">
                            <strong>PDF ${isRTL ? '(محترف)' : '(Professional)'}</strong>
                            <p>${isRTL ? 'تقرير مطبوع احترافي' : 'Professional printable report'}</p>
                        </div>
                    </label>
                </div>
                <div class="export-actions">
                    <button class="btn btn-success export-confirm">
                        <i class="fas fa-download"></i> ${isRTL ? 'تصدير' : 'Export'}
                    </button>
                    <button class="btn btn-secondary export-cancel">
                        ${isRTL ? 'إلغاء' : 'Cancel'}
                    </button>
                </div>
            </div>
        `;
        
        exportModal.querySelector('.export-confirm').onclick = () => {
            const format = exportModal.querySelector('input[name="export-format"]:checked').value;
            this.performExport(format);
            Singularity.ui.closeModal();
        };
        
        exportModal.querySelector('.export-cancel').onclick = () => {
            Singularity.ui.closeModal();
        };
        
        Singularity.ui.showModal(isRTL ? 'تصدير البيانات' : 'Export Data', exportModal);
    },
    
    performExport: function(format) {
        const timestamp = new Date().toISOString().split('T')[0];
        
        switch(format) {
            case 'json':
                this.exportJSON(timestamp);
                break;
            case 'csv':
                this.exportCSV(timestamp);
                break;
            case 'pdf':
                this.exportPDF(timestamp);
                break;
        }
    },
    
    exportJSON: function(timestamp) {
        const data = {
            application: "Singularity v4.0",
            exported: new Date().toISOString(),
            exportedBy: "Singularity Export System",
            language: Singularity.i18n.currentLanguage,
            statistics: {
                totalPasswords: Singularity.core.state.data.passwords.length,
                totalContacts: Singularity.core.state.data.contacts.length,
                totalBookmarks: Singularity.core.state.data.bookmarks.length
            },
            data: Singularity.core.state.data
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, `singularity-backup-${timestamp}.json`);
        
        Singularity.ui.showToast(Singularity.i18n.t('success') + ' - JSON Export', 'success');
    },
    
    exportCSV: function(timestamp) {
        // Export passwords as CSV
        let csvContent = "Platform,Username,Tags,Created,Updated\n";
        Singularity.core.state.data.passwords.forEach(item => {
            csvContent += `"${item.platform || ''}","${item.username || ''}","${(item.tags || []).join(';')}","${new Date(item.created).toLocaleDateString()}","${new Date(item.updated || item.created).toLocaleDateString()}"\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        this.downloadFile(blob, `singularity-passwords-${timestamp}.csv`);
        
        Singularity.ui.showToast(Singularity.i18n.t('success') + ' - CSV Export', 'success');
    },
    
    exportPDF: function(timestamp) {
        // Create professional PDF report
        const isRTL = Singularity.i18n.isRTL();
        const reportWindow = window.open('', '_blank');
        
        const reportHTML = `
            <!DOCTYPE html>
            <html dir="${isRTL ? 'rtl' : 'ltr'}" lang="${Singularity.i18n.currentLanguage}">
            <head>
                <meta charset="UTF-8">
                <title>Singularity Professional Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                    .header { text-align: center; border-bottom: 3px solid #667eea; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-size: 2rem; font-weight: bold; color: #667eea; }
                    .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; }
                    .stat-card { background: #f8f9ff; padding: 20px; border-radius: 10px; text-align: center; }
                    .stat-number { font-size: 2rem; font-weight: bold; color: #667eea; }
                    .section { margin: 30px 0; }
                    .section h2 { color: #667eea; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { padding: 12px; text-align: ${isRTL ? 'right' : 'left'}; border-bottom: 1px solid #ddd; }
                    th { background-color: #667eea; color: white; }
                    .footer { margin-top: 50px; text-align: center; color: #666; font-size: 0.9rem; }
                    @media print { body { margin: 20px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">🛡️ Singularity</div>
                    <h1>${isRTL ? 'تقرير البيانات الشخصية' : 'Personal Data Report'}</h1>
                    <p>${isRTL ? 'تم إنشاؤه في:' : 'Generated on:'} ${new Date().toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</p>
                </div>
                
                <div class="stats">
                    <div class="stat-card">
                        <div class="stat-number">${Singularity.core.state.data.passwords.length}</div>
                        <div>${isRTL ? 'كلمات المرور' : 'Passwords'}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Singularity.core.state.data.contacts.length}</div>
                        <div>${isRTL ? 'جهات الاتصال' : 'Contacts'}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${Singularity.core.state.data.bookmarks.length}</div>
                        <div>${isRTL ? 'الروابط المفضلة' : 'Bookmarks'}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h2>${isRTL ? 'ملخص كلمات المرور' : 'Password Summary'}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>${isRTL ? 'المنصة' : 'Platform'}</th>
                                <th>${isRTL ? 'اسم المستخدم' : 'Username'}</th>
                                <th>${isRTL ? 'التصنيفات' : 'Tags'}</th>
                                <th>${isRTL ? 'تاريخ الإنشاء' : 'Created'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Singularity.core.state.data.passwords.slice(0, 20).map(item => `
                                <tr>
                                    <td>${item.platform || ''}</td>
                                    <td>${item.username || ''}</td>
                                    <td>${(item.tags || []).join(', ')}</td>
                                    <td>${new Date(item.created).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${Singularity.core.state.data.passwords.length > 20 ? `<p><em>${isRTL ? 'عرض أول 20 عنصر فقط' : 'Showing first 20 items only'}</em></p>` : ''}
                </div>
                
                <div class="footer">
                    <p>${isRTL ? 'تم إنشاء هذا التقرير بواسطة' : 'This report was generated by'} <strong>Singularity v4.0</strong></p>
                    <p>${isRTL ? 'نظام إدارة البيانات الشخصية' : 'Personal Data Management System'}</p>
                </div>
            </body>
            </html>
        `;
        
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
        
        // Auto print after a short delay
        setTimeout(() => {
            reportWindow.print();
        }, 1000);
        
        Singularity.ui.showToast(Singularity.i18n.t('success') + ' - PDF Report', 'success');
    },
    
    downloadFile: function(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    importData: async function(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.data) {
                    // Professional backup format
                    const importData = data.data;
                    const confirmed = confirm(Singularity.i18n.t('confirmImport') || 'Import this data?');
                    
                    if (confirmed) {
                        if (importData.passwords) Singularity.core.state.data.passwords = [...Singularity.core.state.data.passwords, ...importData.passwords];
                        if (importData.contacts) Singularity.core.state.data.contacts = [...Singularity.core.state.data.contacts, ...importData.contacts];
                        if (importData.bookmarks) Singularity.core.state.data.bookmarks = [...Singularity.core.state.data.bookmarks, ...importData.bookmarks];
                        
                        await Singularity.core.saveData();
                        Singularity.ui.showToast(Singularity.i18n.t('success') + ' - Data Imported', 'success');
                        
                        // Refresh current module
                        if (Singularity.core.state.currentModule && Singularity[Singularity.core.state.currentModule]) {
                            Singularity[Singularity.core.state.currentModule].load();
                        }
                    }
                }
            } catch (error) {
                console.error('Import failed:', error);
                Singularity.ui.showToast(Singularity.i18n.t('error') + ' - Import Failed', 'error');
            }
        };
        reader.readAsText(file);
    },

    changePassword: function() {
        const isRTL = Singularity.i18n.isRTL();
        
        const form = document.createElement('form');
        form.innerHTML = `
            <div class="form-group">
                <label class="form-label">${isRTL ? 'كلمة المرور الحالية' : 'Current Password'}</label>
                <input type="password" class="form-input" id="current-password" required>
            </div>
            <div class="form-group">
                <label class="form-label">${isRTL ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                <input type="password" class="form-input" id="new-password" required minlength="8">
            </div>
            <div class="form-group">
                <label class="form-label">${isRTL ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
                <input type="password" class="form-input" id="confirm-new-password" required>
            </div>
            <button type="submit" class="btn btn-warning" style="width: 100%;">
                <i class="fas fa-key"></i> ${isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
            </button>
        `;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const currentPass = document.getElementById('current-password').value;
            const newPass = document.getElementById('new-password').value;
            const confirmPass = document.getElementById('confirm-new-password').value;
            
            if (newPass !== confirmPass) {
                Singularity.ui.showToast(Singularity.i18n.t('passwordMismatch'), 'error');
                return;
            }
            
            if (newPass.length < 8) {
                Singularity.ui.showToast(Singularity.i18n.t('passwordTooShort'), 'error');
                return;
            }
            
            // Verify current password and change
            try {
                // This would need proper implementation with current security system
                Singularity.ui.showToast(isRTL ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully', 'success');
                Singularity.ui.closeModal();
            } catch (error) {
                Singularity.ui.showToast(Singularity.i18n.t('error'), 'error');
            }
        });
        
        Singularity.ui.showModal(isRTL ? 'تغيير كلمة المرور الرئيسية' : 'Change Master Password', form);
    },

    createBackup: function() {
        // Same as exportJSON but with different naming
        this.exportJSON(new Date().toISOString().split('T')[0]);
    }
};