import RolePageTemplate from '../../components/common/RolePageTemplate';
import NotificationsPanel from '../../components/common/NotificationsPanel';
import useNotifications from '../../hooks/useNotifications';

export default function Notifications() {
  const { items, loading, markAllRead } = useNotifications();

  return (
    <RolePageTemplate title="Notifications" description="Feedback reminders, deadlines, and academic updates.">
      <NotificationsPanel items={items} loading={loading} onMarkAllRead={markAllRead} />
    </RolePageTemplate>
  );
}
