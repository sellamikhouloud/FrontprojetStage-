import Button from "../Button/Button";

const ImagePreview = ({
  image,
  onButtonClick,
  buttonTitle = "Changer",
  buttonIcon,
  buttonVariant = "changer",
}) => {
  return (
    <div
      className="
        relative
        w-full
        h-full
        overflow-hidden
        bg-[#F8F8F8]
      "
    >
      {/* Button */}
      <div className="absolute top-3 left-6 z-10">
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
        className="
          w-full
          h-full
          object-contain
        "
      />
    </div>
  );
};

export default ImagePreview;