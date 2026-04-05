import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import instructionIdFlatSurface from "@/assets/instruction-id-flat-surface.png";
import instructionIdNoCover from "@/assets/instruction-id-no-cover.png";
import instructionIdNoReflection from "@/assets/instruction-id-no-reflection.png";
import instructionPassportFlat from "@/assets/instruction-passport-flat.png";

interface Slide {
  image: string;
  text: string;
}

const ID_SLIDES: Slide[] = [
  {
    image: instructionIdFlatSurface,
    text: "Place your ID Document on a flat surface and make sure that the data is visible.",
  },
  {
    image: instructionIdNoCover,
    text: "Make sure you do not cover your ID Document data (finger, paperclip etc).",
  },
  {
    image: instructionIdNoReflection,
    text: "The ID Document needs to be clear with no reflection, make sure all the data is readable.",
  },
];

const PASSPORT_SLIDES: Slide[] = [
  {
    image: instructionIdFlatSurface,
    text: "Place your passport on a flat surface and make sure that the data is visible.",
  },
  {
    image: instructionIdNoCover,
    text: "Make sure you do not cover your passport data (finger, paperclip etc).",
  },
  {
    image: instructionIdNoReflection,
    text: "The passport needs to be clear with no reflection, make sure all the data is readable.",
  },
];

interface UploadInstructionsModalProps {
  open: boolean;
  onClose: () => void;
  onContinue: () => void;
  documentType?: "id" | "passport";
}

export default function UploadInstructionsModal({
  open,
  onClose,
  onContinue,
  documentType = "id",
}: UploadInstructionsModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = documentType === "passport" ? PASSPORT_SLIDES : ID_SLIDES;

  useEffect(() => {
    if (open) setCurrentSlide(0);
  }, [open]);

  const goNext = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      onContinue();
    }
  }, [currentSlide, slides.length, onContinue]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) setCurrentSlide((s) => s - 1);
  }, [currentSlide]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, goNext, goPrev, onClose]);

  if (!open) return null;

  const title =
    documentType === "passport"
      ? "Upload proof of passport"
      : "Upload proof of ID Document";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="relative bg-background rounded-2xl w-full max-w-[380px] mx-4 overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="px-6 pt-8 pb-1">
          <h3 className="text-xl font-bold text-primary">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Follow the instructions below to make sure your photo meets our requirements
          </p>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2.5 py-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-3 h-3 bg-primary"
                  : "w-2.5 h-2.5 bg-muted-foreground/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide content with navigation arrows */}
        <div className="relative px-4 pb-2">
          <div className="flex items-center gap-2">
            {/* Left arrow */}
            <button
              onClick={goPrev}
              disabled={currentSlide === 0}
              className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                currentSlide === 0
                  ? "opacity-0 pointer-events-none"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image container */}
            <div className="flex-1 flex items-center justify-center bg-muted/50 rounded-xl min-h-[220px] py-6">
              <div className="relative w-[200px] h-[200px] flex items-center justify-center">
                {slides.map((slide, i) => (
                  <img
                    key={i}
                    src={slide.image}
                    alt={slide.text}
                    loading="lazy"
                    width={200}
                    height={200}
                    className={`max-w-[200px] max-h-[200px] object-contain transition-all duration-400 ease-out ${
                      i === currentSlide
                        ? "opacity-100 scale-100 relative"
                        : "opacity-0 scale-95 absolute inset-0 m-auto"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={goNext}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              aria-label={currentSlide === slides.length - 1 ? "Continue to upload" : "Next slide"}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Instruction text */}
        <div className="px-6 pt-4 pb-8 min-h-[90px]">
          <p className="text-base font-bold text-primary leading-relaxed transition-opacity duration-300">
            {slides[currentSlide].text}
          </p>
        </div>
      </div>
    </div>
  );
}
