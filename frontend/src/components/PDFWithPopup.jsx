import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Menu, Minus, Plus, RotateCcw, Undo2, Redo2, Download, Printer, PenLine, Image } from "lucide-react";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFWithPopup = ({ file }) => {
  const containerRef = useRef(null);
  const [popup, setPopup] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const fitPage = () => setScale(1.2);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDoubleClick = (pageNumber) => (e) => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const x = e.clientX - containerRect.left + container.scrollLeft;
    const y = e.clientY - containerRect.top + container.scrollTop;

    setPopup({ x, y, pageNumber });
  };

  return (
    <div className='fixed top-0 w-screen'>
    <div className="flex flex-col h-screen bg-[#3C4043]">
      {/* Toolbar sticky top-0 z-10 */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#3C4043] text-white px-4 py-1 text-sm">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button className="p-4 hover:bg-gray-700 rounded">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-medium">
          {file.name.split(".")[0]}
        </span>
      </div>

      {/* Middle controls */}
      <div className="flex items-center gap-2">
        <span className="bg-gray-900 px-2 py-1 rounded">1</span>
        <span>/</span>
        <span>9</span>
        <div className="h-5 border-l border-gray-600 mx-1" />

        <button onClick={zoomOut} className="p-3 hover:bg-[#5F6368] rounded-full">
          <Minus className="w-4 h-4" />
        </button>
        {/* onChange={(e)=>setScale((e.target.value+0.3)/100)}  */}
        {/* <input value={Math.round((scale*100)-20)+" %"}className="w-[46px] focus:border-none bg-gray-900 p-1 rounded"/> */}
        <span className="w-[46px] focus:border-none bg-gray-900 p-1 rounded">{Math.round((scale*100)-20)+" %"}</span>
        <button onClick={zoomIn} className="p-3 hover:bg-[#5F6368] rounded-full">
          <Plus className="w-4 h-4" />
        </button>

        <div className="h-5 border-l border-gray-600 mx-2" />

        <button className="p-2 hover:bg-[#5F6368] rounded">
          <RotateCcw className="w-5 h-5" />
        </button>

        <button className="p-2 hover:bg-[#5F6368] rounded">
          <PenLine className="w-5 h-5" />
        </button>

        <button className="p-2 hover:bg-[#5F6368] rounded">
          <Undo2 className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-[#5F6368] rounded">
          <Redo2 className="w-5 h-5" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-[#5F6368] rounded">
          <Download className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-[#5F6368] rounded">
          <Printer className="w-5 h-5" />
        </button>
      </div>
    </div>
      {/* <div className="sticky top-0 z-10 flex items-center gap-4 px-4 py-2 bg-[#3C4043] text-[#E8EAED] shadow border-b">
        <button onClick={zoomOut} className="px-3 py-1 rounded hover:bg-[#5F6368]">−</button>
        <button onClick={zoomIn} className="px-3 py-1 rounded hover:bg-[#5F6368]">+</button>
        <button onClick={fitPage} className="px-3 py-1 rounded hover:bg-[#5F6368]">Fit Page</button>
        <div className="ml-auto text-sm">
          {numPages ? `${numPages} page(s)` : 'Loading...'}
        </div>
      </div> */}

      {/* PDF Viewer */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-[#2A2A2E] px-4 py-6 relative"
      >
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages || 0 }, (_, i) => (
            <div
              key={i}
              onDoubleClick={handleDoubleClick(i + 1)}
              className="mb-4 mx-auto shadow w-fit cursor-pointer"
            >
              <Page pageNumber={i + 1} scale={scale} />
            </div>
          ))}
        </Document>

        {/* Popup */}
        {popup && (
          <div
            className="absolute z-50 bg-white border border-gray-400 shadow-lg rounded-md p-3 w-64"
            style={{ left: popup.x, top: popup.y }}
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-700">PDF Action</h4>
              <button
                onClick={() => setPopup(null)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Double-clicked on page {popup.pageNumber}
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default PDFWithPopup;
