import GalleryCard from "./GalleryCard";

const GalleryGrid = ({
  photos,
  selectedFilter,
  onPhotoClick,
}) => {
  const filteredPhotos =
    selectedFilter === "all"
      ? photos
      : photos.filter(
          (photo) => photo.status === selectedFilter
        );

  return (
    <div className="w-full px-8 pb-6 lg:px-8">
      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-3
          xl:grid-cols-5
          gap-3
          lg:gap-6
          w-full
        "
      >
        {filteredPhotos.map((photo) => (
          <GalleryCard
            key={photo.id}
            image={photo.image}
            title={photo.title}
            status={photo.status}
            onClick={() => onPhotoClick(photo)}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryGrid;