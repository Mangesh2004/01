'use client'
import { api } from "@/convex/_generated/api"
import { useMutation } from "convex/react"
import { useState } from "react";
import React from "react";
import { Button } from "./ui/button";
import uuid4 from 'uuid4'
import { Input } from "./ui/input";
import PdfViewer from "./PdfViewer";
import LoadingSpinner from "./LoadingSpinner";

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
    <div className="container mx-auto p-4">
      {/* Upload Controls */}
      <div className="flex gap-4 mb-6">
        <Input 
          type="file" 
          accept="application/pdf" 
          onChange={OnFileSelect}
          className="flex-1"
        />
        <Input 
          placeholder="Enter the name of the file" 
          onChange={(e) => setFileName(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={OnUpload} 
          disabled={loading}
          className="w-32"
        >
          {loading ? <LoadingSpinner /> : 'Load PDF'}
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side - PDF Viewer */}
        <div className="w-full h-[800px] border rounded-lg shadow-lg bg-white">
          {fileUrl ? (
            <PdfViewer fileUrl={fileUrl} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No PDF loaded
            </div>
          )}
        </div>

        {/* Right Side - Extraction Results */}
        <div className="w-full h-[800px] border rounded-lg shadow-lg bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Extracted Results</h2>
            <Button 
              onClick={extractAnswerSheet} 
              disabled={!fileUrl || loading}
              className="w-40"
            >
              {loading ? <LoadingSpinner /> : 'Extract Answer Sheet'}
            </Button>
          </div>

          {loading && (
            <div className="h-[calc(100%-4rem)] flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600">Processing PDF...</p>
              </div>
            </div>
          )}

          {!loading && extractedResult && (
            <div className="h-[calc(100%-4rem)] overflow-auto">
              <pre className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                {JSON.stringify(extractedResult, null, 2)}
              </pre>
            </div>
          )}

          {!loading && !extractedResult && (
            <div className="h-[calc(100%-4rem)] flex items-center justify-center text-gray-500">
              No data extracted yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
