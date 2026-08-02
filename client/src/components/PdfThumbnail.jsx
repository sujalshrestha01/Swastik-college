import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Configure the worker (standard setup for react-pdf)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PdfThumbnail({ url }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden bg-navy-50 dark:bg-navy-900 rounded-lg">
      <Document
        file={url}
        loading={<div className="text-xs text-navy-400">Loading preview…</div>}
        error={<div className="text-xs text-navy-400">No preview</div>}
        onLoadSuccess={() => setLoaded(true)}
      >
        <Page
          pageNumber={1}
          width={180} // Scaled down thumbnail size
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className={loaded ? "opacity-100 transition-opacity" : "opacity-0"}
        />
      </Document>
    </div>
  );
}
