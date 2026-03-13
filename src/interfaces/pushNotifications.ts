export interface IPushNotification {
  _id: string;
  title: string;
  body: string;
  target: string;
  scheduledAt: Date;
  createdAt: Date;
  status: string;
}

export type IPushNotifications = IPushNotification[];