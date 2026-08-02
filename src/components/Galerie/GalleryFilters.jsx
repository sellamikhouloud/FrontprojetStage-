import Button from "../Button/Button";

import allIcon from "../../assets/Toutes.svg";
import validatedIcon from "../../assets/valide.svg";
import pendingIcon from "../../assets/EnAttente.svg";
import refusedIcon from "../../assets/refuse.svg";

const GalleryFilters = ({
  selectedFilter,
  setSelectedFilter,
}) => {
  const filters = [
    {
      title: "Toutes",
      value: "all",
      variant: "all",
      icon: allIcon,
    },
    {
      title: "Validées",
      value: "validated",
      variant: "validated",
      icon: validatedIcon,
    },
    {
      title: "En attente",
      value: "pending",
      variant: "EnAttente",
      icon: pendingIcon,
    },
    {
      title: "Refusées",
      value: "refused",
      variant: "refused",
      icon: refusedIcon,
    },
  ];

  return (
    <div
      className="
        lg:px-4
        mb-6
        lg:mb-8
      "
    >
    <div
      className="
        flex
        overflow-x-auto
        lg:flex-wrap
        lg:overflow-visible
        scrollbar-hide
        pb-2
      "
    >
        {filters.map((filter) => (
          <div key={filter.value} className="flex-shrink-0">
            <Button
              title={filter.title}
              icon={filter.icon}
              variant={filter.variant}
              fullWidth={false}
              onClick={() =>
                setSelectedFilter(filter.value)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryFilters;