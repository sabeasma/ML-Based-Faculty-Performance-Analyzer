const db = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [rows] = await db.query(
      `
      SELECT
        notification_id,
        title,
        message,
        category,
        is_read,
        created_at,
        read_at
      FROM Notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 200
      `,
      [req.user.userId]
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const ids = Array.isArray(req.body.notificationIds) ? req.body.notificationIds.map(Number).filter(Boolean) : [];

    if (ids.length > 0) {
      const placeholders = ids.map(() => '?').join(',');
      await db.query(
        `
        UPDATE Notifications
        SET is_read = 1,
            read_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
          AND notification_id IN (${placeholders})
        `,
        [req.user.userId, ...ids]
      );

      return res.json({ message: 'Selected notifications marked as read', updated: ids.length });
    }

    const [result] = await db.query(
      `
      UPDATE Notifications
      SET is_read = 1,
          read_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
        AND is_read = 0
      `,
      [req.user.userId]
    );

    return res.json({ message: 'All notifications marked as read', updated: result.affectedRows });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update notifications', error: error.message });
  }
};
