import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const TwoFactorAuth = () => {
  const { user, token } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    check2FAStatus();
  }, []);

  const check2FAStatus = async () => {
    try {
      const response = await fetch('/api/auth/2fa/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsEnabled(data.isEnabled);
        setIsSetup(data.isSetup);
      }
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  const setup2FA = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode);
        setSecretKey(data.secretKey);
        setBackupCodes(data.backupCodes);
        setIsSetup(true);
        setSuccess('2FA setup initiated. Please scan the QR code with your authenticator app.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to setup 2FA');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable2FA = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: verificationCode,
          secretKey: secretKey
        })
      });
      
      if (response.ok) {
        setIsEnabled(true);
        setIsSetup(false);
        setSuccess('Two-factor authentication enabled successfully!');
        setVerificationCode('');
        setQrCode('');
        setSecretKey('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid verification code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code to disable 2FA');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/2fa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: verificationCode
        })
      });
      
      if (response.ok) {
        setIsEnabled(false);
        setSuccess('Two-factor authentication disabled successfully!');
        setVerificationCode('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to disable 2FA');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateNewBackupCodes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/auth/2fa/backup-codes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBackupCodes(data.backupCodes);
        setSuccess('New backup codes generated successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to generate backup codes');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
        <p className="text-gray-600">
          Add an extra layer of security to your account
        </p>
      </div>

      {/* Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Current Status</h3>
            <p className="text-sm text-gray-600">
              {isEnabled ? '🟢 Enabled' : '🔴 Disabled'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isEnabled ? 'Secure' : 'At Risk'}
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Setup 2FA */}
      {!isEnabled && !isSetup && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Enable Two-Factor Authentication</h3>
          <p className="text-sm text-blue-700 mb-4">
            Protect your account with an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator.
          </p>
          <Button
            onClick={setup2FA}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Setup 2FA
          </Button>
        </div>
      )}

      {/* QR Code Setup */}
      {isSetup && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold text-gray-900 mb-4">Setup Instructions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code */}
            <div className="text-center">
              <h4 className="font-medium text-gray-700 mb-3">1. Scan QR Code</h4>
              {qrCode && (
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>
              )}
            </div>

            {/* Manual Entry */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">2. Manual Entry (if needed)</h4>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm text-gray-600 mb-2">Secret Key:</p>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {secretKey}
                  </code>
                  <Button
                    onClick={() => copyToClipboard(secretKey)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-3">3. Verify Setup</h4>
            <div className="flex space-x-3">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={6}
              />
              <Button
                onClick={verifyAndEnable2FA}
                disabled={!verificationCode.trim()}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
              >
                Verify & Enable
              </Button>
            </div>
          </div>

          {/* Backup Codes */}
          {backupCodes.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-3">4. Save Backup Codes</h4>
              <div className="bg-white p-4 rounded border">
                <p className="text-sm text-gray-600 mb-3">
                  Save these backup codes in a secure location. You can use them to access your account if you lose your authenticator device.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {backupCodes.map((code, index) => (
                    <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-center">
                      {code}
                    </code>
                  ))}
                </div>
                <Button
                  onClick={() => copyToClipboard(backupCodes.join('\n'))}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                >
                  Copy All Codes
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disable 2FA */}
      {isEnabled && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-900 mb-2">Disable Two-Factor Authentication</h3>
          <p className="text-sm text-red-700 mb-4">
            Warning: Disabling 2FA will make your account less secure.
          </p>
          <div className="flex space-x-3">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code to disable"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              maxLength={6}
            />
            <Button
              onClick={disable2FA}
              disabled={!verificationCode.trim()}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              Disable 2FA
            </Button>
          </div>
        </div>
      )}

      {/* Backup Codes Management */}
      {isEnabled && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">Backup Codes</h3>
          <p className="text-sm text-yellow-700 mb-4">
            Generate new backup codes if you've used most of your current ones.
          </p>
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowBackupCodes(!showBackupCodes)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
            >
              {showBackupCodes ? 'Hide' : 'Show'} Backup Codes
            </Button>
            <Button
              onClick={generateNewBackupCodes}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Generate New Codes
            </Button>
          </div>

          {showBackupCodes && backupCodes.length > 0 && (
            <div className="mt-4 bg-white p-4 rounded border">
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, index) => (
                  <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-center">
                    {code}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Tips */}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <h3 className="font-semibold text-gray-900 mb-3">Security Tips</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Use a dedicated authenticator app, not SMS</li>
          <li>• Keep your backup codes in a secure location</li>
          <li>• Never share your 2FA codes with anyone</li>
          <li>• Consider using a hardware security key for maximum security</li>
        </ul>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
