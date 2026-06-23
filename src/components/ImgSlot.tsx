import { cn } from "@/lib/utils";
import { imgFor } from "@/lib/img-map";

type Props = {
  refId: string; // e.g. "#1 — Hero del lavadero"
  alt: string;
  className?: string;
  ratio?: "video" | "square" | "tall" | "wide";
};

const ratios: Record<NonNullable<Props["ratio"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  tall: "aspect-[3/4]",
  wide: "aspect-[21/9]",
};

export function ImgSlot({ refId, alt, className, ratio = "video" }: Props) {
  const src = imgFor(refId);

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        data-img-ref={refId}
        className={cn("h-full w-full object-cover", ratios[ratio], className)}
      />
    );
  }

  return (
    <div
      data-img-ref={refId}
      role="img"
      aria-label={alt}
      className={cn(
        "flex items-center justify-center rounded-lg border border-dashed border-muted-foreground/40 bg-muted text-center text-xs text-muted-foreground p-3",
        ratios[ratio],
        className,
      )}
    >
      <span className="max-w-full break-words">{refId}</span>
    </div>
  );
}
