import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import quitter from "../../assets/quitter.svg";
import camera from "../../assets/camera.svg";
import galerie from "../../assets/galerie2.svg";

import PhotoOption from "../PhotoComposant/PhotoOption";
import Button from "../Button/Button";

const PopupPhoto = ({
  open = true,
  title = "Ajouter une photo",
  onClose,
  onImageSelected,
  onStartAddPhoto,
}) => {
  const [showWebcam, setShowWebcam] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  /* ================= CAMERA ================= */

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  /* ================= CLOSE ================= */

  const handleClose = () => {
    stopCamera();
    setShowWebcam(false);
    onClose?.();
  };

  /* ================= MOBILE CAMERA ================= */

  const handleCameraMobile = () => {
    cameraInputRef.current?.click();
  };

  /* ================= DESKTOP CAMERA ================= */

  const handleCameraDesktop = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      streamRef.current = stream;

      setShowWebcam(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (error) {
      console.error(error);
      alert("Camera access denied");
    }
  };

  /* ================= CAMERA ================= */

  const handleCamera = async () => {
    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      handleCameraMobile();
    } else {
      await handleCameraDesktop();
    }
  };

  /* ================= GALLERY ================= */

  const handleGallery = () => {
    galleryInputRef.current?.click();
  };

  /* ================= FILE CHANGE ================= */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    onImageSelected?.(file);
    onStartAddPhoto?.();

    handleClose();
  };

  /* ================= TAKE PHOTO ================= */

  const takePhoto = () => {
    if (!videoRef.current) {
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return;
        }

        const file = new File([blob], "photo.jpg", {
          type: "image/jpeg",
        });

        onImageSelected?.(file);
        onStartAddPhoto?.();

        handleClose();
      },
      "image/jpeg"
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/30
            flex
            items-end
            lg:items-center
            justify-center
            overflow-hidden
          "
        >
          <motion.div
            /* ================= MOBILE SLIDE ================= */
            initial={{
              opacity: 0,
              y: "100%",
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: "100%",
            }}
            transition={{
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
            }}
            onClick={(e) => e.stopPropagation()}
            className="
              w-full
              lg:w-[520px]
              bg-white
              rounded-t-[24px]
              lg:rounded-[18px]
              shadow-2xl
              max-h-[90vh]
              overflow-y-auto
            "
          >
            {/* ================= MOBILE HANDLE ================= */}

            <div className="lg:hidden flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* ================= HIDDEN INPUTS ================= */}

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

            {/* ================= HEADER ================= */}

            <div
              className="
                px-4
                lg:px-6
                pt-1
                lg:pt-6
                pb-3
                lg:pb-4
              "
            >
              {/* ================= DESKTOP CLOSE ================= */}

              <button
                onClick={handleClose}
                className="
                  hidden
                  lg:flex
                  items-center
                  gap-2
                  text-[18px]
                  font-medium
                "
              >
                <img
                  src={quitter}
                  alt="Fermer"
                  className="w-5 h-5"
                />

                Fermer
              </button>

              {/* ================= TITLE ================= */}

              <h2
                className="
                  text-left
                  lg:text-center
                  mt-1
                  lg:mt-5
                  text-[22px]
                  lg:text-[24px]
                  font-semibold
                  flex
                  justify-center
                "
              >
                {title}
              </h2>

              {/* ================= MOBILE DESCRIPTION ================= */}

              <p
                className="
                  mt-1
                  text-[13px]
                  leading-5
                  text-[#8B8B8B]
                  lg:hidden
                  flex
                  justify-center
                "
              >
                Choisissez une source pour votre photo de terrain
              </p>
            </div>

            {/* ================= CONTENT ================= */}

            <div
              className="
                px-7
                lg:px-6
                pb-4
                lg:pb-5
                space-y-3
                lg:space-y-5
              "
            >
              {!showWebcam ? (
                <>
                  {/* ================= CAMERA ================= */}

                  <PhotoOption
                    icon={camera}
                    title="Prendre une photo"
                    subtitle="Ouvrir l'appareil photo"
                    color="#A7DAD833"
                    border="#E5E7EB"
                    background="#F2FBF8"
                    onClick={handleCamera}
                  />

                  {/* ================= GALLERY ================= */}

                  <PhotoOption
                    icon={galerie}
                    title="Choisir depuis la galerie"
                    subtitle="Importer depuis le téléphone"
                    color="#BED5FC4D"
                    border="#E5E7EB"
                    background="#F2F6FF"
                    onClick={handleGallery}
                  />
                </>
              ) : (
                <div className="space-y-3 lg:space-y-4">
                  {/* ================= WEBCAM ================= */}

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="
                      w-full
                      aspect-video
                      rounded-xl
                      lg:rounded-2xl
                      bg-black
                    "
                  />

                  {/* ================= TAKE PHOTO ================= */}

                  <Button
                    title="Prendre la photo"
                    variant="primary"
                    onClick={takePhoto}
                  />
                </div>
              )}
            </div>

            {/* ================= MOBILE CANCEL ================= */}

            <div
              className="
                lg:hidden
                px-4
                pb-4
                pt-0
              "
            >
              <Button
                title="Annuler"
                variant="annuler"
                onClick={handleClose}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupPhoto;
