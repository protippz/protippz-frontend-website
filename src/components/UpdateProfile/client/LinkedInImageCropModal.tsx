"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Undo2,
  Crop,
  Sparkles,
  Sliders,
  ZoomIn,
} from "lucide-react";

interface LinkedInImageCropModalProps {
  isOpen: boolean;
  file: File | null;
  onClose: () => void;
  onSave: (croppedFile: File, previewUrl: string) => void;
}

type ActiveTab = "crop" | "filter" | "adjust";
type FilterType = "normal" | "bw" | "warm" | "cool" | "contrast" | "vintage";
type AspectRatio = "1:1" | "4:5" | "16:9";

const FILTERS: { id: FilterType; name: string; filterStyle: string }[] = [
  { id: "normal", name: "Original", filterStyle: "none" },
  { id: "bw", name: "B&W", filterStyle: "grayscale(100%) contrast(110%)" },
  { id: "warm", name: "Warm", filterStyle: "sepia(25%) saturate(120%) brightness(105%)" },
  { id: "cool", name: "Cool", filterStyle: "hue-rotate(180deg) saturate(90%) brightness(105%)" },
  { id: "contrast", name: "Punchy", filterStyle: "contrast(125%) saturate(115%)" },
  { id: "vintage", name: "Vintage", filterStyle: "sepia(45%) contrast(105%) brightness(95%)" },
];

