import feature1 from "@/public/feature1.jpg";
import feature2 from "@/public/feature2.jpg";
import feature3 from "@/public/feature3.jpg";
import youtube from "@/public/youtube_logo.svg";
import slack from "@/public/slack_logo.svg";
import instagram from "@/public/instagram_logo.svg";
import x from "@/public/x_logo.svg";
import person1 from '@/public/person1.jpg';
import person2 from '@/public/person2.jpg';
import person3 from '@/public/person3.jpg';
import person4 from '@/public/person4.jpg';
import person5 from '@/public/person5.jpg';

export const featureItems = [
  {
    imgUrl: feature1,
    title: "We bring you Recipies from all around the globe.",
    desc: "We put all of our heart and soul into bringing you the best spicy meals this world has to offer to satisfy you chilly loving tastebuds through unique menus every week so that you'll never run out of options.",
  },
  {
    imgUrl: feature2,
    title: "Only the spiciest delicacies to lit you tastebuds on FIRE.",
    desc: "Every meal you recieve is handpicked from different parts of the world and is checked by our experts to ensure the every bite packs a fiery punch of flavours in you mouth.",
  },
  {
    imgUrl: feature3,
    title: "Fresh & Quality checked raw materials only.",
    desc: "A good meal always starts with fresh and quality raw materials. We provide you with healthy and quality checked raw materials to make sure you're getting the best out of every meal.",
  },
];

export const footerLinks = [
  {
    title: "Navigation",
    links: [
      { name: "Home", url: "/" },
      { name: "On The Menu", url: "/on-the-menu" },
    ],
  },
  {
    title: "Other Links",
    links: [
      { name: "FAQs", url: "/faqs" },
      { name: "Our Ingredients", url: "/ingredients-lists" },
      { name: "Gift Cards", url: "/gift-cards" },
    ],
  },
  {
    title: "Term & Conditions",
    links: [
      { name: "Press", url: "/press" },
      { name: "Terms of Use", url: "/terms-of-use" },
      { name: "Purchase Terms & Conditions", url: "/purchase-terms" },
    ],
  },
];

export const socialMedia = [
  { name: "YouTube", icon: youtube },
  { name: "Slack", icon: slack },
  { name: "Instagram", icon: instagram },
  { name: "X", icon: x },
];


export const dummyReviews = [
  {
    userName: "User 1",
    reviewTitle: "Great Experience",
    rating: 5,
    imgUrl: person1,
    reviewDescription: "Had a wonderful experience at this place. Highly recommended.",
  },
  {
    userName: "User 2",
    reviewTitle: "Good Service",
    rating: 4,
    imgUrl: person2,
    reviewDescription: "The service was excellent, and the staff was very friendly.",
  },
  {
    userName: "User 3",
    reviewTitle: "Average",
    rating: 3,
    imgUrl: person3,
    reviewDescription: "The experience was just okay. It could be better.",
  },
  {
    userName: "User 4",
    reviewTitle: "Not Recommended",
    rating: 1,
    imgUrl: person4,
    reviewDescription: "I would not recommend this place. Bad experience.",
  },
  {
    userName: "User 5",
    reviewTitle: "Excellent Food",
    rating: 5,
    imgUrl: person5,
    reviewDescription: "The food here is amazing. Will definitely come back.",
  },
];

