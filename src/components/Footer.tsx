import React from 'react';
import { Link } from 'react-router-dom';

import { kofiLogo } from '../assets';

export const Footer: React.FC = () => {
  return (
    <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10 lg:px-[14rem]">
      <nav className="gap-y-4 flex flex-col">
        <p className="text-neutral-content/60">Made with ❤️ and hatred of lags in map apps</p>
        <a
          className="link link-hover flex items-center gap-2"
          href="https://ko-fi.com/rodo8888"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy me a matcha latte
          <img src={kofiLogo} alt="Kofi Logo" className="h-5 w-5" />
        </a>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <a className="link link-hover" href="https://rodonguyen.dev" target="_blank" rel="noopener noreferrer">
          About me
        </a>
      </nav>
      <nav className="text-neutral-content/40">
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
      </nav>
      <></>
    </footer>
  );
};

export default Footer;
