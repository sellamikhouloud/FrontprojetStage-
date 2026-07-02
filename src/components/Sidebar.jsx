import { useState } from "react";

import Logo from "../assets/Logo.svg";
import visite from "../assets/+visite.svg";
import distrib from "../assets/distrib.svg";
import Galerie from "../assets/Galerie.svg";
import Avatar from "../assets/Avatar.svg";
import home from "../assets/home.svg";
import familles from "../assets/people.svg";
import money_add from "../assets/money-add.svg";
import famille from "../assets/famille.svg";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const navigation = [
    { src: home, label: "Accueil" },
    { src: familles, label: "Familles" },
    { src: Galerie, label: "Galerie" },
  ];

  const actions = [
    { src: famille, label: "Ajouter une famille" },
    { src: visite, label: "Ajouter une visite" },
    { src: distrib, label: "Ajouter une distribution" },
    { src: money_add, label: "Ajouter une aide zakat" },
  ];

  const renderItem = (item, index) => (
    <button
      key={index}
      onMouseEnter={() => setExpanded(true)}
      className={`
        flex items-center
        transition-all duration-200
        hover:scale-105
        w-full

        ${expanded ? "gap-5 justify-start" : "justify-center"}
      `}
    >
      <img
        src={item.src}
        alt={item.label}
        className="w-8 h-8"
      />

      {expanded && (
        <span className="text-white text-sm font-medium whitespace-nowrap">
          {item.label}
        </span>
      )}
    </button>
  );

  return (
    <aside
      onMouseLeave={() => setExpanded(false)}
      className={`
        h-[944px]
        bg-[#4E9F8A]
        rounded-[42px]
        py-8
        transition-all
        duration-300
        overflow-hidden
        flex
        flex-col

        ${expanded ? "w-[295px] px-8" : "w-[86px] px-[18px]"}
      `}
    >
      {/* LOGO */}
      <div className="flex justify-center">
        <img
          src={Logo}
          alt="NutriGest Logo"
          className="w-[50px] h-auto"
        />
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 flex flex-col justify-center">
        {expanded && (
          <p className="text-white font-bold mb-8">
            Navigation
          </p>
        )}

        <nav
          className={`
            flex flex-col gap-9
            ${expanded ? "items-start" : "items-center"}
          `}
        >
          {navigation.map(renderItem)}

          {expanded && (
            <p className="text-white font-bold mt-5">
              Action rapide
            </p>
          )}

          {actions.map(renderItem)}
        </nav>
      </div>

      {/* AVATAR */}
      <div className="flex justify-center">
        <button>
          <img
            src={Avatar}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
        </button>
      </div>
    </aside>
  );
}