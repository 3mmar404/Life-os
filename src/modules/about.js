// Professional about page for commercial version

// About Module - ES Module Version
let container = null;
function renderLayout() {
    if (!container) return;
    container.innerHTML = '<div class="about-hero">About Page</div>';
}
async function init(mainContainer) {
    container = mainContainer;
    renderLayout();
}
function destroy() {
    if (container) container.innerHTML = '';
    container = null;
}
export default { init, destroy };

                <!-- Description Section -->
                <div class="about-section">
                    <div class="section-content">
                        <h2 class="section-title" data-i18n="aboutUs">${Singularity.i18n.t('aboutUs')}</h2>
                        <p class="section-text" data-i18n="aboutDescription">
                            ${Singularity.i18n.t('aboutDescription')}
                        </p>
                    </div>
                </div>

                <!-- Features Section -->
                <div class="about-section">
                    <div class="section-content">
                        <h2 class="section-title" data-i18n="features">${Singularity.i18n.t('features')}</h2>
                        <div class="features-grid">
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-lock"></i>
                                </div>
                                <h3 class="feature-title">${isRTL ? 'تشفير عسكري المستوى' : 'Military-Grade Encryption'}</h3>
                                <p class="feature-description" data-i18n="feature1">${Singularity.i18n.t('feature1')}</p>
                            </div>
                            
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-palette"></i>
                                </div>
                                <h3 class="feature-title">${isRTL ? 'واجهة عصرية' : 'Modern Interface'}</h3>
                                <p class="feature-description" data-i18n="feature2">${Singularity.i18n.t('feature2')}</p>
                            </div>
                            
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-globe"></i>
                                </div>
                                <h3 class="feature-title">${isRTL ? 'دعم متعدد اللغات' : 'Multi-Language Support'}</h3>
                                <p class="feature-description" data-i18n="feature3">${Singularity.i18n.t('feature3')}</p>
                            </div>
                            
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                </div>
                                <h3 class="feature-title">${isRTL ? 'نسخ احتياطية آمنة' : 'Secure Backups'}</h3>
                                <p class="feature-description" data-i18n="feature4">${Singularity.i18n.t('feature4')}</p>
                            </div>
                            
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-exchange-alt"></i>
                                </div>
                                <h3 class="feature-title">${isRTL ? 'استيراد وتصدير' : 'Import & Export'}</h3>
                                <p class="feature-description" data-i18n="feature5">${Singularity.i18n.t('feature5')}</p>
                            </div>
                            
                            <div class="feature-card">
                                <div class="feature-icon">
                                    <i class="fas fa-wifi-slash"></i>
                                </div>
                                <h3 class="feature-title">${isRTL ? 'عمل بدون إنترنت' : 'Offline Operation'}</h3>
                                <p class="feature-description" data-i18n="feature6">${Singularity.i18n.t('feature6')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Technical Specifications -->
                <div class="about-section">
                    <div class="section-content">
                        <h2 class="section-title">${isRTL ? 'المواصفات التقنية' : 'Technical Specifications'}</h2>
                        <div class="specs-grid">
                            <div class="spec-item">
                                <div class="spec-label">${isRTL ? 'التشفير' : 'Encryption'}</div>
                                <div class="spec-value">AES-256-GCM</div>
                            </div>
                            <div class="spec-item">
                                <div class="spec-label">${isRTL ? 'اشتقاق المفاتيح' : 'Key Derivation'}</div>
                                <div class="spec-value">PBKDF2 (100,000 iterations)</div>
                            </div>
                            <div class="spec-item">
                                <div class="spec-label">${isRTL ? 'التخزين' : 'Storage'}</div>
                                <div class="spec-value">${isRTL ? 'محلي مشفر' : 'Local Encrypted'}</div>
                            </div>
                            <div class="spec-item">
                                <div class="spec-label">${isRTL ? 'المتصفحات المدعومة' : 'Supported Browsers'}</div>
                                <div class="spec-value">${isRTL ? 'جميع المتصفحات الحديثة' : 'All Modern Browsers'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Developer Info -->
                <div class="about-section">
                    <div class="section-content">
                        <h2 class="section-title">${isRTL ? 'معلومات المطور' : 'Developer Information'}</h2>
                        <div class="developer-info">
                            <div class="developer-card">
                                <div class="developer-avatar">
                                    <i class="fas fa-user-tie"></i>
                                </div>
                                <div class="developer-details">
                                    <h3 class="developer-name">${isRTL ? 'فريق سينجولاريتي' : 'Singularity Team'}</h3>
                                    <p class="developer-title">${isRTL ? 'خبراء الأمن السيبراني' : 'Cybersecurity Experts'}</p>
                                    <p class="developer-description">
                                        ${isRTL ? 
                                            'فريق من المطورين المتخصصين في أمن المعلومات وحماية البيانات الشخصية.' :
                                            'A team of developers specialized in information security and personal data protection.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- License and Legal -->
                <div class="about-section">
                    <div class="section-content">
                        <h2 class="section-title">${isRTL ? 'الترخيص والقانونية' : 'License & Legal'}</h2>
                        <div class="legal-info">
                            <div class="legal-item">
                                <h4>${isRTL ? 'نوع الترخيص' : 'License Type'}</h4>
                                <p>${isRTL ? 'ترخيص تجاري - الإصدار المحترف' : 'Commercial License - Professional Edition'}</p>
                            </div>
                            <div class="legal-item">
                                <h4>${isRTL ? 'حقوق الطبع والنشر' : 'Copyright'}</h4>
                                <p>© 2024 Singularity Team. ${isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
                            </div>
                            <div class="legal-item">
                                <h4>${isRTL ? 'الخصوصية' : 'Privacy'}</h4>
                                <p>${isRTL ? 
                                    'جميع بياناتك تبقى على جهازك ولا يتم إرسالها لأي خادم خارجي.' :
                                    'All your data stays on your device and is never sent to any external server.'
                                }</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Contact Section -->
                <div class="about-section">
                    <div class="section-content">
                        <h2 class="section-title">${isRTL ? 'تواصل معنا' : 'Contact Us'}</h2>
                        <div class="contact-info">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>support@singularity-app.com</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-globe"></i>
                                <span>www.singularity-app.com</span>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-shield-alt"></i>
                                <span>${isRTL ? 'دعم فني 24/7' : '24/7 Technical Support'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};