import Button from "../Button/Button";

const ImagePreview = ({
  image,
  onButtonClick,
  buttonTitle = "Changer",
  buttonIcon,
  buttonVariant = "changer",
}) => {
  return (
    <div className="relative w-[480px] h-[580px] overflow-hidden">
      {/* Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          title={buttonTitle}
          icon={buttonIcon}
          variant={buttonVariant}
          fullWidth={false}
          onClick={onButtonClick}
        />
      </div>

      {/* Image */}
      <img
        src={image}
        alt="Preview"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImagePreview;