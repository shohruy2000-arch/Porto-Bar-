'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Play, ArrowRight, Sparkles, Utensils, Calendar, ShoppingCart, ExternalLink } from 'lucide-react';
import { Story } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface StoriesModalProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onAction?: (story: Story) => void;
}

export const StoriesModal: React.FC<StoriesModalProps> = ({
  stories,
  initialIndex,
  isOpen,
  onClose,
  onAction
}) => {
  const { t, translate } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);

  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);
  const IMAGE_DURATION_MS = 5000;

  // Sync activeIndex with initialIndex when opening
  useEffect(() => {
    if (isOpen) {
      const validIndex = Math.min(Math.max(0, initialIndex), stories.length - 1);
      setActiveIndex(validIndex);
      setIsPlaying(true);
      setProgressPercent(0);
      elapsedBeforePauseRef.current = 0;
    } else {
      if (imageTimerRef.current) clearInterval(imageTimerRef.current);
    }
  }, [isOpen, initialIndex, stories.length]);

  // Lock body scroll when stories modal is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen) {
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const goToNextStory = () => {
    if (activeIndex < stories.length - 1) {
      setActiveIndex(prev => prev + 1);
      setProgressPercent(0);
      elapsedBeforePauseRef.current = 0;
      setIsPlaying(true);
    } else {
      onClose();
    }
  };

  const goToPrevStory = () => {
    if (activeIndex > 0) {
      setActiveIndex(prev => prev - 1);
      setProgressPercent(0);
      elapsedBeforePauseRef.current = 0;
      setIsPlaying(true);
    } else {
      setProgressPercent(0);
      elapsedBeforePauseRef.current = 0;
    }
  };

  // Handle active media playback / timer
  useEffect(() => {
    if (!isOpen || stories.length === 0) return;
    const currentStory = stories[activeIndex];
    if (!currentStory) return;

    if (imageTimerRef.current) {
      clearInterval(imageTimerRef.current);
      imageTimerRef.current = null;
    }

    const isVideo = Boolean(currentStory.videoUrl && currentStory.videoUrl.trim() !== '');

    if (isVideo) {
      // Pause all other videos and play active
      videoRefs.current.forEach((video, idx) => {
        if (!video) return;
        if (idx === activeIndex) {
          video.currentTime = 0;
          setIsPlaying(true);
          setProgressPercent(0);
          
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.log('[Stories] Unmuted autoplay blocked, falling back to muted:', err);
              video.muted = true;
              setIsMuted(true);
              video.play().catch((e) => console.error('[Stories] Video play failed:', e));
            });
          }
        } else {
          video.pause();
        }
      });
    } else {
      // Image Story: Use timer
      setProgressPercent(0);
      startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;

      imageTimerRef.current = setInterval(() => {
        if (!isPlaying) return;
        const elapsed = Date.now() - startTimeRef.current;
        const percent = Math.min(100, (elapsed / IMAGE_DURATION_MS) * 100);
        setProgressPercent(percent);

        if (elapsed >= IMAGE_DURATION_MS) {
          if (imageTimerRef.current) clearInterval(imageTimerRef.current);
          goToNextStory();
        }
      }, 50);
    }

    return () => {
      if (imageTimerRef.current) clearInterval(imageTimerRef.current);
    };
  }, [activeIndex, isOpen, stories, isPlaying]);

  if (!isOpen || stories.length === 0) return null;

  const currentStory = stories[activeIndex];
  if (!currentStory) return null;

  const isVideo = Boolean(currentStory.videoUrl && currentStory.videoUrl.trim() !== '');
  const mediaUrl = isVideo ? currentStory.videoUrl : (currentStory.imageUrl || currentStory.previewUrl || '');

  // Handle Video Time Updates
  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    if (video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgressPercent(percent || 0);
    }
  };

  const handleVideoEnded = () => {
    goToNextStory();
  };

  // Screen Tap Navigation (Left side = Prev, Right side = Next)
  const handleScreenTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width * 0.3) {
      goToPrevStory();
    } else {
      goToNextStory();
    }
  };

  // Pause / Resume on Hold
  const handlePointerDown = () => {
    setIsPlaying(false);
    const video = videoRefs.current[activeIndex];
    if (video) video.pause();
    if (!isVideo) {
      elapsedBeforePauseRef.current = Date.now() - startTimeRef.current;
    }
  };

  const handlePointerUp = () => {
    setIsPlaying(true);
    const video = videoRefs.current[activeIndex];
    if (video && isVideo) {
      video.play().catch(e => console.error(e));
    }
    if (!isVideo) {
      startTimeRef.current = Date.now() - elapsedBeforePauseRef.current;
    }
  };

  // Action Button Icon & Text Helper
  const getActionIcon = (actionType?: string) => {
    switch (actionType) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-porto-bg shrink-0 animate-pulse" />;
      case 'cart':
        return <ShoppingCart className="w-4 h-4 text-porto-bg shrink-0" />;
      case 'url':
        return <ExternalLink className="w-4 h-4 text-porto-bg shrink-0" />;
      case 'category':
      default:
        return <Utensils className="w-4 h-4 text-porto-bg shrink-0" />;
    }
  };

  const hasAction = currentStory.actionType && currentStory.actionType !== 'none';
  const ctaText = currentStory.actionButtonText 
    ? translate(currentStory.actionButtonText) 
    : (currentStory.actionType === 'booking' 
        ? t('stories.bookTable') 
        : currentStory.actionType === 'cart' 
        ? t('stories.openCart') 
        : t('stories.viewMenu'));

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none overflow-hidden touch-none"
        onMouseDown={handlePointerDown}
        onMouseUp={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchEnd={handlePointerUp}
      >
        {/* Story Card Frame (Centered Mobile Container with China News style rounded borders) */}
        <div 
          onClick={handleScreenTap}
          className="relative w-full max-w-md h-full md:max-h-[92vh] md:rounded-3xl overflow-hidden bg-neutral-950 shadow-2xl flex items-center justify-center border-0 md:border-2 md:border-white/20"
        >
          {/* Media Content: Video or Image */}
          {isVideo ? (
            <video
              ref={(el) => {
                videoRefs.current[activeIndex] = el;
              }}
              src={mediaUrl}
              playsInline
              muted={isMuted}
              onTimeUpdate={handleVideoTimeUpdate}
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={translate(currentStory.title)}
              className="w-full h-full object-cover"
            />
          )}

          {/* Luxury Dark Gradient Overlays for readable text & controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none z-10" />

          {/* Top Control Bar (Progress bars + Info + Mute + Close) */}
          <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-5 space-y-3 pointer-events-none">
            {/* Progress Bars */}
            <div className="flex gap-1.5 px-0.5">
              {stories.map((_, idx) => {
                let widthVal = '0%';
                if (idx < activeIndex) {
                  widthVal = '100%';
                } else if (idx === activeIndex) {
                  widthVal = `${progressPercent}%`;
                }
                return (
                  <div key={idx} className="h-1 flex-1 rounded-full bg-white/25 overflow-hidden backdrop-blur-sm">
                    <div
                      style={{ width: widthVal }}
                      className="h-full bg-gradient-to-r from-porto-gold via-porto-gold-bright to-amber-300 transition-all duration-75 ease-linear rounded-full"
                    />
                  </div>
                );
              })}
            </div>

            {/* Header with Title & Action buttons */}
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center space-x-2">
                {currentStory.badge && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-porto-bg bg-gradient-to-r from-porto-gold via-porto-gold-bright to-amber-300 px-2.5 py-0.5 rounded-full shadow-md">
                    {translate(currentStory.badge)}
                  </span>
                )}
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
                  {activeIndex + 1} / {stories.length}
                </span>
              </div>

              <div className="flex items-center space-x-2 pointer-events-auto">
                {isVideo && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMuted(!isMuted);
                    }}
                    className="text-white/90 hover:text-white bg-black/50 hover:bg-black/70 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer border border-white/10"
                    title={isMuted ? t('stories.unmute') : t('stories.mute')}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="text-white/90 hover:text-white bg-black/50 hover:bg-black/70 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer border border-white/10"
                  title={t('ui.close')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Story Text Info & Floating Action CTA Button */}
          <div className="absolute bottom-6 left-5 right-5 z-30 flex flex-col space-y-4 text-left pointer-events-none">
            {/* Story Title & Subtitle */}
            <div className="space-y-1.5">
              <h3 className="text-xl md:text-2xl font-bold font-serif text-white leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {translate(currentStory.title)}
              </h3>
              {currentStory.subtitle && (
                <p className="text-xs text-gray-200 font-medium leading-relaxed drop-shadow-[0_1px_5px_rgba(0,0,0,0.8)]">
                  {translate(currentStory.subtitle)}
                </p>
              )}
            </div>

            {/* Floating Action Button (CTA) */}
            {hasAction && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  if (onAction) onAction(currentStory);
                }}
                className="w-full bg-gradient-to-r from-porto-gold-dark via-porto-gold to-porto-gold-bright text-porto-bg font-black py-3.5 px-5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-between shadow-[0_6px_25px_rgba(212,175,55,0.45)] border border-amber-200/50 cursor-pointer pointer-events-auto transition-all"
              >
                <div className="flex items-center space-x-2 truncate">
                  {getActionIcon(currentStory.actionType)}
                  <span className="truncate">{ctaText}</span>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 text-porto-bg ml-2 stroke-[2.5px]" />
              </motion.button>
            )}
          </div>

          {/* Pause Indicator overlay */}
          {!isPlaying && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/40 text-white flex items-center justify-center backdrop-blur-md border border-white/20">
                <Play className="w-6 h-6 fill-current text-white translate-x-[2px]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
