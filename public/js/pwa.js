// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('Service Worker update found!');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content is available; please refresh.');
              // You can show an update notification here
              showUpdateNotification();
            }
          });
        });
      })
      .catch(function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Function to show update notification
function showUpdateNotification() {
  if (confirm('A new version of Full Moon Hotels is available. Reload to update?')) {
    window.location.reload();
  }
}

// Network status monitoring
window.addEventListener('online', function(e) {
  console.log('You are online');
  showOnlineNotification();
});

window.addEventListener('offline', function(e) {
  console.log('You are offline');
  showOfflineNotification();
});

function showOnlineNotification() {
  const notification = document.createElement('div');
  notification.className = 'network-notification online';
  notification.innerHTML = `
    <i class="fa fa-wifi"></i>
    <span>You're back online!</span>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function showOfflineNotification() {
  const notification = document.createElement('div');
  notification.className = 'network-notification offline';
  notification.innerHTML = `
    <i class="fa fa-wifi-slash"></i>
    <span>You're offline. Some features may be limited.</span>
  `;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Add CSS for network notifications
const style = document.createElement('style');
style.textContent = `
  .network-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease-out;
  }
  
  .network-notification.online {
    background: #28a745;
  }
  
  .network-notification.offline {
    background: #dc3545;
  }
  
  .network-notification i {
    font-size: 18px;
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);