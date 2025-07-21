// components/Footer.tsx
import React from 'react';
import siteConfig from '../site.config';

export default function Footer() {
  return (
    <footer className="w-full py-4 text-center text-xs text-gray-400 bg-[#0b0f1a]/90 backdrop-blur-md border-t border-gray-700 mt-10 z-50 relative">
      <div>
        {siteConfig.footer?.copyright} {siteConfig.footer?.poweredBy}
        <span className="ml-2">Last updated: {siteConfig.footer?.lastUpdated}.</span>
      </div>
      <div className="mt-1">
        Template:&nbsp;
        <a href={siteConfig.footer?.githubRepo} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
          Stellar Atlas Template by Aniket S. Mishra (view on GitHub)
        </a>
      </div>
    </footer>
  );
}
