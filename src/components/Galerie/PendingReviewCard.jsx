// import { useState } from "react";

// import Button from "../Button/Button";

// import localisation from "../../assets/Blacklocation.svg";
// import calendrier from "../../assets/BlackCalendar.svg";
// import Coordinator from "../../assets/Coordinatoor.svg";
// import Confirmer from "../../assets/Confirmer.svg";
// import Refuser from "../../assets/Refuser.svg";
// import Warning from "../../assets/Warning.svg";

// const PendingReviewCard = ({
//   photo,
//   onApprove = () => {},
//   onRefuse = () => {},
// }) => {
//   const [showRefusal, setShowRefusal] = useState(false);
//   const [reason, setReason] = useState("");

//   const handleConfirm = () => {
//     if (!reason.trim()) return;

//     onRefuse(reason);

//     setReason("");
//     setShowRefusal(false);
//   };

//   return (
//     <div
//       className="
//         w-full
//         rounded-[15px]
//         bg-[#FACF854D]
//         px-6
//         py-5
//         flex
//         items-start
//         gap-6
//       "
//     >
//         {/* ================= LEFT SIDE ================= */}

//         <div className="flex-1 flex flex-col">

//         {/* Top row */}

//         <div className="flex items-start gap-6">

//             {/* IMAGE */}

//             <img
//             src={photo.image}
//             alt={photo.title}
//             className="
//                 w-[192px]
//                 h-[171px]
//                 rounded-[18px]
//                 object-cover
//                 flex-shrink-0
//             "
//             />

//             {/* TEXT */}

//             <div className="flex-1 min-w-0">

//             <h2
//                 className="
//                 text-[18px]
//                 font-bold
//                 text-[#202124]
//                 leading-[28px]
//                 "
//             >
//                 {photo.title}
//             </h2>

//             <div className="flex items-center gap-8 mt-3">

//                 <div className="flex items-center gap-2">
//                 <img
//                     src={localisation}
//                     alt=""
//                     className="w-4 h-4"
//                 />

//                 <span className="text-[14px] font-semibold">
//                     {photo.village}
//                 </span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                 <img
//                     src={calendrier}
//                     alt=""
//                     className="w-4 h-4"
//                 />

//                 <span className="text-[14px] font-semibold">
//                     {photo.date}
//                 </span>
//                 </div>

//             </div>

//             <p
//                 className="
//                 mt-4
//                 text-[16px]
//                 leading-[24px]
//                 text-[#6F7975]
//                 "
//             >
//                 {photo.description}
//             </p>

//             </div>
        
        // {showRefusal && (
        // <div className="flex items-center self-center gap-1">
        //   <img
        //     src={Coordinator}
        //     alt=""
        //     className="w-[13px] h-[13px]"
        //   />

        //   <p
        //     className="
        //       text-[15px]
        //       font-bold
        //       text-[#202124]
        //     "
        //   >
        //     Coordinateur :
        //   </p>

        //   <p
        //     className="
        //       text-[15px]
        //       text-[#202124]
        //     "
        //   >
        //     {photo?.coordinator || "nom id"}
        //   </p>
        // </div>
        // )}

//         </div>

//         {/* Refusal section */}

//         {showRefusal && (
//             <div className="mt-6">

//             <div className="flex items-center gap-2">
//                 <img
//                 src={Warning}
//                 alt=""
//                 className="w-4 h-4"
//                 />

//                 <p
//                 className="
//                     text-[18px]
//                     font-semibold
//                     text-[#8A4D00]
//                 "
//                 >
//                 Motif de refus
//                 </p>
//             </div>

//             <textarea
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 placeholder="Tapez le motif ici..."
//                 className="
//                 mt-3
//                 w-full
//                 h-[82px]
//                 rounded-[14px]
//                 border
//                 border-[#D9D9D9]
//                 px-4
//                 py-3
//                 resize-none
//                 outline-none
//                 text-[14px]
//                 "
//             />

//             <div className="mt-4 flex flex-col gap-3">

