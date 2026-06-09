const Notification = ({ message, typeOfMessage }) => {
  if (message === null) {
    return null;
  }

  return <div className={typeOfMessage}>{message}</div>;
};

export default Notification;
