import React from "react";
import { Link } from "react-router-dom";

const THIS_YEAR = new Date().getFullYear();

const LINKS = [
  {
    title: "当サイトについて",
    url: "/about",
  },
  {
    title: "お問い合わせ",
    url: "/contact",
  },
  {
    title: "プライバシーポリシー",
    url: "/privacy-policy",
  },
];

const Footer = () => {
  return (
    <footer className="mt-auto pt-12 pb-6 border-t border-notion-border flex flex-col items-center gap-3 text-xs text-notion-textLight font-sans select-none">
      <div className="flex flex-wrap justify-center gap-6">
        {LINKS.map((link) => (
          <Link
            key={link.title}
            to={link.url}
            className="hover:underline hover:text-notion-text transition-colors font-medium"
          >
            {link.title}
          </Link>
        ))}
      </div>
      <div className="text-center">
        <span>&copy; 2023-{THIS_YEAR} EC Tool Crate. All Rights Reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
