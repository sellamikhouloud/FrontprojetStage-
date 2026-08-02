import StatusBadge from "./StatusBadge";

const GalleryCard = ({
  image,
  title,
  status,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
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
        className="
          absolute
          bottom-2
          left-2
          right-2
          lg:bottom-5
          lg:left-5
          lg:right-5
          text-white
          text-[14px]
          lg:text-[18px]
          font-medium
          lg:font-semibold
          leading-[18px]
          lg:leading-[20px]
        "
      >
        {title}
      </p>
    </div>
  );
};

export default GalleryCard;