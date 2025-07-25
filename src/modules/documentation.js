// Singularity - Documentation Module v1.0
// Professional documentation system

if (!Singularity) { var Singularity = {}; }

Singularity.documentation = {
    currentSection: 'getting-started',
    
    load: function() {
        this.renderLayout();
        this.loadSection(this.currentSection);
    },

    renderLayout: function() {
        const container = document.getElementById('documentation');
        const isRTL = Singularity.i18n.isRTL();
        
        container.innerHTML = `
            <div class="documentation-container">
                <!-- Sidebar Navigation -->
                <div class="docs-sidebar">
                    <div class="docs-nav">
                        <h3 class="docs-nav-title" data-i18n="documentation">${Singularity.i18n.t('documentation')}</h3>
                        <ul class="docs-nav-list">
                            <li class="docs-nav-item">
                                <a href="#" class="docs-nav-link active" data-section="getting-started">
                                    <i class="fas fa-rocket"></i>
                                    <span data-i18n="gettingStarted">${Singularity.i18n.t('gettingStarted')}</span>
                                </a>
                            </li>
                            <li class="docs-nav-item">
                                <a href="#" class="docs-nav-link" data-section="user-guide">
                                    <i class="fas fa-book"></i>
                                    <span data-i18n="userGuide">${Singularity.i18n.t('userGuide')}</span>
                                </a>
                            </li>
                            <li class="docs-nav-item">
                                <a href="#" class="docs-nav-link" data-section="security">
                                    <i class="fas fa-shield-alt"></i>
                                    <span data-i18n="security">${Singularity.i18n.t('security')}</span>
                                </a>
                            </li>
                            <li class="docs-nav-item">
                                <a href="#" class="docs-nav-link" data-section="troubleshooting">
                                    <i class="fas fa-tools"></i>
                                    <span data-i18n="troubleshooting">${Singularity.i18n.t('troubleshooting')}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="docs-content">
                    <div id="docs-main-content">
                        <!-- Content will be loaded here -->
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for navigation
        container.querySelectorAll('.docs-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                this.loadSection(section);
                
                // Update active state
                container.querySelectorAll('.docs-nav-link').forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    },

    loadSection: function(section) {
        this.currentSection = section;
        const contentContainer = document.getElementById('docs-main-content');
        const isRTL = Singularity.i18n.isRTL();
        
        const sections = {
            'getting-started': this.getGettingStartedContent(),
            'user-guide': this.getUserGuideContent(),
            'security': this.getSecurityContent(),
            'troubleshooting': this.getTroubleshootingContent()
        };
        
        contentContainer.innerHTML = sections[section] || sections['getting-started'];
    },

    getGettingStartedContent: function() {
        const isRTL = Singularity.i18n.isRTL();
        
        return `
            <div class="docs-section">
                <h1 class="docs-title">${isRTL ? 'البدء السريع' : 'Getting Started'}</h1>
                <p class="docs-intro">
                    ${isRTL ? 
                        'مرحباً بك في سينجولاريتي! هذا الدليل سيساعدك على البدء في استخدام النظام بسرعة وسهولة.' :
                        'Welcome to Singularity! This guide will help you get started with the system quickly and easily.'
                    }
                </p>

                <div class="docs-step">
                    <h2 class="docs-step-title">
                        <span class="step-number">1</span>
                        ${isRTL ? 'إعداد كلمة المرور الرئيسية' : 'Setup Master Password'}
                    </h2>
                    <p class="docs-step-content">
                        ${isRTL ? 
                            'عند فتح التطبيق لأول مرة، ستحتاج إلى إعداد كلمة مرور رئيسية قوية. هذه الكلمة ستُستخدم لتشفير جميع بياناتك.' :
                            'When opening the application for the first time, you\'ll need to set up a strong master password. This password will be used to encrypt all your data.'
                        }
                    </p>
                    <div class="docs-tip">
                        <i class="fas fa-lightbulb"></i>
                        <strong>${isRTL ? 'نصيحة:' : 'Tip:'}</strong>
                        ${isRTL ? 
                            'استخدم كلمة مرور قوية تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز.' :
                            'Use a strong password containing uppercase, lowercase, numbers, and symbols.'
                        }
                    </div>
                </div>

                <div class="docs-step">
                    <h2 class="docs-step-title">
                        <span class="step-number">2</span>
                        ${isRTL ? 'استكشاف الواجهة' : 'Explore the Interface'}
                    </h2>
                    <p class="docs-step-content">
                        ${isRTL ? 
                            'الواجهة مقسمة إلى عدة أقسام رئيسية:' :
                            'The interface is divided into several main sections:'
                        }
                    </p>
                    <ul class="docs-list">
                        <li><strong>${isRTL ? 'لوحة التحكم:' : 'Dashboard:'}</strong> ${isRTL ? 'نظرة عامة على بياناتك وإحصائيات سريعة' : 'Overview of your data and quick statistics'}</li>
                        <li><strong>${isRTL ? 'كلمات المرور:' : 'Passwords:'}</strong> ${isRTL ? 'إدارة حساباتك وكلمات المرور' : 'Manage your accounts and passwords'}</li>
                        <li><strong>${isRTL ? 'جهات الاتصال:' : 'Contacts:'}</strong> ${isRTL ? 'إدارة معلومات الاتصال' : 'Manage contact information'}</li>
                        <li><strong>${isRTL ? 'الروابط المفضلة:' : 'Bookmarks:'}</strong> ${isRTL ? 'حفظ وتنظيم الروابط المهمة' : 'Save and organize important links'}</li>
                        <li><strong>${isRTL ? 'الأدوات:' : 'Tools:'}</strong> ${isRTL ? 'إعدادات النظام والنسخ الاحتياطية' : 'System settings and backups'}</li>
                    </ul>
                </div>

                <div class="docs-step">
                    <h2 class="docs-step-title">
                        <span class="step-number">3</span>
                        ${isRTL ? 'إضافة البيانات الأولى' : 'Add Your First Data'}
                    </h2>
                    <p class="docs-step-content">
                        ${isRTL ? 
                            'ابدأ بإضافة بعض البيانات لتجربة النظام. يمكنك البدء بإضافة حساب جديد في قسم كلمات المرور.' :
                            'Start by adding some data to try out the system. You can begin by adding a new account in the passwords section.'
                        }
                    </p>
                </div>

                <div class="docs-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    <strong>${isRTL ? 'تحذير مهم:' : 'Important Warning:'}</strong>
                    ${isRTL ? 
                        'لا تنس كلمة المرور الرئيسية! بدونها لن تتمكن من الوصول إلى بياناتك.' :
                        'Don\'t forget your master password! Without it, you won\'t be able to access your data.'
                    }
                </div>
            </div>
        `;
    },

    getUserGuideContent: function() {
        const isRTL = Singularity.i18n.isRTL();
        
        return `
            <div class="docs-section">
                <h1 class="docs-title">${isRTL ? 'دليل المستخدم' : 'User Guide'}</h1>
                
                <div class="docs-subsection">
                    <h2>${isRTL ? 'إدارة كلمات المرور' : 'Password Management'}</h2>
                    <p>
                        ${isRTL ? 
                            'قسم كلمات المرور يتيح لك حفظ وإدارة جميع حساباتك بأمان.' :
                            'The password section allows you to securely save and manage all your accounts.'
                        }
                    </p>
                    
                    <h3>${isRTL ? 'إضافة حساب جديد:' : 'Adding a New Account:'}</h3>
                    <ol class="docs-list">
                        <li>${isRTL ? 'انقر على زر "إضافة حساب"' : 'Click the "Add Account" button'}</li>
                        <li>${isRTL ? 'املأ معلومات الحساب (المنصة، اسم المستخدم، كلمة المرور)' : 'Fill in the account information (platform, username, password)'}</li>
                        <li>${isRTL ? 'أضف تصنيفات لتسهيل البحث' : 'Add tags for easier searching'}</li>
                        <li>${isRTL ? 'انقر "حفظ الحساب"' : 'Click "Save Account"'}</li>
                    </ol>
                    
                    <h3>${isRTL ? 'البحث والتصفية:' : 'Search and Filter:'}</h3>
                    <ul class="docs-list">
                        <li>${isRTL ? 'استخدم مربع البحث للعثور على حسابات محددة' : 'Use the search box to find specific accounts'}</li>
                        <li>${isRTL ? 'انقر على التصنيفات لتصفية النتائج' : 'Click on tags to filter results'}</li>
                        <li>${isRTL ? 'يمكن البحث في أسماء المنصات وأسماء المستخدمين والتصنيفات' : 'You can search in platform names, usernames, and tags'}</li>
                    </ul>
                </div>

                <div class="docs-subsection">
                    <h2>${isRTL ? 'إدارة جهات الاتصال' : 'Contact Management'}</h2>
                    <p>
                        ${isRTL ? 
                            'قسم جهات الاتصال يتيح لك حفظ معلومات الاتصال الشخصية والمهنية.' :
                            'The contacts section allows you to save personal and professional contact information.'
                        }
                    </p>
                    
                    <h3>${isRTL ? 'المعلومات المدعومة:' : 'Supported Information:'}</h3>
                    <ul class="docs-list">
                        <li>${isRTL ? 'المعلومات الأساسية (الاسم، اللقب، الشركة، المنصب)' : 'Basic information (name, nickname, company, position)'}</li>
                        <li>${isRTL ? 'أرقام الهاتف المتعددة' : 'Multiple phone numbers'}</li>
                        <li>${isRTL ? 'عناوين البريد الإلكتروني' : 'Email addresses'}</li>
                        <li>${isRTL ? 'المواقع الإلكترونية ووسائل التواصل الاجتماعي' : 'Websites and social media'}</li>
                        <li>${isRTL ? 'الصور الشخصية' : 'Profile photos'}</li>
                        <li>${isRTL ? 'الملاحظات' : 'Notes'}</li>
                    </ul>
                </div>

                <div class="docs-subsection">
                    <h2>${isRTL ? 'إدارة الروابط المفضلة' : 'Bookmark Management'}</h2>
                    <p>
                        ${isRTL ? 
                            'احفظ وصنف الروابط المهمة لسهولة الوصول إليها لاحقاً.' :
                            'Save and categorize important links for easy access later.'
                        }
                    </p>
                    
                    <h3>${isRTL ? 'الميزات المتاحة:' : 'Available Features:'}</h3>
                    <ul class="docs-list">
                        <li>${isRTL ? 'حفظ الروابط مع العناوين والأوصاف' : 'Save links with titles and descriptions'}</li>
                        <li>${isRTL ? 'تصنيف الروابط في فئات' : 'Categorize links into groups'}</li>
                        <li>${isRTL ? 'البحث السريع في الروابط' : 'Quick search through links'}</li>
                        <li>${isRTL ? 'استيراد الروابط من متصفحات أخرى' : 'Import links from other browsers'}</li>
                    </ul>
                </div>
            </div>
        `;
    },

// Documentation Module - ES Module Version
let container = null;
async function init(mainContainer) {
    container = mainContainer;
    container.innerHTML = '<div class="docs-content">Documentation Placeholder</div>';
}
function destroy() {
    if (container) container.innerHTML = '';
    container = null;
}
export default { init, destroy };

    getTroubleshootingContent: function() {
        const isRTL = Singularity.i18n.isRTL();
        
        return `
            <div class="docs-section">
                <h1 class="docs-title">${isRTL ? 'حل المشاكل' : 'Troubleshooting'}</h1>
                
                <div class="docs-subsection">
                    <h2>${isRTL ? 'المشاكل الشائعة' : 'Common Issues'}</h2>
                    
                    <div class="troubleshoot-item">
                        <h3><i class="fas fa-question-circle"></i> ${isRTL ? 'نسيت كلمة المرور الرئيسية' : 'Forgot Master Password'}</h3>
                        <p>
                            ${isRTL ? 
                                'للأسف، إذا نسيت كلمة المرور الرئيسية، لا يمكن استرداد البيانات المشفرة. هذا جزء من التصميم الأمني للنظام.' :
                                'Unfortunately, if you forget your master password, encrypted data cannot be recovered. This is part of the system\'s security design.'
                            }
                        </p>
                        <div class="troubleshoot-solution">
                            <strong>${isRTL ? 'الحلول:' : 'Solutions:'}</strong>
                            <ul>
                                <li>${isRTL ? 'استخدم نسخة احتياطية سابقة إذا كانت متوفرة' : 'Use a previous backup if available'}</li>
                                <li>${isRTL ? 'ابدأ من جديد بكلمة مرور جديدة' : 'Start fresh with a new password'}</li>
                                <li>${isRTL ? 'استخدم مدير كلمات مرور لحفظ كلمة المرور الرئيسية' : 'Use a password manager to save your master password'}</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="troubleshoot-item">
                        <h3><i class="fas fa-exclamation-triangle"></i> ${isRTL ? 'التطبيق لا يعمل' : 'Application Not Working'}</h3>
                        <p>
                            ${isRTL ? 
                                'إذا كان التطبيق لا يعمل بشكل صحيح، جرب الخطوات التالية:' :
                                'If the application is not working properly, try the following steps:'
                            }
                        </p>
                        <div class="troubleshoot-solution">
                            <ol>
                                <li>${isRTL ? 'أعد تحميل الصفحة (F5 أو Ctrl+R)' : 'Reload the page (F5 or Ctrl+R)'}</li>
                                <li>${isRTL ? 'امسح ذاكرة التخزين المؤقت للمتصفح' : 'Clear browser cache'}</li>
                                <li>${isRTL ? 'تأكد من أن JavaScript مفعل' : 'Make sure JavaScript is enabled'}</li>
                                <li>${isRTL ? 'جرب متصفح آخر' : 'Try a different browser'}</li>
                                <li>${isRTL ? 'تأكد من أن المتصفح محدث' : 'Make sure your browser is updated'}</li>
                            </ol>
                        </div>
                    </div>
                    
                    <div class="troubleshoot-item">
                        <h3><i class="fas fa-file-import"></i> ${isRTL ? 'مشاكل الاستيراد' : 'Import Issues'}</h3>
                        <p>
                            ${isRTL ? 
                                'إذا واجهت مشاكل في استيراد البيانات:' :
                                'If you encounter issues importing data:'
                            }
                        </p>
                        <div class="troubleshoot-solution">
                            <ul>
                                <li>${isRTL ? 'تأكد من أن الملف بالتنسيق الصحيح (JSON, CSV, HTML)' : 'Make sure the file is in the correct format (JSON, CSV, HTML)'}</li>
                                <li>${isRTL ? 'تحقق من حجم الملف (يجب أن يكون أقل من 10MB)' : 'Check file size (should be less than 10MB)'}</li>
                                <li>${isRTL ? 'تأكد من أن الملف غير تالف' : 'Make sure the file is not corrupted'}</li>
                                <li>${isRTL ? 'جرب استيراد ملف أصغر للاختبار' : 'Try importing a smaller file for testing'}</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="troubleshoot-item">
                        <h3><i class="fas fa-mobile-alt"></i> ${isRTL ? 'مشاكل على الأجهزة المحمولة' : 'Mobile Device Issues'}</h3>
                        <p>
                            ${isRTL ? 
                                'للحصول على أفضل تجربة على الأجهزة المحمولة:' :
                                'For the best experience on mobile devices:'
                            }
                        </p>
                        <div class="troubleshoot-solution">
                            <ul>
                                <li>${isRTL ? 'استخدم متصفح حديث (Chrome, Safari, Firefox)' : 'Use a modern browser (Chrome, Safari, Firefox)'}</li>
                                <li>${isRTL ? 'تأكد من وجود مساحة كافية على الجهاز' : 'Make sure there\'s enough storage space'}</li>
                                <li>${isRTL ? 'أغلق التطبيقات الأخرى لتوفير الذاكرة' : 'Close other apps to free up memory'}</li>
                                <li>${isRTL ? 'استخدم الوضع الأفقي للشاشات الصغيرة' : 'Use landscape mode for small screens'}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="docs-subsection">
                    <h2>${isRTL ? 'الحصول على المساعدة' : 'Getting Help'}</h2>
                    <p>
                        ${isRTL ? 
                            'إذا لم تجد حلاً لمشكلتك، يمكنك التواصل معنا:' :
                            'If you can\'t find a solution to your problem, you can contact us:'
                        }
                    </p>
                    
                    <div class="contact-support">
                        <div class="support-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <strong>${isRTL ? 'البريد الإلكتروني:' : 'Email:'}</strong>
                                <span>support@singularity-app.com</span>
                            </div>
                        </div>
                        
                        <div class="support-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>${isRTL ? 'ساعات الدعم:' : 'Support Hours:'}</strong>
                                <span>${isRTL ? '24/7 دعم فني' : '24/7 Technical Support'}</span>
                            </div>
                        </div>
                        
                        <div class="support-item">
                            <i class="fas fa-language"></i>
                            <div>
                                <strong>${isRTL ? 'اللغات المدعومة:' : 'Supported Languages:'}</strong>
                                <span>${isRTL ? 'العربية والإنجليزية' : 'Arabic and English'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};