import StatusBadge from "./StatusBadge";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const GalleryCard = ({
  image,
  title,
  status,
  onClick,
  photoId,
  selectionMode = false,
  selectedPhotos = [],
  setSelectedPhotos,
}) => {
  const isSelected = selectedPhotos.includes(photoId);
  const [isDarkImage, setIsDarkImage] = useState(true);

useEffect(() => {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = image;

  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

canvas.width = 100;
canvas.height = 100;

ctx.drawImage(img, 0, 0, 100, 100);

// Only analyze the bottom 40% of the image
const data = ctx.getImageData(0, 60, 100, 40).data;

let brightness = 0;

for (let i = 0; i < data.length; i += 4) {
  brightness +=
    0.299 * data[i] +
    0.587 * data[i + 1] +
    0.114 * data[i + 2];
}

const averageBrightness = brightness / (data.length / 4);

setIsDarkImage(averageBrightness < 128);
  };
}, [image]);
  const handleClick = () => {
    if (selectionMode){
      // Only validated photos can be selected
      if (status !== "validated") return;
      if(isSelected){
        setSelectedPhotos((prev) => 
         prev.filter((id) => id != photoId)
        );
      }else{
        setSelectedPhotos((prev) => [...prev,photoId])
      }
      return;
    }
    onClick?.()
  }
  return (
    <div
      onClick={handleClick}
      className="
        relative
        overflow-hidden
        rounded-[16px]
        lg:rounded-[18px]
        cursor-pointer
        group
        aspect-[0.8]
        lg:aspect-[3/4]
        shadow-md
      "
    >
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="
          w-full
          h-full
          object-cover
          transition-transform
          duration-300
          group-hover:scale-105
        "
      />

      {selectionMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}          
          className={`
            absolute
            top-3
            right-3
            w-8
            h-8
            rounded-full
            flex
            items-center
            justify-center
            z-20
            border
            ${
              isSelected
                ? "bg-[#4E9F8A] border-[#FFFFFF4D]"
                : "bg-[#FFFFFF4D] border-[#FFFFFF33]"
            }
          `}
        >
          {isSelected && (
            <Check size={17} color="white"/>
          )}
        </button>
      )}

      {/* Status */}
      <div
        className="
          absolute
          top-2
          left-2
          lg:top-4
          lg:left-4
          z-10
        "
      >
        <StatusBadge status={status} />
      </div>

      {/* Gradient */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-20
          lg:h-28
          bg-gradient-to-t
          to-transparent
        "
      />

      {/* Title */}
      <p
        className={`
          absolute
          bottom-2
          left-2
          right-2
          lg:bottom-5
          lg:left-5
          lg:right-5
          ${isDarkImage ? "text-white" : "text-black"}
          text-[14px]
          lg:text-[18px]
          font-medium
          lg:font-semibold
          leading-[18px]
          lg:leading-[20px]
        `}
      >
        {title}
      </p>
    </div>
  );
};

export default GalleryCard;