import { useRef } from "react";
import PhotoOption from "./PhotoOption";
import CameraIcon from "../assets/camera.svg";

function PhotoSelector() {
  const cameraInputRef = useRef(null);

  const handleTakePhoto = () => {
    cameraInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    console.log(file);
  };

  return (
    <>
      <PhotoOption
        icon={CameraIcon}
        title="Prendre une photo"
        subtitle="Utiliser votre caméra"
        color="#4CAF50"
        background="#F5FFF6"
        border="#D8F0DA"
        onClick={handleTakePhoto}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageChange}
        className="hidden"
      />
    </>
  );
}

export default PhotoSelector;