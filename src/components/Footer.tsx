import React from 'react';

import { kofiLogo } from '../assets';

export const Footer: React.FC = () => {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>Made with ❤️ and hatred of lags in smart phone map apps</p>
        <div className="flex items-center justify-center gap-2">
          <a
            href="https://ko-fi.com/rodo8888"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover flex items-center gap-1"
          >
            <img src={kofiLogo} alt="Kofi Logo" className="h-5 w-5" />
            Buy me a matcha latte
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
