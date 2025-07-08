"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdvancedFileConverter() {
  const { currentUser } = useAuth();
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversionCategory, setConversionCategory] = useState("document");
  const [conversionType, setConversionType] = useState("pdf-to-docx");
  const [videoQuality, setVideoQuality] = useState("medium");
  const [compressionLevel, setCompressionLevel] = useState("medium");
  const [audioBitrate, setAudioBitrate] = useState("recommended");
  const [audioSampleRate, setAudioSampleRate] = useState("recommended");
  const [audioChannels, setAudioChannels] = useState("recommended");
  const [audioVolume, setAudioVolume] = useState("0");
  const [audioNormalize, setAudioNormalize] = useState(false);
  const [audioEnhancement, setAudioEnhancement] = useState("none");
  const [trimStartTime, setTrimStartTime] = useState("");
  const [trimDuration, setTrimDuration] = useState("");
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [conversionComplete, setConversionComplete] = useState(false);
  const [availableOptions, setAvailableOptions] = useState([]);

  // Enhanced document conversion options
  const allConversionOptions = {
    document: {
      name: "Document",
      icon: "📄",
      accept: ".pdf,.docx,.doc,.pptx,.ppt,.xlsx,.xls,.txt,.rtf,.html,.htm",
      options: [
        // PDF conversions
        {
          value: "pdf-to-docx",
          label: "PDF to Word",
          from: "PDF",
          to: "DOCX",
          icon: "📄",
          fileTypes: ["pdf"],
        },
        {
          value: "pdf-to-pptx",
          label: "PDF to PowerPoint",
          from: "PDF",
          to: "PPTX",
          icon: "📊",
          fileTypes: ["pdf"],
        },
        {
          value: "pdf-to-xlsx",
          label: "PDF to Excel",
          from: "PDF",
          to: "XLSX",
          icon: "📊",
          fileTypes: ["pdf"],
        },
        {
          value: "pdf-to-txt",
          label: "PDF to Text",
          from: "PDF",
          to: "TXT",
          icon: "📝",
          fileTypes: ["pdf"],
        },
        {
          value: "pdf-to-rtf",
          label: "PDF to RTF",
          from: "PDF",
          to: "RTF",
          icon: "📝",
          fileTypes: ["pdf"],
        },

        // Word conversions
        {
          value: "docx-to-pdf",
          label: "Word to PDF",
          from: "DOCX",
          to: "PDF",
          icon: "📋",
          fileTypes: ["docx", "doc"],
        },

        // PowerPoint conversions
        {
          value: "pptx-to-pdf",
          label: "PowerPoint to PDF",
          from: "PPTX",
          to: "PDF",
          icon: "📋",
          fileTypes: ["pptx", "ppt"],
        },

        // Excel conversions
        {
          value: "xlsx-to-pdf",
          label: "Excel to PDF",
          from: "XLSX",
          to: "PDF",
          icon: "📋",
          fileTypes: ["xlsx", "xls"],
        },

        // Text conversions
        {
          value: "txt-to-pdf",
          label: "Text to PDF",
          from: "TXT",
          to: "PDF",
          icon: "📋",
          fileTypes: ["txt"],
        },

        // HTML conversions
        {
          value: "html-to-pdf",
          label: "HTML to PDF",
          from: "HTML",
          to: "PDF",
          icon: "📋",
          fileTypes: ["html", "htm"],
        },
      ],
    },
    video: {
      name: "Video",
      icon: "🎥",
      accept: ".mp4,.avi,.mov,.wmv,.mkv,.flv,.webm",
      options: [
        {
          value: "video-to-mp4",
          label: "Convert to MP4",
          from: "Video",
          to: "MP4",
          icon: "🎬",
          fileTypes: ["avi", "mov", "wmv", "mkv", "flv", "webm"],
        },
        {
          value: "video-to-avi",
          label: "Convert to AVI",
          from: "Video",
          to: "AVI",
          icon: "🎬",
          fileTypes: ["mp4", "mov", "wmv", "mkv", "flv", "webm"],
        },
        {
          value: "video-to-mov",
          label: "Convert to MOV",
          from: "Video",
          to: "MOV",
          icon: "🎬",
          fileTypes: ["mp4", "avi", "wmv", "mkv", "flv", "webm"],
        },
        {
          value: "video-to-wmv",
          label: "Convert to WMV",
          from: "Video",
          to: "WMV",
          icon: "🎬",
          fileTypes: ["mp4", "avi", "mov", "mkv", "flv", "webm"],
        },
        {
          value: "video-to-mkv",
          label: "Convert to MKV",
          from: "Video",
          to: "MKV",
          icon: "🎬",
          fileTypes: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
        },
        {
          value: "video-to-audio",
          label: "Extract Audio (MP3)",
          from: "Video",
          to: "MP3",
          icon: "🎵",
          fileTypes: ["mp4", "avi", "mov", "wmv", "mkv", "flv", "webm"],
        },
        {
          value: "compress-video",
          label: "Compress Video",
          from: "Video",
          to: "Compressed",
          icon: "📦",
          fileTypes: ["mp4", "avi", "mov", "wmv", "mkv", "flv", "webm"],
        },
      ],
    },
    audio: {
      name: "Audio",
      icon: "🎵",
      accept: ".mp3,.wav,.flac,.aac,.ogg,.m4a,.wma,.mp4,.avi,.mov",
      options: [
        {
          value: "audio-to-mp3",
          label: "Convert to MP3",
          from: "Audio",
          to: "MP3",
          icon: "🎵",
          fileTypes: ["wav", "flac", "aac", "ogg", "m4a", "wma"],
        },
        {
          value: "audio-to-wav",
          label: "Convert to WAV",
          from: "Audio",
          to: "WAV",
          icon: "🎵",
          fileTypes: ["mp3", "flac", "aac", "ogg", "m4a", "wma"],
        },
        {
          value: "audio-to-flac",
          label: "Convert to FLAC",
          from: "Audio",
          to: "FLAC",
          icon: "🎵",
          fileTypes: ["mp3", "wav", "aac", "ogg", "m4a", "wma"],
        },
        {
          value: "audio-to-aac",
          label: "Convert to AAC",
          from: "Audio",
          to: "AAC",
          icon: "🎵",
          fileTypes: ["mp3", "wav", "flac", "ogg", "m4a", "wma"],
        },
        {
          value: "audio-to-ogg",
          label: "Convert to OGG",
          from: "Audio",
          to: "OGG",
          icon: "🎵",
          fileTypes: ["mp3", "wav", "flac", "aac", "m4a", "wma"],
        },
        {
          value: "audio-to-m4a",
          label: "Convert to M4A",
          from: "Audio",
          to: "M4A",
          icon: "🎵",
          fileTypes: ["mp3", "wav", "flac", "aac", "ogg", "wma"],
        },
        {
          value: "enhance-audio",
          label: "Enhance Audio",
          from: "Audio",
          to: "Enhanced",
          icon: "✨",
          fileTypes: ["mp3", "wav", "flac", "aac", "ogg", "m4a", "wma"],
        },
        {
          value: "trim-audio",
          label: "Trim Audio",
          from: "Audio",
          to: "Trimmed",
          icon: "✂️",
          fileTypes: ["mp3", "wav", "flac", "aac", "ogg", "m4a", "wma"],
        },
        {
          value: "merge-audio",
          label: "Merge Audio Files",
          from: "Multiple",
          to: "Merged",
          icon: "🔗",
          fileTypes: ["mp3", "wav", "flac", "aac", "ogg", "m4a", "wma"],
        },
      ],
    },
  };

  const conversionCategories = allConversionOptions;

  // Audio format recommendations
  const audioRecommendations = {
    "audio-to-mp3": {
      bitrate: "128k",
      sampleRate: "44100",
      channels: "2",
      description: "Good quality, small size",
    },
    "audio-to-wav": {
      bitrate: "auto",
      sampleRate: "44100",
      channels: "2",
      description: "CD quality, uncompressed",
    },
    "audio-to-flac": {
      bitrate: "auto",
      sampleRate: "44100",
      channels: "2",
      description: "Lossless, smaller than WAV",
    },
    "audio-to-aac": {
      bitrate: "128k",
      sampleRate: "44100",
      channels: "2",
      description: "High quality, efficient",
    },
    "audio-to-ogg": {
      bitrate: "128k",
      sampleRate: "44100",
      channels: "2",
      description: "Open source, good quality",
    },
    "audio-to-m4a": {
      bitrate: "128k",
      sampleRate: "44100",
      channels: "2",
      description: "Apple format, high quality",
    },
  };

  const currentCategory = conversionCategories[conversionCategory];
  const currentOption =
    availableOptions.find((opt) => opt.value === conversionType) ||
    currentCategory?.options[0];
  const currentRecommendation = audioRecommendations[conversionType];

  // Get file extension from filename
  const getFileExtension = (filename) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  // Filter options based on uploaded file
  const filterOptionsForFile = (filename, category) => {
    if (!filename) return conversionCategories[category]?.options || [];

    const fileExt = getFileExtension(filename);
    const categoryOptions = conversionCategories[category]?.options || [];

    return categoryOptions.filter(
      (option) =>
        option.fileTypes?.includes(fileExt) || option.value === "merge-audio"
    );
  };

  // Update available options when file or category changes
  useEffect(() => {
    if (file) {
      const filtered = filterOptionsForFile(file.name, conversionCategory);
      setAvailableOptions(filtered);

      // Set first available option as default
      if (filtered.length > 0) {
        setConversionType(filtered[0].value);
      }
    } else {
      setAvailableOptions(
        conversionCategories[conversionCategory]?.options || []
      );
    }
  }, [file, conversionCategory]);

  const getActualAudioSettings = () => {
    const recommendation = currentRecommendation;
    return {
      bitrate:
        audioBitrate === "recommended"
          ? recommendation?.bitrate || "128k"
          : audioBitrate,
      sampleRate:
        audioSampleRate === "recommended"
          ? recommendation?.sampleRate || "44100"
          : audioSampleRate,
      channels:
        audioChannels === "recommended"
          ? recommendation?.channels || "2"
          : audioChannels,
    };
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (conversionType === "merge-audio") {
          setFiles(Array.from(e.dataTransfer.files));
        } else {
          setFile(e.dataTransfer.files[0]);
        }
        setDownloadUrl("");
        setError("");
        setConversionComplete(false);
      }
    },
    [conversionType]
  );

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (conversionType === "merge-audio") {
        setFiles(Array.from(e.target.files));
      } else {
        setFile(e.target.files[0]);
      }
      setDownloadUrl("");
      setError("");
      setConversionComplete(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFiles([]);
    setDownloadUrl("");
    setError("");
    setConversionComplete(false);
    setAvailableOptions(
      conversionCategories[conversionCategory]?.options || []
    );
  };

  const handleCategoryChange = (category) => {
    setConversionCategory(category);
    setConversionType(conversionCategories[category].options[0].value);
    setFile(null);
    setFiles([]);
    setDownloadUrl("");
    setError("");
    setConversionComplete(false);
    setAudioBitrate("recommended");
    setAudioSampleRate("recommended");
    setAudioChannels("recommended");
    setAvailableOptions(conversionCategories[category]?.options || []);
  };

  const handleConvert = async () => {
    if (!file && files.length === 0) return;
    setError("");
    setConversionComplete(false);

    const formData = new FormData();

    if (conversionType === "merge-audio") {
      files.forEach((f) => formData.append("files", f));
    } else {
      formData.append("file", file);
    }
    if (currentUser) {
      formData.append("userId", currentUser.uid);
    }

    let endpoint = "";
    let extension = "";

    // Enhanced document conversions
    if (conversionCategory === "document") {
      switch (conversionType) {
        case "pdf-to-docx":
          endpoint = "api/convert";
          extension = "docx";
          break;
        case "pdf-to-pptx":
          endpoint = "api/convert-pdf-to-pptx";
          extension = "pptx";
          break;
        case "pdf-to-xlsx":
          endpoint = "api/convert-pdf-to-xlsx";
          extension = "xlsx";
          break;
        case "pdf-to-txt":
          endpoint = "api/convert-pdf-to-txt";
          extension = "txt";
          break;
        case "pdf-to-rtf":
          endpoint = "api/convert-pdf-to-rtf";
          extension = "rtf";
          break;
        case "docx-to-pdf":
          endpoint = "api/convert-docx-to-pdf";
          extension = "pdf";
          break;
        case "pptx-to-pdf":
          endpoint = "api/convert-pptx-to-pdf";
          extension = "pdf";
          break;
        case "xlsx-to-pdf":
          endpoint = "api/convert-xlsx-to-pdf";
          extension = "pdf";
          break;
        case "txt-to-pdf":
          endpoint = "api/convert-txt-to-pdf";
          extension = "pdf";
          break;
        case "html-to-pdf":
          endpoint = "api/convert-html-to-pdf";
          extension = "pdf";
          break;
      }
    }
    // Video conversions (existing logic)
    else if (conversionCategory === "video") {
      switch (conversionType) {
        case "video-to-mp4":
          endpoint = "api/convert-video";
          extension = "mp4";
          formData.append("targetFormat", "mp4");
          formData.append("quality", videoQuality);
          break;
        case "video-to-avi":
          endpoint = "api/convert-video";
          extension = "avi";
          formData.append("targetFormat", "avi");
          formData.append("quality", videoQuality);
          break;
        case "video-to-mov":
          endpoint = "api/convert-video";
          extension = "mov";
          formData.append("targetFormat", "mov");
          formData.append("quality", videoQuality);
          break;
        case "video-to-wmv":
          endpoint = "api/convert-video";
          extension = "wmv";
          formData.append("targetFormat", "wmv");
          formData.append("quality", videoQuality);
          break;
        case "video-to-mkv":
          endpoint = "api/convert-video";
          extension = "mkv";
          formData.append("targetFormat", "mkv");
          formData.append("quality", videoQuality);
          break;
        case "video-to-audio":
          endpoint = "api/convert-video-to-audio";
          extension = "mp3";
          formData.append("targetFormat", "mp3");
          break;
        case "compress-video":
          endpoint = "api/compress-video";
          extension = "mp4";
          formData.append("compressionLevel", compressionLevel);
          break;
      }
    }
    // Audio conversions (existing logic)
    else if (conversionCategory === "audio") {
      const actualSettings = getActualAudioSettings();

      switch (conversionType) {
        case "audio-to-mp3":
          endpoint = "api/convert-audio";
          extension = "mp3";
          formData.append("targetFormat", "mp3");
          formData.append("bitrate", actualSettings.bitrate);
          formData.append("sampleRate", actualSettings.sampleRate);
          formData.append("channels", actualSettings.channels);
          break;
        case "audio-to-wav":
          endpoint = "api/convert-audio";
          extension = "wav";
          formData.append("targetFormat", "wav");
          formData.append("sampleRate", actualSettings.sampleRate);
          formData.append("channels", actualSettings.channels);
          break;
        case "audio-to-flac":
          endpoint = "api/convert-audio";
          extension = "flac";
          formData.append("targetFormat", "flac");
          formData.append("sampleRate", actualSettings.sampleRate);
          formData.append("channels", actualSettings.channels);
          break;
        case "audio-to-aac":
          endpoint = "api/convert-audio";
          extension = "aac";
          formData.append("targetFormat", "aac");
          formData.append("bitrate", actualSettings.bitrate);
          formData.append("sampleRate", actualSettings.sampleRate);
          formData.append("channels", actualSettings.channels);
          break;
        case "audio-to-ogg":
          endpoint = "api/convert-audio";
          extension = "ogg";
          formData.append("targetFormat", "ogg");
          formData.append("bitrate", actualSettings.bitrate);
          formData.append("sampleRate", actualSettings.sampleRate);
          formData.append("channels", actualSettings.channels);
          break;
        case "audio-to-m4a":
          endpoint = "api/convert-audio";
          extension = "m4a";
          formData.append("targetFormat", "m4a");
          formData.append("bitrate", actualSettings.bitrate);
          formData.append("sampleRate", actualSettings.sampleRate);
          formData.append("channels", actualSettings.channels);
          break;
        case "enhance-audio":
          endpoint = "api/enhance-audio";
          extension = "mp3";
          formData.append("enhancement", audioEnhancement);
          formData.append("volume", audioVolume);
          formData.append("normalize", audioNormalize.toString());
          break;
        case "trim-audio":
          endpoint = "api/trim-audio";
          extension = "mp3";
          formData.append("startTime", trimStartTime);
          formData.append("duration", trimDuration);
          break;
        case "merge-audio":
          endpoint = "api/merge-audio";
          extension = "mp3";
          break;
      }
    }

    if (!endpoint) {
      setError("Unsupported conversion type");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api-icanconvert.onrender.com/${endpoint}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setConversionComplete(true);
    } catch (err) {
      console.error(err);
      setError("Conversion failed. Please try another file.");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "docx":
      case "doc":
        return "📝";
      case "pptx":
      case "ppt":
        return "📊";
      case "xlsx":
      case "xls":
        return "📊";
      case "txt":
      case "rtf":
        return "📝";
      case "html":
      case "htm":
        return "🌐";
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
      case "mkv":
        return "🎥";
      case "mp3":
      case "wav":
      case "flac":
      case "aac":
      case "ogg":
      case "m4a":
      case "wma":
        return "🎵";
      default:
        return "📁";
    }
  };

  const getFileTypeName = (fileName) => {
    const extension = getFileExtension(fileName);
    const typeMap = {
      pdf: "PDF",
      docx: "Word Document",
      doc: "Word Document",
      pptx: "PowerPoint",
      ppt: "PowerPoint",
      xlsx: "Excel",
      xls: "Excel",
      txt: "Text",
      rtf: "Rich Text",
      html: "HTML",
      htm: "HTML",
      mp4: "MP4 Video",
      avi: "AVI Video",
      mov: "MOV Video",
      wmv: "WMV Video",
      mkv: "MKV Video",
      mp3: "MP3 Audio",
      wav: "WAV Audio",
      flac: "FLAC Audio",
      aac: "AAC Audio",
      ogg: "OGG Audio",
      m4a: "M4A Audio",
      wma: "WMA Audio",
    };
    return typeMap[extension] || extension.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Universal File Converter
          </h1>
          <p className="text-gray-600">
            Convert documents, videos, audio files, and more with ease
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(conversionCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  conversionCategory === key
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload {currentCategory?.name} File
                {conversionType === "merge-audio" ? "s" : ""}
              </h2>
              <p className="text-gray-500 mt-1">
                {conversionType === "merge-audio"
                  ? "Select multiple audio files to merge"
                  : "Drag and drop your file or click to browse"}
              </p>
            </div>
            <div className="p-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : file || files.length > 0
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
                  accept={currentCategory?.accept}
                  multiple={conversionType === "merge-audio"}
                />

                {file || files.length > 0 ? (
                  <div className="space-y-4">
                    {conversionType === "merge-audio" ? (
                      <div className="space-y-2">
                        {files.map((f, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-center gap-3"
                          >
                            <span className="text-xl">
                              {getFileIcon(f.name)}
                            </span>
                            <div className="text-left">
                              <p className="font-medium text-gray-900">
                                {f.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {(f.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={removeFile}
                          className="mt-2 p-1 hover:bg-gray-100 rounded-full"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl">
                          {getFileIcon(file.name)}
                        </span>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            {file.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          <p className="text-xs text-blue-600">
                            {getFileTypeName(file.name)} file detected
                          </p>
                        </div>
                        <button
                          onClick={removeFile}
                          className="ml-auto p-1 hover:bg-gray-100 rounded-full"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      File{files.length > 1 ? "s" : ""} Ready
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{currentCategory?.icon}</span>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        Drop your {currentCategory?.name.toLowerCase()} file
                        {conversionType === "merge-audio" ? "s" : ""} here
                      </p>
                      <p className="text-gray-500">
                        or{" "}
                        <span className="text-blue-600 font-medium">
                          browse
                        </span>{" "}
                        to choose{" "}
                        {conversionType === "merge-audio" ? "files" : "a file"}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      Supports:{" "}
                      {currentCategory?.accept.replace(/\./g, "").toUpperCase()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conversion Options & Settings */}
          <div className="space-y-6">
            {/* Conversion Options */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {file
                    ? `Available conversions for your ${getFileTypeName(
                        file.name
                      )} file`
                    : "Conversion Options"}
                </h2>
                <p className="text-gray-500 mt-1">
                  {file
                    ? `${availableOptions.length} conversion${
                        availableOptions.length !== 1 ? "s" : ""
                      } available`
                    : "Choose your desired output format and settings"}
                </p>
              </div>
              <div className="p-6 space-y-4">
                {availableOptions.length > 0 ? (
                  <select
                    value={conversionType}
                    onChange={(e) => setConversionType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {availableOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600">
                      Upload a file to see available conversion options
                    </p>
                  </div>
                )}

                {/* Show file type compatibility info */}
                {file && availableOptions.length === 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-yellow-800">
                        File type not supported in this category
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Try selecting a different category or upload a supported
                      file type.
                    </p>
                  </div>
                )}

                {/* Recommended Settings Info */}
                {conversionCategory === "audio" && currentRecommendation && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium text-blue-800">
                        Recommended Settings
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      {currentRecommendation.description}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Using recommended settings will give you the best balance
                      of quality and file size for most users.
                    </p>
                  </div>
                )}

                {/* Video Quality Settings */}
                {conversionCategory === "video" &&
                  conversionType.includes("video-to-") &&
                  !conversionType.includes("audio") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Video Quality
                      </label>
                      <select
                        value={videoQuality}
                        onChange={(e) => setVideoQuality(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="high">
                          High Quality (2000k bitrate) - Best quality
                        </option>
                        <option value="medium">
                          Medium Quality (1000k bitrate) - Recommended
                        </option>
                        <option value="low">
                          Low Quality (500k bitrate) - Smaller file
                        </option>
                      </select>
                    </div>
                  )}

                {/* Compression Settings */}
                {conversionType === "compress-video" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compression Level
                    </label>
                    <select
                      value={compressionLevel}
                      onChange={(e) => setCompressionLevel(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="light">
                        Light Compression - Better Quality
                      </option>
                      <option value="medium">
                        Medium Compression - Recommended
                      </option>
                      <option value="heavy">
                        Heavy Compression - Smaller Size
                      </option>
                    </select>
                  </div>
                )}

                {/* Audio Settings with Recommended Options */}
                {conversionCategory === "audio" &&
                  conversionType.startsWith("audio-to-") && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bitrate
                            <span className="text-xs text-gray-500 ml-1">
                              (Audio Quality)
                            </span>
                          </label>
                          <select
                            value={audioBitrate}
                            onChange={(e) => setAudioBitrate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="recommended">✨ Recommended</option>
                            <option value="64k">64 kbps - Lower quality</option>
                            <option value="128k">
                              128 kbps - Good quality
                            </option>
                            <option value="192k">
                              192 kbps - High quality
                            </option>
                            <option value="256k">
                              256 kbps - Very high quality
                            </option>
                            <option value="320k">
                              320 kbps - Maximum quality
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sample Rate
                            <span className="text-xs text-gray-500 ml-1">
                              (Audio Frequency)
                            </span>
                          </label>
                          <select
                            value={audioSampleRate}
                            onChange={(e) => setAudioSampleRate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="recommended">✨ Recommended</option>
                            <option value="22050">
                              22.05 kHz - Lower quality
                            </option>
                            <option value="44100">44.1 kHz - CD quality</option>
                            <option value="48000">48 kHz - Professional</option>
                            <option value="96000">
                              96 kHz - High-end audio
                            </option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Channels
                          <span className="text-xs text-gray-500 ml-1">
                            (Audio Output)
                          </span>
                        </label>
                        <select
                          value={audioChannels}
                          onChange={(e) => setAudioChannels(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="recommended">✨ Recommended</option>
                          <option value="1">Mono - Single channel</option>
                          <option value="2">Stereo - Two channels</option>
                        </select>
                      </div>

                      {/* Show current recommended values */}
                      {(audioBitrate === "recommended" ||
                        audioSampleRate === "recommended" ||
                        audioChannels === "recommended") && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          <strong>Current recommended settings:</strong>{" "}
                          {audioBitrate === "recommended" &&
                            `${
                              currentRecommendation?.bitrate || "128k"
                            } bitrate`}
                          {audioSampleRate === "recommended" &&
                            `, ${
                              currentRecommendation?.sampleRate || "44100"
                            }Hz`}
                          {audioChannels === "recommended" &&
                            `, ${
                              currentRecommendation?.channels === "2"
                                ? "Stereo"
                                : "Mono"
                            }`}
                        </div>
                      )}
                    </div>
                  )}

                {/* Audio Enhancement Settings */}
                {conversionType === "enhance-audio" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enhancement Type
                      </label>
                      <select
                        value={audioEnhancement}
                        onChange={(e) => setAudioEnhancement(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="none">None - No enhancement</option>
                        <option value="noise-reduction">
                          Noise Reduction - Remove background noise
                        </option>
                        <option value="bass-boost">
                          Bass Boost - Enhance low frequencies
                        </option>
                        <option value="treble-boost">
                          Treble Boost - Enhance high frequencies
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volume Adjustment: {audioVolume} dB
                        <span className="text-xs text-gray-500 ml-1">
                          (0 = no change)
                        </span>
                      </label>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        value={audioVolume}
                        onChange={(e) => setAudioVolume(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Quieter (-20dB)</span>
                        <span>Normal (0dB)</span>
                        <span>Louder (+20dB)</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="normalize"
                        checked={audioNormalize}
                        onChange={(e) => setAudioNormalize(e.target.checked)}
                        className="mr-2"
                      />
                      <label
                        htmlFor="normalize"
                        className="text-sm font-medium text-gray-700"
                      >
                        Normalize Audio
                        <span className="text-xs text-gray-500 ml-1">
                          (Automatic level adjustment)
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Audio Trim Settings */}
                {conversionType === "trim-audio" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Time
                        <span className="text-xs text-gray-500 ml-1">
                          (e.g., 00:30 or 30)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={trimStartTime}
                        onChange={(e) => setTrimStartTime(e.target.value)}
                        placeholder="00:30"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                        <span className="text-xs text-gray-500 ml-1">
                          (e.g., 01:00 or 60)
                        </span>
                      </label>
                      <input
                        type="text"
                        value={trimDuration}
                        onChange={(e) => setTrimDuration(e.target.value)}
                        placeholder="01:00"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Tip:</strong> Leave start time empty to trim from
                      the beginning. Leave duration empty to trim to the end.
                    </div>
                  </div>
                )}

                {currentOption && (
                  <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl mb-1">
                        {currentCategory?.icon}
                      </div>
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
                  disabled={
                    (!file && files.length === 0) ||
                    loading ||
                    availableOptions.length === 0
                  }
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Convert File{files.length > 1 ? "s" : ""}
                    </>
                  )}
                </button>

                {loading && (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full animate-pulse"
                        style={{ width: "33%" }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      {conversionCategory === "video"
                        ? "Processing video... This may take a few minutes"
                        : conversionCategory === "audio"
                        ? "Processing audio..."
                        : "Processing your file..."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Download Section */}
            {(downloadUrl || error || conversionComplete) && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
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
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-green-800">
                          Conversion completed successfully!
                        </span>
                      </div>

                      <a
                        href={downloadUrl}
                        download={`converted.${conversionType
                          .split("-")
                          .pop()}`}
                        className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
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
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📄</span>
            </div>
            <h3 className="font-semibold mb-2">Enhanced Documents</h3>
            <p className="text-sm text-gray-600">
              PDF, Word, PowerPoint, Excel, Text, HTML conversions
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎥</span>
            </div>
            <h3 className="font-semibold mb-2">Videos</h3>
            <p className="text-sm text-gray-600">
              Convert, compress, extract audio
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎵</span>
            </div>
            <h3 className="font-semibold mb-2">Audio</h3>
            <p className="text-sm text-gray-600">
              Convert, enhance, trim, merge
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="font-semibold mb-2">Smart Detection</h3>
            <p className="text-sm text-gray-600">
              Auto-detects file type and shows relevant options
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
