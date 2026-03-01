const MyButton = ({ buttonText, buttonType, tailwindClass, onClick }) => {
  return (
    <button
      type={buttonType}
      className={`rounded-md text-sm ${tailwindClass}`}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
};

export default MyButton;
