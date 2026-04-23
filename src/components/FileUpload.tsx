"use client";

import React, { useCallback, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseCSV, ParseResult } from "@/lib/statement";

interface FileUploadProps {
  onUpload: (result: ParseResult) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const result = parseCSV(text);
        onUpload(result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
      }`}
    >
      <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? "text-blue-500" : "text-slate-400"}`} />
      <h3 className="text-lg font-semibold text-slate-700 mb-1">
        {fileName ? `Uploaded: ${fileName}` : "Drag & Drop your CSV file here"}
      </h3>
      <p className="text-sm text-slate-500 mb-6">or click the button to browse your files</p>
      
      <div className="relative">
        <input
          type="file"
          accept=".csv"
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Button variant={fileName ? "secondary" : "default"}>
          {fileName ? "Upload another file" : "Browse Files"}
        </Button>
      </div>
    </div>
  );
}
