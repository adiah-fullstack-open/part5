const Notification = ({ message }) => {
  return (
    <div className={`message message-${message.type}`}>{message.text}</div>
  );
};
export default Notification;
