import { useCallback, useEffect, useState } from 'react';
import { getNotifications, markNotificationsRead } from '../services/api';

export default function useNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    await markNotificationsRead();
    await refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, loading, refresh, markAllRead };
}
