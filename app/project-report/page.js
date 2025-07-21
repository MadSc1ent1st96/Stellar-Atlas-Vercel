"use client";

import { useEffect, useState } from 'react';
import DataGridBackground from '../../components/DataGridBackground';
import siteConfig from '../../site.config';

export default function ProjectReport() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    setPdfUrl('/Assets/Stellar-Atlas-Final-Report.pdf');
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <DataGridBackground />
      <div className="relative z-10 text-white px-4 sm:px-8 md:px-16 lg:px-32 py-12">
        <h1 className="text-3xl font-bold mb-6 text-center">📘 Stellar Evolution Atlas Report</h1>

        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-300 mb-6">
            This document contains the complete write-up for the Stellar Evolution Atlas project by <strong>{siteConfig.author.name}</strong>, including background, methodology, results, and comparisons with Gaia DR3 data.
          </p>

          <a
            href={pdfUrl}
            download="Stellar-Atlas-Final-Report.pdf"
            className="inline-block bg-cyan-600 hover:bg-cyan-700 transition text-white font-semibold px-6 py-3 rounded mb-6"
          >
            📥 Download Report (PDF)
          </a>

          <div className="border-t border-gray-700 my-10" />

          {isLoading ? (
            <div className="w-full h-[80vh] rounded border border-gray-600 bg-gray-800 flex items-center justify-center">
              <div className="text-gray-400">Loading PDF viewer...</div>
            </div>
          ) : pdfError ? (
            <div className="w-full h-[80vh] rounded border border-gray-600 bg-gray-800 flex items-center justify-center">
              <div className="text-red-400">PDF not available or failed to load.</div>
            </div>
          ) : (
            <div className="aspect-w-16 aspect-h-9 mb-8">
              <iframe
                src={pdfUrl}
                className="w-full h-[80vh] rounded border border-gray-600"
                title="Stellar Evolution Atlas Report"
                allowFullScreen
                onError={() => setPdfError(true)}
              ></iframe>
            </div>
          )}

          <blockquote className="italic text-gray-400 border-l-4 border-cyan-400 pl-4">
            &quot;A journey through the lives of stars, visualized and decoded.&quot;
          </blockquote>
        </div>
      </div>
    </div>
  );
}