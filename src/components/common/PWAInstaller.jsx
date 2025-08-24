import React, { useState, useEffect } from 'react';
import Button from './Button';

const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    });

    // Listen for online/offline events
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    // Register service worker
    registerServiceWorker();

    // Check for updates
    checkForUpdates();
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              showUpdateNotification();
            }
          });
        });

        // Listen for controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('New service worker activated');
          window.location.reload();
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        await navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }
  };

  const showUpdateNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('TaskFlow Update Available', {
        body: 'A new version is available. Click to update.',
        icon: '/icons/icon-192x192.png',
        requireInteraction: true
      });
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
        // Subscribe to push notifications
        subscribeToPushNotifications();
      }
    }
  };

  const subscribeToPushNotifications = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
        });

        console.log('Push notification subscription:', subscription);
        
        // Send subscription to server
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription)
        });

      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
      }
    }
  };

  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('TaskFlow Test', {
        body: 'This is a test notification from TaskFlow!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        actions: [
          {
            action: 'view',
            title: 'View',
            icon: '/icons/icon-72x72.png'
          }
        ]
      });
    }
  };

  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <span>✅</span>
          <span>TaskFlow is installed!</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {showInstallButton && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span>📱</span>
            <span>Install TaskFlow</span>
            <Button
              onClick={handleInstallClick}
              className="ml-2 bg-white text-blue-500 px-3 py-1 rounded text-sm hover:bg-gray-100"
            >
              Install
            </Button>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-4 space-y-2">
        {/* Online/Offline Status */}
        <div className={`px-3 py-2 rounded-lg text-white text-sm ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="flex items-center space-x-2">
            <span>{isOnline ? '🟢' : '🔴'}</span>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        {/* PWA Controls */}
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg">
          <div className="text-sm font-semibold mb-2">PWA Controls</div>
          <div className="space-y-2">
            <Button
              onClick={requestNotificationPermission}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Enable Notifications
            </Button>
            <Button
              onClick={sendTestNotification}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Test Notification
            </Button>
            <Button
              onClick={checkForUpdates}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
            >
              Check Updates
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PWAInstaller;
