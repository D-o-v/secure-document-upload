interface LoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };

export default function Loader({ text, size = "md" }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status">
      <div
        className={`${SIZES[size]} border-2 border-muted border-t-primary rounded-full animate-spin-slow`}
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
      <span className="sr-only">Loading</span>
    </div>
  );
}
