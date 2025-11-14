// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registrerad:', registration.scope);

                // Kolla efter uppdateringar
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('🔄 Ny Service Worker hittad, installerar...');

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Ny version tillgänglig
                            showUpdateNotification();
                        }
                    });
                });

                // Registrera background sync om möjligt
                if ('sync' in registration) {
                    registerBackgroundSync(registration);
                }


            })
            .catch(error => {
                console.error('❌ Service Worker registrering misslyckades:', error);
            });

        // Hantera Service Worker uppdateringar
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });

                // Lyssna på meddelanden från service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'SYNC_SUCCESS') {
                console.log('✅ Background sync lyckades:', event.data.message);
                // Ta bort notifikationer för synkronisering - användaren behöver inte veta
                // showInAppNotification('Synkronisering klar', event.data.message, 'success');
                // addToNotificationHistory('Synkronisering klar', event.data.message, 'success');
            }
        });
    });
}

// PWA Install Prompt
let deferredPrompt;
const installButton = document.createElement('button');
installButton.id = 'installButton';
installButton.textContent = '📱 Installera App';
installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    display: none;
    transition: all 0.3s ease;
`;

installButton.addEventListener('mouseenter', () => {
    installButton.style.transform = 'translateY(-2px)';
    installButton.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
});

installButton.addEventListener('mouseleave', () => {
    installButton.style.transform = 'translateY(0)';
    installButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
});

document.body.appendChild(installButton);

// Kontrollera om appen redan är installerad vid start
const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                    window.navigator.standalone === true;

if (!isStandalone) {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Förhindra automatisk prompt
        e.preventDefault();
        deferredPrompt = e;

        // Visa installationsknappen
        installButton.style.display = 'block';

        console.log('💡 PWA kan installeras!');
    });
} else {
    console.log('✅ Appen är redan installerad');
}

installButton.addEventListener('click', async () => {
    if (!deferredPrompt) {
        alert('Installation är inte tillgänglig just nu. Försök ladda om sidan.');
        return;
    }

    try {
        // Visa installationsprompt
        deferredPrompt.prompt();

        // Vänta på användarens val
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('✅ Användaren accepterade installationen');
            installButton.style.display = 'none';
        } else {
            console.log('❌ Användaren avböjde installationen');
        }

        // Rensa prompt
        deferredPrompt = null;
    } catch (error) {
        console.error('Fel vid installation:', error);
        alert('Ett fel uppstod vid installationen. Försök igen.');
    }
});

// Dölj installationsknappen om appen redan är installerad
window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installerad!');
    installButton.style.display = 'none';
    deferredPrompt = null;
});

// Push Notification system - REMOVED as per user request

// Background Sync Registration
async function registerBackgroundSync() {
    try {
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
            await registration.sync.register('sync-data');
            console.log('✅ Background sync registrerad');
        }
    } catch (error) {
        console.error('Fel vid registrering av background sync:', error);
    }
}

// Register background sync when service worker is ready
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registerBackgroundSync);

    // Lyssna på meddelanden från service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SYNC_SUCCESS') {
            console.log('📡 Background sync framgång:', event.data.message);
            // Ta bort notifikationer för synkronisering - användaren behöver inte veta
            // showInAppNotification('Synkronisering klar', event.data.message, 'success');
            // addToNotificationHistory('Synkronisering klar', event.data.message, 'success');
        }
    });
}

// Test function for PWA tests - make install button visible for testing
function makeInstallButtonVisibleForTesting() {
    const installButton = document.getElementById('installButton');
    if (installButton && !isStandalone) {
        installButton.style.display = 'block';
        console.log('🧪 Installationsknapp synliggjord för testning');
    }
}

// Make install button visible if we're on test page
if (window.location.pathname.includes('test-pwa.html')) {
    // Wait a bit for everything to load
    setTimeout(makeInstallButtonVisibleForTesting, 1000);
}

// Notification History System - REMOVED as per user request

// Kolla om appen körs som PWA
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    console.log('✅ Appen körs som PWA');
    installButton.style.display = 'none';
}
