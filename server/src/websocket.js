import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Task from './models/Task.js';

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Map to store client connections
    this.rooms = new Map(); // Map to store room members
    
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', async (ws, req) => {
      try {
        // Authenticate the connection
        const user = await this.authenticateConnection(req);
        if (!user) {
          ws.close(4001, 'Authentication failed');
          return;
        }

        // Store client connection
        this.clients.set(ws, {
          userId: user._id,
          username: user.username,
          role: user.role,
          ws: ws
        });

        console.log(`WebSocket connected: ${user.username} (${user._id})`);

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'connection',
          message: 'Connected to TaskFlow real-time server',
          user: {
            id: user._id,
            username: user.username,
            role: user.role
          }
        }));

        // Handle incoming messages
        ws.on('message', async (data) => {
          try {
            const message = JSON.parse(data);
            await this.handleMessage(ws, message, user);
          } catch (error) {
            console.error('Error handling WebSocket message:', error);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Invalid message format'
            }));
          }
        });

        // Handle client disconnect
        ws.on('close', () => {
          this.handleDisconnect(ws, user);
        });

        // Handle errors
        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.handleDisconnect(ws, user);
        });

      } catch (error) {
        console.error('Error setting up WebSocket connection:', error);
        ws.close(4000, 'Connection setup failed');
      }
    });
  }

  async authenticateConnection(req) {
    try {
      // Extract token from query string or headers
      const token = req.url.split('token=')[1] || req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return null;
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('WebSocket authentication error:', error);
      return null;
    }
  }

  async handleMessage(ws, message, user) {
    const { type, data, roomId, targetUserId } = message;

    switch (type) {
      case 'join_room':
        await this.joinRoom(ws, roomId, user);
        break;
      
      case 'leave_room':
        await this.leaveRoom(ws, roomId, user);
        break;
      
      case 'task_update':
        await this.broadcastTaskUpdate(ws, data, user);
        break;
      
      case 'task_comment':
        await this.broadcastTaskComment(ws, data, user);
        break;
      
      case 'user_typing':
        await this.broadcastUserTyping(ws, data, user);
        break;
      
      case 'user_presence':
        await this.broadcastUserPresence(ws, data, user);
        break;
      
      case 'private_message':
        await this.sendPrivateMessage(ws, targetUserId, data, user);
        break;
      
      case 'task_assignment':
        await this.broadcastTaskAssignment(ws, data, user);
        break;
      
      case 'notification':
        await this.broadcastNotification(ws, data, user);
        break;
      
      default:
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Unknown message type'
        }));
    }
  }

  async joinRoom(ws, roomId, user) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }

    this.rooms.get(roomId).add(ws);
    
    // Notify room members
    this.broadcastToRoom(roomId, {
      type: 'user_joined',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      },
      timestamp: new Date().toISOString()
    }, ws);

    // Send room info to joining user
    ws.send(JSON.stringify({
      type: 'room_joined',
      roomId,
      members: Array.from(this.rooms.get(roomId)).map(client => {
        const clientInfo = this.clients.get(client);
        return {
          id: clientInfo.userId,
          username: clientInfo.username,
          role: clientInfo.role
        };
      })
    }));
  }

  async leaveRoom(ws, roomId, user) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(ws);
      
      // Remove room if empty
      if (this.rooms.get(roomId).size === 0) {
        this.rooms.delete(roomId);
      } else {
        // Notify remaining room members
        this.broadcastToRoom(roomId, {
          type: 'user_left',
          user: {
            id: user._id,
            username: user.username
          },
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async broadcastTaskUpdate(ws, taskData, user) {
    const { taskId, updates } = taskData;
    
    // Update task in database
    try {
      const task = await Task.findByIdAndUpdate(
        taskId,
        { ...updates, lastModified: new Date() },
        { new: true }
      );

      if (task) {
        // Broadcast to all users (or specific room if implemented)
        this.broadcastToAll({
          type: 'task_updated',
          task: {
            id: task._id,
            title: task.title,
            status: task.status,
            priority: task.priority,
            assignedTo: task.assignedTo,
            lastModified: task.lastModified
          },
          updatedBy: {
            id: user._id,
            username: user.username
          },
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating task:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to update task'
      }));
    }
  }

  async broadcastTaskComment(ws, commentData, user) {
    const { taskId, comment } = commentData;
    
    try {
      // Add comment to task
      const task = await Task.findByIdAndUpdate(
        taskId,
        {
          $push: {
            comments: {
              text: comment,
              author: user._id,
              timestamp: new Date()
            }
          }
        },
        { new: true }
      );

      if (task) {
        // Broadcast comment to all users
        this.broadcastToAll({
          type: 'task_commented',
          taskId,
          comment: {
            text: comment,
            author: {
              id: user._id,
              username: user.username
            },
            timestamp: new Date().toISOString()
          }
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to add comment'
      }));
    }
  }

  async broadcastUserTyping(ws, data, user) {
    const { roomId, isTyping } = data;
    
    if (roomId && this.rooms.has(roomId)) {
      this.broadcastToRoom(roomId, {
        type: 'user_typing',
        user: {
          id: user._id,
          username: user.username
        },
        isTyping,
        timestamp: new Date().toISOString()
      }, ws);
    }
  }

  async broadcastUserPresence(ws, data, user) {
    const { status } = data; // online, away, busy, offline
    
    // Update user status in database
    try {
      await User.findByIdAndUpdate(user._id, {
        lastSeen: new Date(),
        status: status
      });

      // Broadcast presence to all users
      this.broadcastToAll({
        type: 'user_presence',
        user: {
          id: user._id,
          username: user.username,
          status: status,
          lastSeen: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error updating user presence:', error);
    }
  }

  async sendPrivateMessage(ws, targetUserId, messageData, user) {
    const targetClient = Array.from(this.clients.values())
      .find(client => client.userId.toString() === targetUserId);

    if (targetClient) {
      targetClient.ws.send(JSON.stringify({
        type: 'private_message',
        from: {
          id: user._id,
          username: user.username
        },
        message: messageData.message,
        timestamp: new Date().toISOString()
      }));

      // Send confirmation to sender
      ws.send(JSON.stringify({
        type: 'message_sent',
        to: targetUserId,
        timestamp: new Date().toISOString()
      }));
    } else {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'User not found or offline'
      }));
    }
  }

  async broadcastTaskAssignment(ws, assignmentData, user) {
    const { taskId, assignedTo, assignedBy } = assignmentData;
    
    try {
      // Update task assignment in database
      const task = await Task.findByIdAndUpdate(
        taskId,
        {
          assignedTo: assignedTo,
          assignedBy: assignedBy,
          assignedAt: new Date()
        },
        { new: true }
      );

      if (task) {
        // Broadcast assignment to all users
        this.broadcastToAll({
          type: 'task_assigned',
          task: {
            id: task._id,
            title: task.title,
            assignedTo: task.assignedTo,
            assignedBy: task.assignedBy,
            assignedAt: task.assignedAt
          },
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to assign task'
      }));
    }
  }

  async broadcastNotification(ws, notificationData, user) {
    const { type, message, targetUsers } = notificationData;
    
    // Send notification to specific users or all users
    if (targetUsers && targetUsers.length > 0) {
      targetUsers.forEach(targetUserId => {
        const targetClient = Array.from(this.clients.values())
          .find(client => client.userId.toString() === targetUserId);
        
        if (targetClient) {
          targetClient.ws.send(JSON.stringify({
            type: 'notification',
            notification: {
              type: type,
              message: message,
              from: {
                id: user._id,
                username: user.username
              },
              timestamp: new Date().toISOString()
            }
          }));
        }
      });
    } else {
      // Broadcast to all users
      this.broadcastToAll({
        type: 'notification',
        notification: {
          type: type,
          message: message,
          from: {
            id: user._id,
            username: user.username
          },
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  broadcastToRoom(roomId, message, excludeWs = null) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).forEach(client => {
        if (client !== excludeWs) {
          try {
            client.send(JSON.stringify(message));
          } catch (error) {
            console.error('Error sending message to client:', error);
            this.handleDisconnect(client);
          }
        }
      });
    }
  }

  broadcastToAll(message) {
    this.clients.forEach((clientInfo, ws) => {
      try {
        ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Error broadcasting message:', error);
        this.handleDisconnect(ws);
      }
    });
  }

  handleDisconnect(ws, user) {
    // Remove from all rooms
    this.rooms.forEach((roomMembers, roomId) => {
      if (roomMembers.has(ws)) {
        roomMembers.delete(ws);
        
        if (roomMembers.size === 0) {
          this.rooms.delete(roomId);
        } else if (user) {
          // Notify remaining room members
          this.broadcastToRoom(roomId, {
            type: 'user_disconnected',
            user: {
              id: user._id,
              username: user.username
            },
            timestamp: new Date().toISOString()
          });
        }
      }
    });

    // Remove client
    this.clients.delete(ws);

    if (user) {
      console.log(`WebSocket disconnected: ${user.username} (${user._id})`);
      
      // Broadcast user offline status
      this.broadcastToAll({
        type: 'user_offline',
        user: {
          id: user._id,
          username: user.username
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get online users count
  getOnlineUsersCount() {
    return this.clients.size;
  }

  // Get room members count
  getRoomMembersCount(roomId) {
    return this.rooms.has(roomId) ? this.rooms.get(roomId).size : 0;
  }

  // Get all online users
  getOnlineUsers() {
    return Array.from(this.clients.values()).map(client => ({
      id: client.userId,
      username: client.username,
      role: client.role
    }));
  }
}

export default WebSocketServer;
