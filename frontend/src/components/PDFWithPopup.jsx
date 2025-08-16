import React, { useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Menu, Minus, Plus, RotateCcw, Undo2, Redo2, Download, Printer, PenLine,  X,
  Volume2,
  ClipboardCopy,
  ChevronDown,
  ChevronUp,
  Search, } from "lucide-react";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const data = {
  "antonyms": [
    "Swarga",
    "Narakam"
  ],
  "definition": [
    {
      "contextual_meaning": "It is often given to individuals born under a specific star or with a particular destiny",
      "meaning": "A given name of Telugu origin",
      "part_of_speech": [
        "Proper Noun"
      ]
    },
    {
      "contextual_meaning": "This usage is less common and typically found in literary or poetic language",
      "meaning": "A term used in some contexts to refer to the Earth or the world",
      "part_of_speech": [
        "Common Noun"
      ]
    }
  ],
  "etymology": "The word 'Prudhvi' is derived from the Sanskrit word 'पृथ्वी' (Prithvi), meaning 'the Earth' or 'the world'. It has been adapted into Telugu as 'పృధ్వి' (Prudhvi).",
  "example_sentences": [
    "Prudhvi is a popular name among Telugu-speaking people.",
    "The word Prudhvi can also be used to refer to the Earth in a poetic sense."
  ],
  "pronunciation": {
    "phonetic": "/prʊdʰviː/"
  },
  "related_words": [
    {
      "description": "The Sanskrit word from which 'Prudhvi' is derived.",
      "relation": "Etymological origin",
      "translation": {
        "contextual_sentence": "పృథ్వి అనేది సంస్కృత పదం.",
        "cultural_note": "The cultural significance of 'Prithvi' is profound, as it represents the Earth and is often personified as a goddess.",
        "language": "Telugu",
        "part_of_speech": [
          "Proper Noun"
        ],
        "pronunciation": {
          "phonetic": "/prɪtʰʋiː/"
        },
        "translated_word": "పృథ్వి"
      },
      "word": "Prithvi"
    },
    {
      "description": "A term used to refer to the Earth or land.",
      "relation": "Synonym",
      "translation": {
        "contextual_sentence": "భూమి అనేది మన గ్రహం.",
        "cultural_note": "In many Indian languages, 'Bhumi' is used as a synonym for 'Prudhvi', emphasizing the earthy or terrestrial aspect.",
        "language": "Telugu",
        "part_of_speech": [
          "Common Noun"
        ],
        "pronunciation": {
          "phonetic": "/bʰuːmiː/"
        },
        "translated_word": "భూమి"
      },
      "word": "Bhumi"
    }
  ],
  "synonyms": [
    "Bhumi",
    "Dharani",
    "Vasundhara"
  ],
  "translation": {
    "contextual_sentence": "పృధ్వి అనేది తెలుగు పేరు.",
    "cultural_note": "In Telugu culture, names often have deep meanings and are chosen based on their significance and the characteristics they are believed to impart to the bearer.",
    "language": "Telugu",
    "part_of_speech": [
      "Proper Noun",
      "Common Noun"
    ],
    "pronunciation": {
      "phonetic": "/prʊdʰviː/"
    },
    "translated_word": "పృధ్వి"
  }
}

const PDFWithPopup = ({ file }) => {
  const containerRef = useRef(null);
  const [popup, setPopup] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const fitPage = () => setScale(1.2);
  
  const [showDetails, setShowDetails] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDoubleClick = (pageNumber) => (e) => {

    const textSpan = e.target.closest(".textLayer span");
    if (!textSpan) {
      setPopup(null);
      return;
    }

    // const selectedText = textSpan.textContent.trim();
     const selectedText = window.getSelection().toString().trim();
    if (!selectedText) return; 
    if (!selectedText) {
      setPopup(null);
      return;
    }
    console.log(selectedText);

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
              className="mb-4 mx-auto shadow w-fit"
            >
              <Page pageNumber={i + 1} scale={scale} />
            </div>
          ))}
        </Document>

        {/* Popup */}
        {popup && (
          <div
      className="absolute z-50 bg-white border border-gray-300 shadow-xl rounded-lg p-4 w-[30vw]"
      style={{ left: popup.x, top: popup.y }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 ">
        <div className='relative flex gap-1'>
          <h4 className="text-3xl font-semibold text-gray-800">Prudhvi</h4>
          <p className="relative top-5 text-xs text-gray-500 capitalize">{data.definition[0].part_of_speech}</p>
        </div>
        <div className='flex gap-4'>
           <button
            onClick={() => copyToClipboard(data.definition.meaning)}
            className="flex items-center text-xl text-zinc-700 hover:text-zinc-800 cursor-pointer"
          >
            <ClipboardCopy size={16} className="mr-1" />
          </button>
          <button
            onClick={() => setPopup(null)}
            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="text-sm text-gray-700 space-y-2">
        <div>
          <strong>Definition:</strong> {data.definition[0].meaning}
        </div>

        <div>
          <strong>Context:</strong> {data.definition[0].contextual_meaning}
        </div>

        <div className="flex items-center">
          <strong>Pronunciation:</strong>&nbsp;{data.pronunciation.phonetic}
          <button
            // onClick={() => playAudio(data.interactive_elements.audio_button.url)}
            className="ml-2 text-blue-500 hover:text-blue-700"
            aria-label="Play pronunciation"
          >
            <Volume2 size={16} />
          </button>
        </div>

        <div className="flex items-center">
          <strong>Telugu:</strong>&nbsp;
          {data.translation.translated_word} ({data.translation.pronunciation.phonetic})
          <button
            // onClick={() => playAudio(data.interactive_elements.translation_audio_button.url)}
            className="ml-2 text-blue-500 hover:text-blue-700"
            aria-label="Play Telugu pronunciation"
          >
            <Volume2 size={16} />
          </button>
        </div>

        <div>
          <strong>Telugu Sentence:</strong> {data.translation.contextual_sentence}
        </div>
      </div>

      {/* Toggle Details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full mt-3 flex justify-end items-center text-xs font-bold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
      >
        <span className="ml-1">{showDetails ? 'Hide Details' : 'Show More Details'}</span>
         {showDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-3 text-sm text-gray-700 space-y-2 border-t pt-3">
          <div>
            <strong>Etymology:</strong> {data.etymology}
          </div>

          <div>
            <strong>Synonyms:</strong> {data.synonyms.join(', ')}
          </div>

          <div>
            <strong>Antonyms:</strong> {data.antonyms.join(', ')}
          </div>

          <div>
            <strong>Examples:</strong>
            <ul className="list-disc list-inside text-gray-600">
              {data.example_sentences.map((sentence, index) => (
                <li key={index}>{sentence}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-1">
            <strong>Related Word:</strong> {data.related_words[0].word}
          </div>
        </div>
      )}

    </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default PDFWithPopup;
