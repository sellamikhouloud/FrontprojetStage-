import home from "../assets/home.svg";
import familles from "../assets/people.svg";
import avatar from "../assets/Avatar.svg";
import logo from "../assets/Logo.svg";
import distrib from "../assets/distrib.svg";

// Coordinator
import galerie from "../assets/Galerie.svg";
import visite from "../assets/+visite.svg";
import moneyAdd from "../assets/money-add.svg";
import famille from "../assets/famille.svg";

// Admin
import galerieA from "../assets/GalerieA.svg";
import zakat from "../assets/money-add.svg";
import donateurs from "../assets/donateurs.svg";
import rapports from "../assets/rapports.svg";

export const sidebarConfig = {
  coordinator: {
    logo,
    avatar,

    navigation: [
      { icon: home, label: "Accueil" },
      { icon: familles, label: "Familles" },
      { icon: galerie, label: "Galerie" },
    ],

    actions: [
      { icon: famille, label: "Ajouter une famille" },
      { icon: visite, label: "Ajouter une visite" },
      { icon: distrib, label: "Ajouter une distribution" },
      { icon: moneyAdd, label: "Ajouter une aide zakat" },
    ],
  },

  admin: {
    logo,
    avatar,

    navigation: [
      { icon: home, label: "Accueil" },
      { icon: familles, label: "Familles" },
      { icon: galerie, label: "Galerie" },
      { icon: zakat, label: "Zakat" },
      { icon: distrib, label: "Distribution" },
      { icon: donateurs, label: "Donateurs" },
      { icon: rapports, label: "Rapports" },
    ],

    actions: [],
  },

};