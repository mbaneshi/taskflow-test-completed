import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

const IntegrationHub = () => {
  const { user } = useAuth();
  const [integrations, setIntegrations] = useState([
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync task deadlines with your Google Calendar',
      icon: '📅',
      status: 'connected',
      lastSync: '2 hours ago',
      category: 'Calendar',
      features: ['Task deadlines', 'Meeting reminders', 'Time blocking']
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications and updates in your Slack channels',
      icon: '💬',
      status: 'connected',
      lastSync: '1 hour ago',
      category: 'Communication',
      features: ['Task updates', 'Deadline reminders', 'Team notifications']
    },
    {
      id: 'github',
      name: 'GitHub',
      description: 'Link tasks to code commits and pull requests',
      icon: '🐙',
      status: 'connected',
      lastSync: '30 minutes ago',
      category: 'Development',
      features: ['Commit linking', 'PR tracking', 'Issue sync']
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Import and sync boards with TaskFlow',
      icon: '📋',
      status: 'available',
      lastSync: null,
      category: 'Project Management',
      features: ['Board import', 'Card sync', 'List management']
    },
    {
      id: 'jira',
      name: 'Jira',
      description: 'Sync with Jira issues and epics',
      icon: '🦗',
      status: 'available',
      lastSync: null,
      category: 'Project Management',
      features: ['Issue sync', 'Epic tracking', 'Sprint planning']
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 1000+ apps and automate workflows',
      icon: '⚡',
      status: 'available',
      lastSync: null,
      category: 'Automation',
      features: ['Workflow automation', 'App connections', 'Custom triggers']
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Sync tasks with Notion databases and pages',
      icon: '📝',
      status: 'available',
      lastSync: null,
      category: 'Documentation',
      features: ['Database sync', 'Page linking', 'Content export']
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      description: 'Get notifications and updates in Teams channels',
      icon: '💼',
      status: 'available',
      lastSync: null,
      category: 'Communication',
      features: ['Channel notifications', 'Meeting integration', 'File sharing']
    }
  ]);

  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [syncSettings, setSyncSettings] = useState({
    autoSync: true,
    syncInterval: '15min',
    notifications: true,
    bidirectional: false
  });

  const categories = ['All', 'Calendar', 'Communication', 'Development', 'Project Management', 'Automation', 'Documentation'];

  const connectIntegration = (integrationId) => {
    const integration = integrations.find(i => i.id === integrationId);
    setSelectedIntegration(integration);
    setShowConnectModal(true);
  };

  const disconnectIntegration = (integrationId) => {
    setIntegrations(integrations.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'available', lastSync: null }
        : integration
    ));
  };

  const handleConnect = () => {
    if (!webhookUrl && !apiKey) {
      alert('Please provide either a webhook URL or API key');
      return;
    }

    // Simulate connection process
    setIntegrations(integrations.map(integration => 
      integration.id === selectedIntegration.id 
        ? { 
            ...integration, 
            status: 'connected', 
            lastSync: 'Just now',
            webhookUrl: webhookUrl || null,
            apiKey: apiKey || null
          }
        : integration
    ));

    setShowConnectModal(false);
    setWebhookUrl('');
    setApiKey('');
    setSelectedIntegration(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'connecting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return '✅';
      case 'connecting': return '⏳';
      case 'error': return '❌';
      default: return '🔗';
    }
  };

  const filteredIntegrations = integrations.filter(integration => 
    categories.includes('All') || integration.category === categories.find(c => c !== 'All')
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integration Hub</h1>
            <p className="text-gray-600">Connect TaskFlow with your favorite tools and automate your workflow</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setSyncSettings({ ...syncSettings, autoSync: !syncSettings.autoSync })}
              className={`px-4 py-2 rounded-lg ${
                syncSettings.autoSync
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
              }`}
            >
              {syncSettings.autoSync ? '🔄 Auto-Sync ON' : '⏸️ Auto-Sync OFF'}
            </Button>
            
            <Button
              onClick={() => {/* Open settings */}}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              ⚙️ Settings
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              className="px-4 py-2 rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Integration Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{integration.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.category}</p>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(integration.status)}`}>
                {getStatusIcon(integration.status)} {integration.status}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

            {/* Features */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
              <div className="space-y-1">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Status and Actions */}
            <div className="border-t border-gray-200 pt-4">
              {integration.status === 'connected' ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    Last sync: {integration.lastSync}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {/* Sync now */}}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      🔄 Sync Now
                    </Button>
                    <Button
                      onClick={() => disconnectIntegration(integration.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm text-gray-500">
                    Not connected
                  </div>
                  <Button
                    onClick={() => connectIntegration(integration.id)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    🔗 Connect
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {showConnectModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedIntegration.icon}</span>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Connect {selectedIntegration.name}</h2>
                  <p className="text-sm text-gray-600">{selectedIntegration.description}</p>
                </div>
              </div>
              <Button
                onClick={() => setShowConnectModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
              >
                ✕
              </Button>
            </div>

            {/* Connection Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL (Optional)
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key (Optional)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="text-sm text-gray-600">
                <p>💡 <strong>Tip:</strong> You only need to provide one of these fields. For most integrations, a webhook URL is sufficient.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <Button
                onClick={() => setShowConnectModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Connect
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Testing Section */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Your Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Send Test Notification</h3>
            <div className="space-y-3">
              <Button
                onClick={() => {/* Test Slack */}}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                📱 Test Slack Integration
              </Button>
              <Button
                onClick={() => {/* Test Calendar */}}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                📅 Test Calendar Integration
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Integration Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Connected Integrations:</span>
                <span className="font-medium text-green-600">
                  {integrations.filter(i => i.status === 'connected').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Available Integrations:</span>
                <span className="font-medium text-blue-600">
                  {integrations.filter(i => i.status === 'available').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Sync:</span>
                <span className="font-medium text-gray-600">
                  {integrations.find(i => i.status === 'connected')?.lastSync || 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHub;
