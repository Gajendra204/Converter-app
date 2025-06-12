"use client"

import { useState, useCallback } from "react"


export default function FileConverter() {
  const [file, setFile] = useState(null)
  const [downloadUrl, setDownloadUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversionType, setConversionType] = useState("pdf-to-docx")
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [conversionComplete, setConversionComplete] = useState(false)

  const conversionOptions = [
    { value: "pdf-to-docx", label: "PDF to Word", from: "PDF", to: "DOCX", icon: "📄" },
    { value: "pdf-to-pptx", label: "PDF to PowerPoint", from: "PDF", to: "PPTX", icon: "📊" },
    { value: "docx-to-pdf", label: "Word to PDF", from: "DOCX", to: "PDF", icon: "📋" },
  ]

  const currentOption = conversionOptions.find((opt) => opt.value === conversionType)

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
      setDownloadUrl("")
      setError("")
      setConversionComplete(false)
    }
  }, [])

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setDownloadUrl("")
      setError("")
      setConversionComplete(false)
    }
  }

  const removeFile = () => {
    setFile(null)
    setDownloadUrl("")
    setError("")
    setConversionComplete(false)
  }

  const handleConvert = async () => {
    if (!file) return
    setError("")
    setConversionComplete(false)

    const formData = new FormData()
    formData.append("file", file)

    let endpoint = ""
    let extension = "docx"

    switch (conversionType) {
      case "pdf-to-docx":
        endpoint = "convert"
        extension = "docx"
        break
      case "pdf-to-pptx":
        endpoint = "convert-pdf-to-pptx"
        extension = "pptx"
        break
      case "docx-to-pdf":
        endpoint = "convert-docx-to-pdf"
        extension = "pdf"
        break
      default:
        setError("Unsupported conversion type")
        return
    }

    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/${endpoint}`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Conversion failed")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
      setConversionComplete(true)
    } catch (err) {
      console.error(err)
      setError("Conversion failed. Please try another file.")
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "pdf":
        return "📄"
      case "docx":
      case "doc":
        return "📝"
      case "pptx":
      case "ppt":
        return "📊"
      default:
        return "📁"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">File Converter</h1>
          <p className="text-gray-600">Convert your documents quickly and easily</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload File
              </h2>
              <p className="text-gray-500 mt-1">Drag and drop your file or click to browse</p>
            </div>
            <div className="p-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : file
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileSelect}
                  accept=".pdf,.docx,.doc,.pptx,.ppt"
                />

                {file ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-2xl">{getFileIcon(file.name)}</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button onClick={removeFile} className="ml-auto p-1 hover:bg-gray-100 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      File Ready
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">Drop your file here</p>
                      <p className="text-gray-500">
                        or <span className="text-blue-600 font-medium">browse</span> to choose a file
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">Supports PDF, DOCX, PPTX files</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conversion Options & Download */}
          <div className="space-y-6">
            {/* Conversion Options */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Conversion Options
                </h2>
                <p className="text-gray-500 mt-1">Choose your desired output format</p>
              </div>
              <div className="p-6 space-y-4">
                <select
                  value={conversionType}
                  onChange={(e) => setConversionType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {conversionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {currentOption && (
                  <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl mb-1">📄</div>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full">
                        {currentOption.from}
                      </span>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div className="text-center">
                      <div className="text-2xl mb-1">{currentOption.icon}</div>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800 rounded-full">
                        {currentOption.to}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleConvert}
                  disabled={!file || loading}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Converting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Convert File
                    </>
                  )}
                </button>

                {loading && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "33%" }}></div>
                    </div>
                    <p className="text-sm text-gray-500 text-center">Processing your file...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Download Section */}
            {(downloadUrl || error || conversionComplete) && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Download
                  </h2>
                </div>
                <div className="p-6">
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-red-800">{error}</span>
                    </div>
                  )}

                  {conversionComplete && downloadUrl && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-green-800">Conversion completed successfully!</span>
                      </div>

                      <a
                        href={downloadUrl}
                        download={`converted.${conversionType.split("-").pop()}`}
                        className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Download Converted File
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Easy Upload</h3>
            <p className="text-sm text-gray-600">Drag and drop or click to upload your files</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Fast Conversion</h3>
            <p className="text-sm text-gray-600">Quick and reliable file format conversion</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Instant Download</h3>
            <p className="text-sm text-gray-600">Download your converted files immediately</p>
          </div>
        </div>
      </div>
    </div>
  )
}
