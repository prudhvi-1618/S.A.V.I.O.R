import React, { useState } from 'react';
import PDFWithPopup from './PDFWithPopup';

const PDFApp = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className=" space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block border border-gray-300 p-2 rounded"
      />

      {file && <PDFWithPopup file={file} />}
    </div>
  );
};

export default PDFApp;
