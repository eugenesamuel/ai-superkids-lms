"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

export function VideoPlayer({
  src,
  watermark,
  poster,
  onProgress,
  onComplete,
}: {
  src: string | null;
  watermark: string;
  poster?: string;
  onProgress?: (percent: number) => void;
  onComplete?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [completed, setCompleted] = useState(false);
  const [hasSrc, setHasSrc] = useState(false);

  useEffect(() => {
    setHasSrc(Boolean(src));
  }, [src]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const handler = () => {
      if (v.duration > 0) {
        const percent = (v.currentTime / v.duration) * 100;
        onProgress?.(percent);
        if (percent >= 80 && !completed) {
          setCompleted(true);
          onComplete?.();
        }
      }
    };
    v.addEventListener("timeupdate", handler);
    return () => v.removeEventListener("timeupdate", handler);
  }, [completed, onComplete, onProgress]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-space-deep">
      {hasSrc ? (
        <video
          ref={videoRef}
          src={src!}
          poster={poster}
          controls
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          playsInline
          className="absolute inset-0 w-full h-full"
          onContextMenu={(e) => e.preventDefault()}
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center text-white text-center p-8">
          <div className="space-y-3">
            <div className="mx-auto w-20 h-20 rounded-full grid place-items-center bg-white/10 border border-white/20">
              <Play className="w-8 h-8 text-white" />
            </div>
            <p className="font-display text-lg">
              Recording isn't ready yet!
            </p>
            <p className="text-sm text-white/60 max-w-xs mx-auto">
              The live class hasn't happened yet. Check back after the session for the recording.
            </p>
          </div>
        </div>
      )}

      {/* Child name watermark — always visible, top-right */}
      <div className="video-watermark">
        ★ {watermark}
      </div>
    </div>
  );
}
