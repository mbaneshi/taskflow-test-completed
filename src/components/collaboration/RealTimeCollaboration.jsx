import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';

const RealTimeCollaboration = () => {
  const { user } = useAuth();
  const {
    isConnected,
    connectionStatus,
    onlineUsers,
    messages,
    notifications,
    typingUsers,
    joinRoom,
    leaveRoom,
    sendPrivateMessage,
    setUserTyping,
    setUserPresence,
    sendNotification,
    clearNotifications,
    clearMessages
  } = useWebSocket();

  const [activeRoom, setActiveRoom] = useState('general');
  const [messageInput, setMessageInput] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [userStatus, setUserStatus] = useState('online');
  const [isTyping, setIsTyping] = useState(false);
  
  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join room when component mounts
  useEffect(() => {
    if (isConnected) {
      joinRoom(activeRoom);
    }
  }, [isConnected, activeRoom, joinRoom]);

  // Handle typing indicator
  useEffect(() => {
    if (isTyping) {
      setUserTyping(activeRoom, true);
      
      // Clear typing indicator after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setUserTyping(activeRoom, false);
      }, 3000);
    } else {
      setUserTyping(activeRoom, false);
    }
  }, [isTyping, activeRoom, setUserTyping]);

  // Cleanup typing timeout
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    if (selectedUser) {
      // Send private message
      sendPrivateMessage(selectedUser.id, messageInput);
    } else {
      // Send room message (implement room messaging if needed)
      console.log('Room messaging not implemented yet');
    }

    setMessageInput('');
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      setIsTyping(true);
    }
  };

  const handleUserStatusChange = (status) => {
    setUserStatus(status);
    setUserPresence(status);
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    setShowChat(true);
  };

  const handleNotification = (type, message) => {
    sendNotification(type, message);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500';
      case 'reconnecting': return 'bg-orange-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Connection Status */}
      <div className="mb-2 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getConnectionStatusColor()}`}></div>
        <span className="text-sm text-gray-600 capitalize">{connectionStatus}</span>
      </div>

      {/* Main Collaboration Panel */}
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Real-Time Collaboration</h3>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowOnlineUsers(!showOnlineUsers)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded text-xs"
              >
                {showOnlineUsers ? 'Hide' : 'Users'}
              </Button>
              <Button
                onClick={() => setShowChat(!showChat)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-2 py-1 rounded text-xs"
              >
                {showChat ? 'Hide' : 'Chat'}
              </Button>
            </div>
          </div>
          
          {/* User Status */}
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-sm">Status:</span>
            <select
              value={userStatus}
              onChange={(e) => handleUserStatusChange(e.target.value)}
              className="bg-white bg-opacity-20 text-white text-sm rounded px-2 py-1 border border-white border-opacity-30"
            >
              <option value="online">🟢 Online</option>
              <option value="away">🟡 Away</option>
              <option value="busy">🔴 Busy</option>
              <option value="offline">⚫ Offline</option>
            </select>
          </div>
        </div>

        {/* Online Users Panel */}
        {showOnlineUsers && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3">
              Online Users ({onlineUsers.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {onlineUsers.map((onlineUser) => (
                <div
                  key={onlineUser.id}
                  onClick={() => handleUserSelect(onlineUser)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(onlineUser.status || 'online')}`}></div>
                  <span className="text-sm font-medium text-gray-700">
                    {onlineUser.username}
                  </span>
                  {onlineUser.role === 'admin' && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">
                {selectedUser ? `Chat with ${selectedUser.username}` : 'General Chat'}
              </h4>
              <Button
                onClick={() => setSelectedUser(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                ✕
              </Button>
            </div>

            {/* Messages */}
            <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-2 rounded ${
                    message.from?.id === user?.id
                      ? 'bg-blue-100 ml-4'
                      : 'bg-gray-100 mr-4'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {message.from?.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{message.message}</p>
                </div>
              ))}
              
              {/* Typing indicators */}
              {typingUsers.size > 0 && (
                <div className="text-xs text-gray-500 italic">
                  {Array.from(typingUsers).join(', ')} is typing...
                </div>
              )}
              
              <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedUser ? `Message ${selectedUser.username}...` : 'Type a message...'}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
              >
                Send
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-4 bg-gray-50 rounded-b-lg">
          <div className="flex space-x-2">
            <Button
              onClick={() => handleNotification('info', 'Hello from TaskFlow!')}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm"
            >
              Test Notification
            </Button>
            <Button
              onClick={clearNotifications}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm"
            >
              Clear Notifications
            </Button>
          </div>
          
          {/* Notifications Count */}
          {notifications.length > 0 && (
            <div className="mt-2 text-xs text-gray-600">
              {notifications.length} notification(s)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealTimeCollaboration;
