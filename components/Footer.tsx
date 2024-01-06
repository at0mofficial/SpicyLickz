import { footerLinks, socialMedia } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex flex-col bg-[whitesmoke] max-xs:px-5 px-10 justify-between gap-[50px]">
      <div className="flex items-baseline whitespace-nowrap">
        <h2 className="text-[50px] mt-10 max-md:text-[30px] font-extrabold text-dark uppercase">
          Spicy Lickz
          <span className="text-primary aspect-square text-2xl">■</span>
        </h2>
      </div>
      <div className="flex justify-between lg:gap-10 gap-20 flex-wrap">
        {footerLinks.map((footerLink) => (
          <div key={footerLink.title}>
            <h3 className="text-2xl font-semibold text-dark">
              {footerLink.title}
            </h3>
            <ul>
              {footerLink.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.url}
                    className="text-base font-medium text-dark"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2">
        {socialMedia.map((item) => (
          <Image
            key={item.name}
            src={item.icon}
            alt={item.name}
            width={30}
            height={30}
          />
        ))}
      </div>
      <p className="text-base font-semibold text-secondary text-center pb-5">
        Copyright © Fall 2022, Shivam Sangwan, WEB322 NEE
      </p>
    </footer>
  );
};

export default Footer;
