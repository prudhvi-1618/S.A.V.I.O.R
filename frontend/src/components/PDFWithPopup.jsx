import React, { useState, useRef,useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Menu, Minus, Plus, RotateCcw, Undo2, Redo2, Upload , Bot , PenLine,  X,ScanLine,
  Volume2,
  ClipboardCopy,
  ChevronDown,
  ChevronUp,
  Search, } from "lucide-react";
import axios from 'axios';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;


const PDFWithPopup = ({ file, handleFileChange }) => {

  const [data,setData] = useState({});
  const [selectedWord,setSelectedWord] = useState(null);
  const [targeted_language,setTargeted_language] = useState("Telugu");

  const containerRef = useRef(null);
  const [popup, setPopup] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.4);

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const fitPage = () => setScale(1.4);
  
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading,setIsLoading] = useState(false);

  const [showBotPanel, setShowBotPanel] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const fetchData = async (word)=>{
    setData({});
    setShowDetails(false);
    setIsLoading(false);
    const res = await axios.get(`http://127.0.0.1:5000/dict/?word=${word}&targeted_language=${targeted_language}`);
    setSelectedWord(word);
    setData(res.data);
    setIsLoading(true);
    console.log(res.data);
  }
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
    fetchData(selectedText);
    setPopup({ x, y, pageNumber });
  };

  const textareaRef = useRef(null);

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto'; // Reset
    const scrollHeight = el.scrollHeight;
    const maxHeight = window.innerHeight * 0.2;

    el.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    el.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  };

  useEffect(() => {
    handleInput(); // adjust on mount
  }, []);

  return (
    <div className='fixed top-0 w-screen'>
    <div className="flex h-screen w-screen bg-[#3C4043]">
     <div className='flex flex-col flex-1 overflow-auto'>
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
          <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-[#2A2A2E] text-sm text-gray-300 border border-gray-600 shadow-sm">
            <ScanLine className="w-4 h-4 text-sky-400 animate-spin-slow" />
            <span className="tracking-wide">Extracting...</span>
            <div className="relative ml-auto">
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
              </span>
            </div>
          </div>


          {/* <button className="p-2 hover:bg-[#5F6368] rounded">
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
          </button> */}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button 
            className="p-2 hover:bg-[#5F6368] rounded cursor-pointer"
            title='Import PDF'
          >
            <label htmlFor="file"><Upload  className="w-5 h-5 cursor-pointer" /></label>
            <input
              type="file"
              accept="application/pdf"
              name='file'
              id='file'
              onChange={handleFileChange}
              className="border border-gray-300 p-2 rounded hidden"
            />
          </button>
          <button 
            className="p-2 hover:bg-[#5F6368] rounded cursor-pointer"
            onClick={() => setShowBotPanel((prev)=>!prev)}
            title='Open Bot Panel'
          >
            <Bot  className="w-6 h-6" />
          </button>
        </div>
      </div>
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
          {isLoading && popup && (
            <div
        className="absolute z-50 bg-white border border-gray-300 shadow-xl rounded-lg p-4 w-[30vw]"
        style={{ left: popup.x, top: popup.y }}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-2 ">
          <div className='relative flex gap-1'>
            <h4 className="text-3xl font-semibold text-gray-800">{selectedWord}</h4>
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
     <div>
      {showBotPanel && (
        <div className="w-[450px] h-screen flex flex-col bg-[#1F1F23] text-[#5F6368] shadow-lg z-10 py-4">
          <div className="flex justify-between items-center mx-4 mb-4 flex-shrink-0">
            <h2 className="text-lg font-semibold">Bot Assistant</h2>
            <button
              onClick={() => setShowBotPanel(false)}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
              aria-label="Close Panel"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="flex-grow overflow-y-auto px-4">
            <div className="container px-4 py-2 space-y-4 max-w-md mx-auto">
              {/* Human message */}
              <div className="flex justify-end">
                <div className="bg-[#1F2937] text-[#D1D5DB] px-4 py-2 rounded-lg rounded-br-none max-w-xs break-words">
                  Hi! How can I help you today?
                </div>
              </div>

              {/* AI message */}
              <div className="flex justify-start">
                <div className="bg-[#111827] text-[#F3F4F6] px-4 py-2 rounded-lg rounded-bl-none max-w-xs break-words">
                  Hello! I’m your assistant. Ask me anything.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="bg-[#1F2937] text-[#D1D5DB] px-4 py-2 rounded-lg rounded-br-none max-w-xs break-words">
                  Can you tell me a joke?
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-[#111827] text-[#F3F4F6] px-4 py-2 rounded-lg rounded-bl-none max-w-xs break-words">
                  Sure! Why don’t scientists trust atoms? Because they make up everything!
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-amber-600 text-[#F3F4F6] px-4 py-2 rounded-lg rounded-bl-none max-w-xs break-words">
                  Bot functionality hasn’t been developed yet.
                </div>
              </div>
          </div>
          </div>

          {/* Fixed input at bottom */}
          <div className="flex-shrink-0 bg-[#2A2A2E] text-[#9CA3AF] mx-2 px-4 py-3 rounded-t-xl border-t border-[#5F6368]">
          <textarea
              ref={textareaRef}
              onInput={handleInput}
              rows={1}
              className="w-full max-h-[20vh] px-2 text-lg placeholder-gray-400 bg-transparent border-0 focus:outline-none resize-none overflow-y-auto"
              placeholder="How can I assist you?"
            ></textarea>

            <div className="flex mt-2">
              <div className="bg-[#5F6368] p-2 rounded-xl cursor-pointer">
                Workflow
              </div>
            </div>
          </div>
        </div>
      )}

     </div>
    </div>
    </div>
  );
};

export default PDFWithPopup;
