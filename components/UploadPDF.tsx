'use client'
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useState } from "react";
import React from "react";
import { Button } from "./ui/button";
import uuid4 from 'uuid4'
import { Input } from "./ui/input";
import PdfViewer from "./PdfViewer";

export default function UploadPDF() {
  const generateUploadURL = useMutation(api.fileStorage.generateUploadUrl)
  const InsertFileEntry = useMutation(api.fileStorage.AddFileEntrytoDB)
  const getFileUrl = useMutation(api.fileStorage.getFileURL)

  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState(''); // holds the uploaded file URL
  const [extractedResult, setExtractedResult] = useState(''); // holds the extracted answer sheet JSON

  const OnFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }
      
  const OnUpload = async () => {
    if (!file) return;
    setLoading(true);
    // Get a short-lived upload URL
    const posturl = await generateUploadURL();
    
    // Upload the file
    const result = await fetch(posturl, {
      method: 'POST',
      headers: { "Content-Type": file.type },
      body: file
    });
    const { storageId } = await result.json();
    
    // Generate a unique fileId and retrieve the file URL from storage
    const fileId = uuid4();
    const newFileUrl = await getFileUrl({ storageId: storageId });
    
    // Save the file entry to the database
    await InsertFileEntry({
      fileId: fileId,
      storageId: storageId,
      fileName: fileName || 'Untitled File',
      fileURL: newFileUrl || '',
    });
    
    setFileUrl(newFileUrl as string);
    setLoading(false);
  }

  // Function to call the FastAPI extraction endpoint
  const extractAnswerSheet = async () => {
    if (!fileUrl) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf_uri: fileUrl })
      });
      const data = await response.json();
      console.log(data.result);
      
      if (response.ok) {
        setExtractedResult(data.result);
      } else {
        console.error("Error:", data.detail);
      }
    } catch (error) {
      console.error("Extraction error:", error);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div className="w-full max-w-md">
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={OnFileSelect}
          className="w-full p-2 border rounded-lg" 
        />
      </div>

      <Input 
        placeholder="Enter the name of the file" 
        onChange={(e) => setFileName(e.target.value)}
        className="w-full max-w-md"
      />

      <Button 
        onClick={OnUpload} 
        disabled={loading}
        className="w-full max-w-md"
      >
        {loading ? 'Loading...' : 'Load PDF'}
      </Button>
      
      <div className="w-full max-w-2xl">
        {fileUrl && <PdfViewer fileUrl={fileUrl} />}
      </div>
      
      {fileUrl && (
        <Button 
          onClick={extractAnswerSheet} 
          disabled={loading}
          className="w-full max-w-md"
        >
          {loading ? 'Extracting...' : 'Extract Answer Sheet'}
        </Button>
      )}
      
      {extractedResult && (
        <div className="w-full max-w-2xl mt-4 p-6 bg-gray-50 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Extracted Answer Sheet:</h2>
          <pre className="bg-white p-4 rounded-md overflow-auto whitespace-pre-wrap">
            {JSON.stringify(extractedResult)}
          </pre>
        </div>
      )}
    </div>
  );
}
