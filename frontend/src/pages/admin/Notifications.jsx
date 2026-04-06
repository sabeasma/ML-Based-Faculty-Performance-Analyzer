import RolePageTemplate from '../../components/common/RolePageTemplate';
import NotificationsPanel from '../../components/common/NotificationsPanel';
import useNotifications from '../../hooks/useNotifications';

export default function Notifications() {
  const { items, loading, markAllRead } = useNotifications();

  return (
    <RolePageTemplate title="Notifications" description="System-level alerts, model updates, and operational events.">
      <NotificationsPanel items={items} loading={loading} onMarkAllRead={markAllRead} />
    </RolePageTemplate>
  );
}
