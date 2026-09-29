import { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const hasPermission = await notificationService.setup();
      if (hasPermission) {
        setIsReady(true);
        // Optional: schedule daily reminder on init
        // notificationService.scheduleReminder();
      }
    };
    init();
  }, []);

  const triggerBudgetAlert = async (category: string, spent: number, limit: number) => {
    if (isReady) {
      await notificationService.scheduleBudgetAlert(category, spent, limit);
    }
  };

  return {
    isReady,
    triggerBudgetAlert
  };
};
