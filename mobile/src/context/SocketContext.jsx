import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { socketService } from '../services/socketService';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [newReportHandlers, setNewReportHandlers] = useState([]);

  /**
   * Connect when authenticated
   */
  useEffect(() => {
    if (!user || !token) {
      socketService.disconnect();
      setIsConnected(false);
      return;
    }

    let mounted = true;

    const init = async () => {
      const socket = await socketService.connect();

      if (socket && mounted) {
        socketService.subscribeToReports();

        socketService.subscribe('connection:status', (data) => {
          setIsConnected(data.connected);
        });

        socketService.subscribe('users:online', (data) => {
          setOnlineCount(data.count);
        });
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [user, token]);

  /**
   * Register handler for new reports
   * Returns cleanup function
   */
  const onNewReport = useCallback((handler) => {
    socketService.subscribe('report:new', handler);
    return () => {
      socketService.unsubscribe('report:new', handler);
    };
  }, []);

  /**
   * Register handler for report updates
   */
  const onReportUpdate = useCallback((handler) => {
    socketService.subscribe('report:update', handler);
    return () => {
      socketService.unsubscribe('report:update', handler);
    };
  }, []);

  /**
   * Register handler for SOS alerts
   */
  const onSosAlert = useCallback((handler) => {
    socketService.subscribe('sos:alert', handler);
    return () => {
      socketService.unsubscribe('sos:alert', handler);
    };
  }, []);

  /**
   * Send location update
   */
  const updateLocation = useCallback((latitude, longitude) => {
    socketService.updateLocation(latitude, longitude);
  }, []);

  /**
   * Trigger SOS
   */
  const triggerSos = useCallback((latitude, longitude) => {
    socketService.triggerSos(latitude, longitude);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        onlineCount,
        onNewReport,
        onReportUpdate,
        onSosAlert,
        updateLocation,
        triggerSos,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};