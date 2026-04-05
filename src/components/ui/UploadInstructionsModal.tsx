import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import instructionFlatSurface from "@/assets/instruction-flat-surface.png";
import instructionNoCover from "@/assets/instruction-no-cover.png";
import instructionNoReflection from "@/assets/instruction-no-reflection.png";
import instructionPassport from "@/assets/instruction-passport.png";

interface Slide {
  image: string;
  text: string;
}

const ID_SLIDES: Slide[] = [
  {
    image: instructionFlatSurface,
    text: "Place your ID Document on a flat surface and make sure that the data is visible.",
  },
  {
    image: instructionNoCover,
    text: "Make sure you do not cover your ID Document data (finger, paperclip etc).",
  },
  {
    image: instructionNoReflection,
    text: "The ID Document needs to be clear with no reflection, make sure all the data is readable.",
  },
];

const PASSPORT_SLIDES: Slide[] = [
  {
    image: instructionPassport,
    text: "Place your passport on a flat surface and make sure that the data is visible.",
  },
  {
    image: instructionNoCover,
    text: "Make sure you do not cover your passport data (finger, paperclip etc).",
  },
  {
    image: instructionNoReflection,
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

  // Keyboard navigation
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div
        className="relative bg-card rounded-xl shadow-xl w-full max-w-sm mx-4 overflow-hidden animate-[scale-in_0.2s_ease-out]"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Follow the instructions below to make sure your photo meets our requirements
          </p>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 py-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "bg-secondary w-2.5 h-2.5"
                  : "bg-border"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide content with navigation arrows */}
        <div className="relative px-6 pb-2">
          <div className="flex items-center">
            {/* Left arrow */}
            <button
              onClick={goPrev}
              disabled={currentSlide === 0}
              className={`flex-shrink-0 p-1.5 rounded-full transition-all ${
                currentSlide === 0
                  ? "opacity-0 pointer-events-none"
                  : "text-primary hover:bg-primary/10"
              }`}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center min-h-[180px]">
              <div className="relative overflow-hidden">
                {slides.map((slide, i) => (
                  <img
                    key={i}
                    src={slide.image}
                    alt={slide.text}
                    loading="lazy"
                    width={180}
                    height={180}
                    className={`transition-all duration-400 ease-out ${
                      i === currentSlide
                        ? "opacity-100 scale-100 relative"
                        : "opacity-0 scale-95 absolute inset-0"
                    }`}
                    style={{
                      transform: i === currentSlide
                        ? "translateX(0)"
                        : i < currentSlide
                        ? "translateX(-30px)"
                        : "translateX(30px)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={goNext}
              className="flex-shrink-0 p-1.5 rounded-full text-primary hover:bg-primary/10 transition-all"
              aria-label={currentSlide === slides.length - 1 ? "Continue to upload" : "Next slide"}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Instruction text */}
        <div className="px-6 pb-6 min-h-[80px] flex items-start">
          <p className="text-sm font-medium text-foreground leading-relaxed transition-opacity duration-300">
            {slides[currentSlide].text}
          </p>
        </div>

        {/* Continue button on last slide */}
        {currentSlide === slides.length - 1 && (
          <div className="px-6 pb-6 animate-fade-in">
            <button onClick={onContinue} className="fb-btn-primary w-full">
              Continue to upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