//                 <Button
//                 noPadding
//                 icon={Refuser}
//                 title="Confirmer le refus"
//                 variant="refus"
//                 disabled={!reason.trim()}
//                 onClick={handleConfirm}
//                 />

//                 <Button
//                 noPadding
//                 title="Annuler"
//                 variant="Annuler"
//                 onClick={() => {
//                     setReason("");
//                     setShowRefusal(false);
//                 }}
//                 />

//             </div>

//             </div>
//         )}

//         </div>
//         {/* ================= RIGHT ================= */}

//       <div
//         className="
//           flex
//           justify-between
//           self-stretch
//           flex-shrink-0
//         "
//       >

//         {/* Buttons */}

        // {!showRefusal && (
        // <div className="flex">
        // {/* Coordinator */}

        // <div className="flex items-center gap-1 pr-15">
        //   <img
        //     src={Coordinator}
        //     alt=""
        //     className="w-[13px] h-[13px]"
        //   />

        //   <p
        //     className="
        //       text-[15px]
        //       font-semibold
        //       text-[#202124]
        //     "
        //   >
        //     Coordinateur :
        //   </p>

        //   <p
        //     className="
        //       text-[15px]
        //       text-[#202124]
        //     "
        //   >
        //     {photo?.coordinator || "nom id"}
        //   </p>
        // </div>
        //   <div className="flex flex-col justify-center">

        //     <Button
        //       noPadding
        //       icon={Confirmer}
        //       title="Approuver"
        //       variant="success"
        //       onClick={onApprove}
        //     />

        //     <Button
        //       noPadding
        //       icon={Refuser}
        //       title="Refuser"
        //       variant="refus"
        //       onClick={() => setShowRefusal(true)}
        //     />

        //   </div>
        // </div>
        // ) }

//       </div>
//     </div>
//   );
// };

// export default PendingReviewCard;

import { useState } from "react";

import Button from "../Button/Button";

import localisation from "../../assets/Blacklocation.svg";
import calendrier from "../../assets/BlackCalendar.svg";
import Coordinator from "../../assets/Coordinatoor.svg";
import Confirmer from "../../assets/Confirmer.svg";
import Refuser from "../../assets/Refuser.svg";
import Warning from "../../assets/Warning.svg";

