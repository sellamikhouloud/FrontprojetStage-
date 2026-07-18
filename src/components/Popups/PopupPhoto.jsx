import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import quitter from "../assets/quitter.svg";
import camera from "../assets/camera.svg";
import galerie from "../assets/galerie2.svg";

import PhotoOption from "./PhotoOption";

const PopupPhoto = ({
  title = "Ajouter une photo",
  onClose,
  onImageSelected,
}) => {
  const [open, setOpen] = useState(true);
  const [showWebcam, setShowWebcam] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleClose = () => {
    stopCamera();
    setOpen(false);
    onClose?.();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  // MOBILE + fallback desktop file camera
  const handleCameraMobile = () => {
    cameraInputRef.current?.click();
  };

  // DESKTOP webcam
  const handleCameraDesktop = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;
      setShowWebcam(true);

      // attach stream safely
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (err) {
      console.error(err);
      alert("Camera access denied");
    }
  };

  const handleCamera = async () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      handleCameraMobile();
    } else {
      await handleCameraDesktop();
    }
  };

  const handleGallery = () => {
    galleryInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onImageSelected?.(file);
    handleClose();
  };

  // taking a picture from webcam
  const takePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "photo.jpg", {
        type: "image/jpeg",
      });

      onImageSelected?.(file);
      handleClose();
    }, "image/jpeg");
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="
              w-full max-w-[520px]
              bg-white
              rounded-[15px]
              border border-[#4E9F8A]
              shadow-xl
              px-5 py-6
            "
          >
            {/* hidden inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* close */}
            <button
              onClick={handleClose}
              className="flex items-center gap-2 text-[18px]"
            >
              <img src={quitter} className="w-5 h-5" />
              Fermer
            </button>

            <h2 className="text-center text-[24px] font-semibold mt-6 mb-8">
              {title}
            </h2>

            {/* CAMERA MODE */}
            {!showWebcam ? (
              <div className="space-y-8">
                <PhotoOption
                  icon={camera}
                  title="Prendre une photo"
                  subtitle="Ouvrir l'appareil photo"
                  color="#A7DAD833"
                  border="#E5E7EB"
                  background="#F2FBF8"
                  onClick={handleCamera}
                />

                <PhotoOption
                  icon={galerie}
                  title="Choisir depuis la galerie"
                  subtitle="Importer depuis le téléphone"
                  color="#BED5FC4D"
                  border="#E5E7EB"
                  background="#F2F6FF"
                  onClick={handleGallery}
                />
              </div>
            ) : (
              // WEBCAM VIEW (desktop)
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-2xl bg-black"
                />

                <button
                  onClick={takePhoto}
                  className="
                    w-full h-12
                    bg-[#4E9F8A]
                    text-white
                    rounded-xl
                    font-medium
                  "
                >
                  Prendre la photo
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupPhoto;