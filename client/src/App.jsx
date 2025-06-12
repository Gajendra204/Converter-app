import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

function App() {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const onDrop = acceptedFiles => {
    setFile(acceptedFiles[0]);
    setDownloadUrl('');
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleConvert = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/convert', formData, {
        responseType: 'blob'
      });
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      alert('Conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, textAlign: 'center' }}>
      <h1>PDF to Word Converter</h1>
      <div {...getRootProps()} style={{ border: '2px dashed gray', padding: 40, cursor: 'pointer' }}>
        <input {...getInputProps()} />
        {file ? <p>{file.name}</p> : <p>Drag & drop a PDF file here, or click to select</p>}
      </div>
      <button onClick={handleConvert} disabled={!file || loading} style={{ marginTop: 20 }}>
        {loading ? 'Converting...' : 'Convert to Word'}
      </button>
      {downloadUrl && (
        <div style={{ marginTop: 20 }}>
          <a href={downloadUrl} download="converted.docx">Download Word File</a>
        </div>
      )}
    </div>
  );
}

export default App;
