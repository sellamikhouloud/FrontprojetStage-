const BackendErrorMessage = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <div
      className={`
        rounded-[10px]
        border
        border-red-300
        bg-red-50
        px-4
        py-3
        text-sm
        text-red-600
        ${className}
      `}
    >
      {message}
    </div>
  );
};

export default BackendErrorMessage;