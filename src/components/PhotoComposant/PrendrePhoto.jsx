import { useRef, useState } from "react";
import { Camera, AlertTriangle } from "lucide-react";
import Photo from "../assets/Galerie.svg";

export default function PrendrePhoto() {
    const inputRef = useRef(null);
    const [image, setImage] = useState(null);
    const handleClick = () => {
        inputRef.current.click();
    };
    const handleChange = (e) => {
    const file = e.target.files[0];
    if(file) {
        setImage(URL.createObjectURL(file));
    }
    };
return(
    <div className="w-full">
    {/* Upload area */}
       <div
       onClick={handleClick}
       className="
       h-[191px]
       w-full
       border
       border-dashed
       border-[#4E9F8A]
       rounded-xl
       cursor-pointer
       flex
       justify-center
       items-center
       overflow-hidden
       transition
       hover:bg-[#4E9F8A]/5
       "
       >
        {image ? (
          <img
            src={Photo}
            alt="Preview"
            className="w-full h-full object-cover "
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Camera size={32} />

            <p className="text-lg font-medium">
              Tapez pour prendre une photo
            </p>
          </div>
        )}
       </div>
            
             {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      {/* Warning */}
      <div className="mt-3 flex items-center justify-center gap-2 text-[#E99A2F]">
        <AlertTriangle size={18} />

        <p className="text-sm">
          Aucune photo du nourrisson ne doit être prise ou stockée.
        </p>
      </div>
            
    </div>
)}
