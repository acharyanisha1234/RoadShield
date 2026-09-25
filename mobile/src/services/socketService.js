/**
 * Socket.IO client service
 * Manages connection lifecycle and event subscriptions
 */

import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  /**
   * Connect to Socket.IO server
   */
  async connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.warn('[Socket] No token found, skipping connection');
        return null;
      }

      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      this.setupListeners();

      return this.socket;
    } catch (error) {
      console.error('[Socket] Connection failed:', error);
      return null;
    }
  }

  /**
   * Internal event listeners
   */
  setupListeners() {
    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket.id);
      this.isConnected = true;
      this.emit('connection:status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
      this.isConnected = false;
      this.emit('connection:status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    // Forward server events to registered listeners
    this.socket.on('report:new', (data) => {
      this.emit('report:new', data);
    });

    this.socket.on('report:update', (data) => {
      this.emit('report:update', data);
    });

    this.socket.on('sos:alert', (data) => {
      this.emit('sos:alert', data);
    });

    this.socket.on('users:online', (data) => {
      this.emit('users:online', data);
    });
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Subscribe to server event
   */
  subscribe(event, callback) {
    if (!this.socket) return;

    this.socket.on(event, callback);

    // Track for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Unsubscribe from event
   */
  unsubscribe(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  /**
   * Emit event to server
   */
  emitToServer(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Local event emitter (for internal listeners)
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Subscribe to reports room
   */
  subscribeToReports() {
    this.emitToServer('reports:subscribe');
  }

  /**
   * Send location update
   */
  updateLocation(latitude, longitude) {
    this.emitToServer('location:update', { latitude, longitude });
  }

  /**
   * Trigger SOS alert
   */
  triggerSos(latitude, longitude) {
    this.emitToServer('sos:trigger', { latitude, longitude });
  }
}

export const socketService = new SocketService();
export default socketService;