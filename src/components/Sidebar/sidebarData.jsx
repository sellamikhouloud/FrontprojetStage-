import home from "../../assets/home.svg";
import homeWhite from "../../assets/home-white.svg";

import familles from "../../assets/people.svg";
import famillesWhite from "../../assets/people-white.svg";

import avatar from "../../assets/Avatar.svg";
import logo from "../../assets/Logo.svg";

import distrib from "../../assets/distrib.svg";
import distribWhite from "../../assets/distrib-white.svg";

// Coordinator
import galerie from "../../assets/Galerie.svg";
import galerieWhite from "../../assets/Galerie-white.svg";

import visite from "../../assets/+visite.svg";
import visiteWhite from "../../assets/+visite-white.svg";

import moneyAdd from "../../assets/money-add.svg";
import moneyAddWhite from "../../assets/money-add-white.svg";

import famille from "../../assets/famille.svg";
import familleWhite from "../../assets/famille-white.svg";

// Admin
import galerieA from "../../assets/GalerieA.svg";
import galerieAWhite from "../../assets/GalerieA-white.svg";

import zakat from "../../assets/money-add.svg";
import zakatWhite from "../../assets/money-add-white.svg";

import donateurs from "../../assets/donateurs.svg";
import donateursWhite from "../../assets/donateurs-white.svg";

import rapports from "../../assets/rapports.svg";
import rapportsWhite from "../../assets/rapports-white.svg";

export const sidebarConfig = {
  coordinator: {
    logo,
    avatar,

    navigation: [
      {
        icon: home,
        activeIcon: homeWhite,
        label: "Accueil",
        path: "/dashboard",
      },
      {
        icon: familles,
        activeIcon: famillesWhite,
        label: "Familles",
        path: "/liste-famille",
      },
      {
        icon: galerie,
        activeIcon: galerieWhite,
        label: "Galerie",
        path: "/galerie",
      },
    ],

    actions: [
      {
        icon: famille,
        activeIcon: familleWhite,
        label: "Ajouter une famille",
        path: "/information-mere",
      },
      {
        icon: visite,
        activeIcon: visiteWhite,
        label: "Ajouter une visite",
        path: "/ajout-visite",
      },
      {
        icon: distrib,
        activeIcon: distribWhite,
        label: "Ajouter une distribution",
        path: "/ajout-distribution",
      },
      {
        icon: moneyAdd,
        activeIcon: moneyAddWhite,
        label: "Ajouter une aide zakat",
        path: "/ajout-zakat",
      },
    ],
  },

  admin: {
    logo,
    avatar,

    navigation: [
      {
        icon: home,
        activeIcon: homeWhite,
        label: "Accueil",
        path: "/dashboard",
      },
      {
        icon: familles,
        activeIcon: famillesWhite,
        label: "Familles",
        path: "/liste-famille",
      },
      {
        icon: galerieA,
        activeIcon: galerieAWhite,
        label: "Galerie",
        path: "/galerie",
      },
      {
        icon: zakat,
        activeIcon: zakatWhite,
        label: "Zakat",
        path: "/zakat",
      },
      {
        icon: distrib,
        activeIcon: distribWhite,
        label: "Distribution",
        path: "/distribution",
      },
      {
        icon: donateurs,
        activeIcon: donateursWhite,
        label: "Donateurs",
        path: "/liste-Donateurs",
      },
      {
        icon: rapports,
        activeIcon: rapportsWhite,
        label: "Rapports",
        path: "/rapports",
      },
    ],

    actions: [],
  },
};