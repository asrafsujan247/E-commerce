import { useState, useEffect } from "react";
import { cn } from "@lib/utils";

const fallbackImage = "/placeholder.png";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  img?: boolean;
  fallback?: string;
  alt?: string;
}

const ImageWithFallback = ({
  src,
  img,
  fallback = fallbackImage,
  alt = "image",
  ...props
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    setImgSrc(src || fallback);
  }, [src, fallback]);

  // Both branches now use a plain <img> tag (Next.js Image is removed)
  return (
    <img
      src={imgSrc}
      onError={() => setImgSrc(fallback)}
      alt={alt}
      {...props}
      className={cn(
        "w-full h-full object-cover transition duration-150 ease-linear transform group-hover:scale-105",
        props.className,
      )}
    />
  );
};

export default ImageWithFallback;
