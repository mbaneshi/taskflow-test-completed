import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';

const useWebSocket = () => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const messageQueueRef = useRef([]);

  // WebSocket event handlers
  const handleOpen = useCallback(() => {
    console.log('WebSocket connected');
    setIsConnected(true);
    setConnectionStatus('connected');
    
    // Clear reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Start heartbeat
    startHeartbeat();
    
    // Send queued messages
    sendQueuedMessages();
    
    // Send user presence
    sendMessage({
      type: 'user_presence',
      data: { status: 'online' }
    });
  }, []);

  const handleClose = useCallback((event) => {
    console.log('WebSocket disconnected:', event.code, event.reason);
    setIsConnected(false);
    setConnectionStatus('disconnected');
    
    // Stop heartbeat
    stopHeartbeat();
    
    // Attempt to reconnect
    if (event.code !== 1000) { // Not a normal closure
      scheduleReconnect();
    }
  }, []);

  const handleError = useCallback((error) => {
    console.error('WebSocket error:', error);
    setConnectionStatus('error');
  }, []);

  const handleMessage = useCallback((event) => {
    try {
      const message = JSON.parse(event.data);
      handleWebSocketMessage(message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }, []);

  const handleWebSocketMessage = useCallback((message) => {
    const { type, data, user, timestamp } = message;

    switch (type) {
      case 'connection':
        console.log('Connected to WebSocket server:', data);
        break;
        
      case 'user_joined':
        handleUserJoined(user);
        break;
        
      case 'user_left':
        handleUserLeft(user);
        break;
        
      case 'user_offline':
        handleUserOffline(user);
        break;
        
      case 'user_presence':
        handleUserPresence(user);
        break;
        
      case 'task_updated':
        handleTaskUpdate(data);
        break;
        
      case 'task_commented':
        handleTaskComment(data);
        break;
        
      case 'task_assigned':
        handleTaskAssignment(data);
        break;
        
      case 'user_typing':
        handleUserTyping(user, data);
        break;
        
      case 'private_message':
        handlePrivateMessage(data);
        break;
        
      case 'notification':
        handleNotification(data);
        break;
        
      case 'room_joined':
        handleRoomJoined(data);
        break;
        
      case 'error':
        console.error('WebSocket server error:', data);
        break;
        
      default:
        console.log('Unknown WebSocket message type:', type, message);
    }
  }, []);

  // Message handlers
  const handleUserJoined = useCallback((user) => {
    setOnlineUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      if (!exists) {
        return [...prev, user];
      }
      return prev;
    });
    
    addNotification({
      type: 'info',
      message: `${user.username} joined`,
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleUserLeft = useCallback((user) => {
    setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
    
    addNotification({
      type: 'info',
      message: `${user.username} left`,
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleUserOffline = useCallback((user) => {
    setOnlineUsers(prev => prev.filter(u => u.id !== user.id));
  }, []);

  const handleUserPresence = useCallback((user) => {
    setOnlineUsers(prev => {
      const index = prev.findIndex(u => u.id === user.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...user };
        return updated;
      } else {
        return [...prev, user];
      }
    });
  }, []);

  const handleTaskUpdate = useCallback((data) => {
    addNotification({
      type: 'task_update',
      message: `Task "${data.task.title}" was updated by ${data.updatedBy.username}`,
      data: data,
      timestamp: data.timestamp
    });
    
    // Emit custom event for task updates
    window.dispatchEvent(new CustomEvent('taskUpdated', { detail: data }));
  }, []);

  const handleTaskComment = useCallback((data) => {
    addNotification({
      type: 'task_comment',
      message: `${data.comment.author.username} commented on task`,
      data: data,
      timestamp: data.timestamp
    });
    
    // Emit custom event for task comments
    window.dispatchEvent(new CustomEvent('taskCommented', { detail: data }));
  }, []);

  const handleTaskAssignment = useCallback((data) => {
    addNotification({
      type: 'task_assignment',
      message: `Task "${data.task.title}" was assigned to ${data.task.assignedTo}`,
      data: data,
      timestamp: data.timestamp
    });
    
    // Emit custom event for task assignments
    window.dispatchEvent(new CustomEvent('taskAssigned', { detail: data }));
  }, []);

  const handleUserTyping = useCallback((user, data) => {
    if (data.isTyping) {
      setTypingUsers(prev => new Set([...prev, user.username]));
    } else {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(user.username);
        return newSet;
      });
    }
  }, []);

  const handlePrivateMessage = useCallback((data) => {
    const newMessage = {
      id: Date.now(),
      from: data.from,
      message: data.message,
      timestamp: data.timestamp,
      type: 'private'
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    addNotification({
      type: 'private_message',
      message: `New message from ${data.from.username}`,
      data: data,
      timestamp: data.timestamp
    });
  }, []);

  const handleNotification = useCallback((data) => {
    addNotification({
      type: data.notification.type,
      message: data.notification.message,
      data: data.notification,
      timestamp: data.notification.timestamp
    });
  }, []);

  const handleRoomJoined = useCallback((data) => {
    console.log('Joined room:', data.roomId, 'Members:', data.members);
    setOnlineUsers(data.members);
  }, []);

  // Utility functions
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Keep only last 50 notifications
    if (prev.length > 50) {
      setNotifications(prev => prev.slice(-50));
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    heartbeatIntervalRef.current = setInterval(() => {
      if (isConnected && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds
  }, [isConnected]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) return;
    
    setConnectionStatus('reconnecting');
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, 5000); // Reconnect after 5 seconds
  }, []);

  const sendQueuedMessages = useCallback(() => {
    while (messageQueueRef.current.length > 0) {
      const message = messageQueueRef.current.shift();
      sendMessage(message);
    }
  }, []);

  // Public methods
  const connect = useCallback(() => {
    if (!user || !token) return;
    
    try {
      const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:5000'}/ws?token=${token}`;
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = handleOpen;
      wsRef.current.onclose = handleClose;
      wsRef.current.onerror = handleError;
      wsRef.current.onmessage = handleMessage;
      
      setConnectionStatus('connecting');
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('error');
    }
  }, [user, token, handleOpen, handleClose, handleError, handleMessage]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User initiated disconnect');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
    stopHeartbeat();
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, [stopHeartbeat]);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      // Queue message for later
      messageQueueRef.current.push(message);
    }
  }, []);

  const joinRoom = useCallback((roomId) => {
    sendMessage({
      type: 'join_room',
      roomId
    });
  }, [sendMessage]);

  const leaveRoom = useCallback((roomId) => {
    sendMessage({
      type: 'leave_room',
      roomId
    });
  }, [sendMessage]);

  const updateTask = useCallback((taskId, updates) => {
    sendMessage({
      type: 'task_update',
      data: { taskId, updates }
    });
  }, [sendMessage]);

  const addTaskComment = useCallback((taskId, comment) => {
    sendMessage({
      type: 'task_comment',
      data: { taskId, comment }
    });
  }, [sendMessage]);

  const assignTask = useCallback((taskId, assignedTo) => {
    sendMessage({
      type: 'task_assignment',
      data: { taskId, assignedTo, assignedBy: user?.id }
    });
  }, [sendMessage, user]);

  const sendPrivateMessage = useCallback((targetUserId, message) => {
    sendMessage({
      type: 'private_message',
      targetUserId,
      data: { message }
    });
  }, [sendMessage]);

  const setUserTyping = useCallback((roomId, isTyping) => {
    sendMessage({
      type: 'user_typing',
      data: { roomId, isTyping }
    });
  }, [sendMessage]);

  const setUserPresence = useCallback((status) => {
    sendMessage({
      type: 'user_presence',
      data: { status }
    });
  }, [sendMessage]);

  const sendNotification = useCallback((type, message, targetUsers = []) => {
    sendMessage({
      type: 'notification',
      data: { type, message, targetUsers }
    });
  }, [sendMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [disconnect]);

  // Auto-connect when user/token changes
  useEffect(() => {
    if (user && token) {
      connect();
    } else {
      disconnect();
    }
  }, [user, token, connect, disconnect]);

  return {
    // State
    isConnected,
    connectionStatus,
    onlineUsers,
    messages,
    notifications,
    typingUsers,
    
    // Methods
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    leaveRoom,
    updateTask,
    addTaskComment,
    assignTask,
    sendPrivateMessage,
    setUserTyping,
    setUserPresence,
    sendNotification,
    
    // Utility
    clearNotifications: () => setNotifications([]),
    clearMessages: () => setMessages([])
  };
};

export default useWebSocket;