const LinkedInImageCropModal: React.FC<LinkedInImageCropModalProps> = ({
  isOpen,
  file,
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("crop");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Viewport container dimensions
  const [containerDim, setContainerDim] = useState<{ width: number; height: number }>({
    width: 400,
    height: 400,
  });

  // Crop / Transform state
  const [zoom, setZoom] = useState<number>(1);
  const [rotationStep, setRotationStep] = useState<number>(0); // 0, 90, 180, 270
  const [fineRotation, setFineRotation] = useState<number>(0); // -45 to +45
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filters & Adjustments state
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("normal");
  const [brightness, setBrightness] = useState<number>(100); // 50 to 150
  const [contrast, setContrast] = useState<number>(100); // 50 to 150

  // Dragging state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // DOM references
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Measure container dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setContainerDim({ width: clientWidth, height: clientHeight });
        }
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isOpen]);

  // Load image from File
  useEffect(() => {
    if (!file) {
      setImageSrc(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);

    // Reset settings
    setZoom(1);
    setRotationStep(0);
    setFineRotation(0);
    setFlipH(false);
    setFlipV(false);
    setPan({ x: 0, y: 0 });
    setSelectedFilter("normal");
    setBrightness(100);
    setContrast(100);
    setActiveTab("crop");
    setAspectRatio("1:1");

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // Handle Drag / Pan with mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle Touch Pan on Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
      panStartRef.current = { ...pan };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => Math.min(3, Math.max(1, +(prev + zoomDelta).toFixed(2))));
  };

  // Quick rotations & flips
  const handleRotateLeft = () => {
    setRotationStep((prev) => (prev - 90 + 360) % 360);
  };

  const handleRotateRight = () => {
    setRotationStep((prev) => (prev + 90) % 360);
  };

  const handleFlipH = () => setFlipH((prev) => !prev);
  const handleFlipV = () => setFlipV((prev) => !prev);

  const handleReset = () => {
    setZoom(1);
    setRotationStep(0);
    setFineRotation(0);
    setFlipH(false);
    setFlipV(false);
    setPan({ x: 0, y: 0 });
    setSelectedFilter("normal");
    setBrightness(100);
    setContrast(100);
    setAspectRatio("1:1");
  };

  // Compute composite filter CSS string
  const getComputedFilterStyle = () => {
    const filterItem = FILTERS.find((f) => f.id === selectedFilter);
    const baseFilter = filterItem && filterItem.id !== "normal" ? filterItem.filterStyle : "";
    const adjustFilter = `brightness(${brightness}%) contrast(${contrast}%)`;
    return [baseFilter, adjustFilter].filter(Boolean).join(" ");
  };

  // Total rotation in degrees
  const totalRotation = (rotationStep + fineRotation) % 360;

  // Calculate Rectangular Crop Box based on aspect ratio
  const getCropBoxDimensions = () => {
    const maxW = containerDim.width * 0.82;
    const maxH = containerDim.height * 0.82;

    let width = Math.min(maxW, maxH, 290);
    let height = width;

    if (aspectRatio === "4:5") {
      height = Math.min(maxH, 320);
      width = height * (4 / 5);
    } else if (aspectRatio === "16:9") {
      width = Math.min(maxW, 340);
      height = width * (9 / 16);
    }

    const x = (containerDim.width - width) / 2;
    const y = (containerDim.height - height) / 2;

    return { width, height, x, y };
  };

  const cropBox = getCropBoxDimensions();

  // Handle Save: Crop using HTML5 Canvas
  const handleSave = () => {
    if (!imageRef.current || !containerRef.current || !file) return;

    const img = imageRef.current;
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const { width: cropW, height: cropH } = getCropBoxDimensions();

    // High resolution output canvas
    const OUTPUT_BASE = 600;
    const outputW = OUTPUT_BASE;
    const outputH = Math.round(OUTPUT_BASE * (cropH / cropW));
    const scaleFactor = outputW / cropW;

    const canvas = document.createElement("canvas");
    canvas.width = outputW;
    canvas.height = outputH;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.save();
    ctx.clearRect(0, 0, outputW, outputH);

    // Apply composite image filter if adjusted
    const filterStr = getComputedFilterStyle();
    if (filterStr && filterStr !== "none" && (ctx as any).filter !== undefined) {
      (ctx as any).filter = filterStr;
    }

    // Move to center of output canvas
    ctx.translate(outputW / 2, outputH / 2);

    // Apply rotation
    ctx.rotate((totalRotation * Math.PI) / 180);

    // Apply horizontal & vertical flip
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Base scale of image inside container
    const baseWidth = Math.min(rect.width, rect.height) * 0.85;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let renderW = baseWidth;
    let renderH = baseWidth / imgAspect;

    if (imgAspect < 1) {
      renderH = baseWidth;
      renderW = baseWidth * imgAspect;
    }

    // Apply user pan offset scaled to high-res canvas
    const transformedPanX = pan.x * scaleFactor;
    const transformedPanY = pan.y * scaleFactor;
    ctx.translate(transformedPanX, transformedPanY);

    // Apply zoom
    const finalW = renderW * zoom * scaleFactor;
    const finalH = renderH * zoom * scaleFactor;

    // Draw the image centered
    ctx.drawImage(img, -finalW / 2, -finalH / 2, finalW, finalH);
    ctx.restore();

    // Export high-quality JPEG
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + "-cropped.jpg";
        const croppedFile = new File([blob], newFileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        const previewUrl = URL.createObjectURL(croppedFile);
        onSave(croppedFile, previewUrl);
      },
      "image/jpeg",
      0.95,
    );
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Edit image
            </h2>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Rectangle Fit
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            title="Close editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Viewport (Canvas) & Right Controls Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-[380px] sm:min-h-[440px] overflow-y-auto">
          {/* Left Side: Interactive Rectangular Crop Viewport */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            className="md:col-span-7 bg-[#1c1d1f] relative overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing min-h-[320px] sm:min-h-[420px]"
          >
            {/* The Image inside viewport */}
            <div
              className="absolute transition-transform duration-75 will-change-transform flex items-center justify-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) rotate(${totalRotation}deg) scale(${zoom}) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                transformOrigin: "center center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                draggable={false}
                className="max-w-[280px] sm:max-w-[340px] max-h-[280px] sm:max-h-[340px] object-contain pointer-events-none select-none"
                style={{
                  filter: getComputedFilterStyle(),
                }}
              />
            </div>

            {/* Rectangular Cutout Overlay (Darkened outer mask + crisp white rectangle boundary) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <svg
                className="w-full h-full"
                width={containerDim.width}
                height={containerDim.height}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <mask id="linkedin-avatar-cutout-mask">
                    <rect width="100%" height="100%" fill="white" />
                    {/* The Rectangular Aperture */}
                    <rect
                      x={cropBox.x}
                      y={cropBox.y}
                      width={cropBox.width}
                      height={cropBox.height}
                      rx="14"
                      fill="black"
                    />
                  </mask>
                </defs>

                {/* Dark Mask Outside Rectangle */}
                <rect
                  width="100%"
                  height="100%"
                  fill="rgba(0, 0, 0, 0.65)"
                  mask="url(#linkedin-avatar-cutout-mask)"
                />

                {/* Crisp White Hairline Rectangle Border */}
                <rect
                  x={cropBox.x}
                  y={cropBox.y}
                  width={cropBox.width}
                  height={cropBox.height}
                  rx="14"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="2.5"
                />

                {/* Rule of Thirds Subtle Grid Lines */}
                <line
                  x1={cropBox.x}
                  y1={cropBox.y + cropBox.height / 3}
                  x2={cropBox.x + cropBox.width}
                  y2={cropBox.y + cropBox.height / 3}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1={cropBox.x}
                  y1={cropBox.y + (cropBox.height * 2) / 3}
                  x2={cropBox.x + cropBox.width}
                  y2={cropBox.y + (cropBox.height * 2) / 3}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1={cropBox.x + cropBox.width / 3}
                  y1={cropBox.y}
                  x2={cropBox.x + cropBox.width / 3}
                  y2={cropBox.y + cropBox.height}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <line
                  x1={cropBox.x + (cropBox.width * 2) / 3}
                  y1={cropBox.y}
                  x2={cropBox.x + (cropBox.width * 2) / 3}
                  y2={cropBox.y + cropBox.height}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Corner Accents */}
                {/* Top-Left */}
                <path
                  d={`M ${cropBox.x} ${cropBox.y + 18} L ${cropBox.x} ${cropBox.y} L ${cropBox.x + 18} ${cropBox.y}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                />
                {/* Top-Right */}
                <path
                  d={`M ${cropBox.x + cropBox.width - 18} ${cropBox.y} L ${cropBox.x + cropBox.width} ${cropBox.y} L ${cropBox.x + cropBox.width} ${cropBox.y + 18}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                />
                {/* Bottom-Left */}
                <path
                  d={`M ${cropBox.x} ${cropBox.y + cropBox.height - 18} L ${cropBox.x} ${cropBox.y + cropBox.height} L ${cropBox.x + 18} ${cropBox.y + cropBox.height}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                />
                {/* Bottom-Right */}
                <path
                  d={`M ${cropBox.x + cropBox.width - 18} ${cropBox.y + cropBox.height} L ${cropBox.x + cropBox.width} ${cropBox.y + cropBox.height} L ${cropBox.x + cropBox.width} ${cropBox.y + cropBox.height - 18}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="3.5"
                />
              </svg>
            </div>

            {/* Drag hint badge */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium pointer-events-none">
              Drag image to fit in frame • Scroll to zoom
            </div>
          </div>

          {/* Right Side: Tabbed Tool Controls */}
          <div className="md:col-span-5 bg-white p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200">
            <div>
              {/* Tab Navigation: Crop / Filter / Adjust */}
              <div className="flex items-center gap-6 border-b border-slate-200 pb-2 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("crop")}
                  className={`pb-2 text-sm font-bold tracking-tight transition-all relative cursor-pointer ${
                    activeTab === "crop"
                      ? "text-[#053697]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Crop className="w-4 h-4" />
                    Crop
                  </span>
                  {activeTab === "crop" && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#053697] rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("filter")}
                  className={`pb-2 text-sm font-bold tracking-tight transition-all relative cursor-pointer ${
                    activeTab === "filter"
                      ? "text-[#053697]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Filter
                  </span>
                  {activeTab === "filter" && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#053697] rounded-full" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("adjust")}
                  className={`pb-2 text-sm font-bold tracking-tight transition-all relative cursor-pointer ${
                    activeTab === "adjust"
                      ? "text-[#053697]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" />
                    Adjust
                  </span>
                  {activeTab === "adjust" && (
                    <span className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-[#053697] rounded-full" />
                  )}
                </button>
              </div>

              {/* TAB 1: CROP & ROTATION CONTROLS */}
              {activeTab === "crop" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Aspect Ratio Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Frame Aspect Ratio
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setAspectRatio("1:1")}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer active:scale-95 ${
                          aspectRatio === "1:1"
                            ? "bg-[#053697] border-[#053697] text-white"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        1:1 Square
                      </button>

                      <button
                        type="button"
                        onClick={() => setAspectRatio("4:5")}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer active:scale-95 ${
                          aspectRatio === "4:5"
                            ? "bg-[#053697] border-[#053697] text-white"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        4:5 Portrait
                      </button>

                      <button
                        type="button"
                        onClick={() => setAspectRatio("16:9")}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer active:scale-95 ${
                          aspectRatio === "16:9"
                            ? "bg-[#053697] border-[#053697] text-white"
                            : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                        }`}
                      >
                        16:9 Wide
                      </button>
                    </div>
                  </div>

                  {/* Action Toolbar: Rotate 90, Flip Horizontal, Flip Vertical */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleRotateLeft}
                      className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer active:scale-95"
                      title="Rotate counter-clockwise 90°"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleRotateRight}
                      className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer active:scale-95"
                      title="Rotate clockwise 90°"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleFlipH}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${
                        flipH
                          ? "bg-[#053697] border-[#053697] text-white"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                      title="Flip horizontally"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleFlipV}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer active:scale-95 ${
                        flipV
                          ? "bg-[#053697] border-[#053697] text-white"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      }`}
                      title="Flip vertically"
                    >
                      <FlipVertical className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="ml-auto px-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-600 transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                      title="Reset all transformations"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Reset</span>
                    </button>
                  </div>

                  {/* Zoom Slider */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <ZoomIn className="w-3.5 h-3.5 text-slate-500" />
                        <span>Zoom</span>
                      </label>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {Math.round(zoom * 100)}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#053697]"
                    />
                  </div>

                  {/* Fine Straighten / Rotate Slider */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <RotateCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>Rotate</span>
                      </label>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {fineRotation > 0 ? `+${fineRotation}°` : `${fineRotation}°`}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="-45"
                      max="45"
                      step="1"
                      value={fineRotation}
                      onChange={(e) => setFineRotation(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#053697]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: FILTERS (Including B&W) */}
              {activeTab === "filter" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <p className="text-xs font-medium text-slate-500">
                    Select a filter to enhance your portrait:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {FILTERS.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFilter(f.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer active:scale-95 ${
                          selectedFilter === f.id
                            ? "border-[#053697] bg-blue-50/80 text-[#053697] font-bold"
                            : "border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700 font-medium"
                        }`}
                      >
                        <span className="block text-xs">{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ADJUST (Brightness, Contrast) */}
              {activeTab === "adjust" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Brightness */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Brightness
                      </label>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {brightness}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      step="2"
                      value={brightness}
                      onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#053697]"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700">
                        Contrast
                      </label>
                      <span className="text-xs font-mono font-semibold text-slate-500">
                        {contrast}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      step="2"
                      value={contrast}
                      onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#053697]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom / Actions Bar */}
            <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3 mt-5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer active:scale-95"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-full bg-[#053697] hover:bg-[#042870] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInImageCropModal;