const PendingReviewCard = ({
  photo,
  onApprove = () => {},
  onRefuse = () => {},
}) => {
  const [showRefusal, setShowRefusal] = useState(false);
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) return;

    onRefuse(reason);

    setReason("");
    setShowRefusal(false);
  };

  return (
    <div
      className="
        w-full
        rounded-[15px]
        bg-[#FACF854D]
        p-4
        lg:px-6
        lg:py-5
        flex
        flex-col
        lg:flex-row
        gap-5
      "
    >
      {/* ================= LEFT SIDE ================= */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Row */}

        <div
          className="
            flex
            items-start
            gap-4
            lg:gap-6
          "
        >

          {/* Image */}

          <img
            src={photo.image}
            alt={photo.title}
            className="
              w-[105px]
              h-[105px]
              lg:w-[192px]
              lg:h-[171px]
              rounded-[14px]
              lg:rounded-[18px]
              object-cover
              flex-shrink-0
            "
          />

          {/* Text */}

          <div className="flex-1 min-w-0">

            <h2
              className="
                text-[16px]
                lg:text-[18px]
                font-bold
                leading-[22px]
                lg:leading-[28px]
                text-[#202124]
              "
            >
              {photo.title}
            </h2>

            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-5
                gap-y-2
                mt-2
                lg:mt-3
              "
            >

              <div className="flex items-center gap-2">
                <img
                  src={localisation}
                  alt=""
                  className="w-4 h-4"
                />

                <span
                  className="
                    text-[12px]
                    lg:text-[14px]
                    font-semibold
                  "
                >
                  {photo.village}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={calendrier}
                  alt=""
                  className="w-4 h-4"
                />

                <span
                  className="
                    text-[12px]
                    lg:text-[14px]
                    font-semibold
                  "
                >
                  {photo.date}
                </span>
              </div>

            </div>

            <p
              className="
                mt-3
                lg:mt-4
                text-[13px]
                lg:text-[16px]
                leading-[20px]
                lg:leading-[24px]
                text-[#6F7975]
                line-clamp-2
                lg:line-clamp-none
              "
            >
              {photo.description}
            </p>

            {/* Mobile coordinator */}

            {!showRefusal && (
              <div
                className="
                  flex
                  lg:hidden
                  items-center
                  gap-1
                  mt-3
                "
              >
                <img
                  src={Coordinator}
                  alt=""
                  className="w-3 h-3"
                />

                <p className="text-[12px] font-semibold">
                  Coordinateur :
                </p>

                <p className="text-[12px]">
                  {photo?.coordinator || "nom id"}
                </p>
              </div>
            )}
            </div>

          {/* Desktop coordinator */}

          {showRefusal && (
            <div
              className="
                hidden
                lg:flex
                items-center
                gap-1
                self-center
                pl-4
              "
            >
              <img
                src={Coordinator}
                alt=""
                className="w-[13px] h-[13px]"
              />

              <p
                className="
                  text-[15px]
                  font-semibold
                  text-[#202124]
                  whitespace-nowrap
                "
              >
                Coordinateur :
              </p>

              <p
                className="
                  text-[15px]
                  text-[#202124]
                  whitespace-nowrap
                "
              >
                {photo?.coordinator || "nom id"}
              </p>
            </div>
          )}

        </div>

        {/* ================= REFUSAL ================= */}

        {showRefusal && (
          <div className="mt-5">

            <div className="flex items-center gap-2">
              <img
                src={Warning}
                alt=""
                className="w-4 h-4"
              />

              <p
                className="
                  text-[16px]
                  lg:text-[18px]
                  font-semibold
                  text-[#8A4D00]
                "
              >
                Motif de refus
              </p>
            </div>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tapez le motif ici..."
              className="
                mt-3
                w-full
                h-[72px]
                lg:h-[82px]
                rounded-[14px]
                border
                border-[#D9D9D9]
                px-4
                py-3
                resize-none
                outline-none
                text-[13px]
                lg:text-[14px]
              "
            />

            <div className="mt-4 flex flex-col gap-3">

              <Button
                noPadding
                icon={Refuser}
                title="Confirmer le refus"
                variant="refus"
                disabled={!reason.trim()}
                onClick={handleConfirm}
              />

              <Button
                noPadding
                title="Annuler"
                variant="Annuler"
                onClick={() => {
                  setReason("");
                  setShowRefusal(false);
                }}
              />

            </div>

          </div>
        )}

      </div>

      {/* ================= RIGHT SIDE ================= */}

      {!showRefusal && (
        <div
            className="
            flex
            flex-col
            lg:flex-row

            lg:items-center

            w-full
            lg:w-auto
            "
        >
            {/* Desktop coordinator */}

            <div
            className="
                hidden
                lg:flex
                items-center
                gap-1
                pr-8
                whitespace-nowrap
            "
            >
            <img
                src={Coordinator}
                alt=""
                className="w-[13px] h-[13px]"
            />

            <p className="text-[15px] font-semibold text-[#202124]">
                Coordinateur :
            </p>

            <p className="text-[15px] text-[#202124]">
                {photo?.coordinator || "nom id"}
            </p>
            </div>

            {/* Buttons */}

            <div
            className="
                w-full
                lg:w-[190px]

                flex
                flex-col
            "
            >
            <Button
                noPadding
                icon={Confirmer}
                title="Approuver"
                variant="success"
                onClick={onApprove}
            />

            <Button
                noPadding
                icon={Refuser}
                title="Refuser"
                variant="refus"
                onClick={() => setShowRefusal(true)}
            />
            </div>
        </div>
        )}
    </div>
  );
};

export default PendingReviewCard;