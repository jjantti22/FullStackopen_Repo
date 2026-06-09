import { useNotificationMessage, useNotificationType } from '../store'

const Notification = () => {
  const message = useNotificationMessage()
  const typeOfMessage = useNotificationType()

  if (message === null) {
    return null;
  }

  return <div className={typeOfMessage}>{message}</div>;
};

export default Notification;
