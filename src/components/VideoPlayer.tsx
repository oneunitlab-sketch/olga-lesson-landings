import { useEffect, useRef, useState } from 'react';

export type VideoConfig = {
  src: string;
  poster?: string;
  /** коротке беззвучне превʼю по колу; після кліку вмикається src зі звуком */
  previewSrc?: string;
  width: number;
  height: number;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  /** клік по відео або ▶ — повне відео з початку, зі звуком і панеллю плеєра */
  playWithSoundOnClick?: boolean;
  showPlayBadge?: boolean;
  /** 'corner' — кружок у лівому нижньому куті (як в оригіналі), 'center' — по центру */
  playBadgePosition?: 'corner' | 'center';
  /** пульсація кнопки ▶, щоб було зрозуміло, що відео можна запустити */
  pulse?: boolean;
  /** підпис під кнопкою ▶ (тільки для 'center') */
  playLabel?: string;
  label?: string;
};

/**
 * Відео в «плівці»: нахил у перспективі, контур, затемнення донизу,
 * кнопка ▶. Усі параметри — з content.ts.
 */
export function VideoPlayer({ video, path }: { video: VideoConfig; path?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [withSound, setWithSound] = useState(false);
  const showControls = video.controls || withSound;
  const clickable = video.playWithSoundOnClick && !withSound;
  const currentSrc = withSound ? video.src : (video.previewSrc ?? video.src);
  const center = video.playBadgePosition === 'center';

  // Користувачам з «reduce motion» не крутимо беззвучне превʼю — лишається постер.
  useEffect(() => {
    const v = ref.current;
    if (!v || !video.autoplay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.pause();
  }, [video.autoplay]);

  // після кліку: повне відео з початку, зі звуком
  useEffect(() => {
    const v = ref.current;
    if (!v || !withSound) return;
    v.muted = false;
    v.loop = false;
    v.currentTime = 0;
    void v.play();
  }, [withSound]);

  const start = () => {
    if (!clickable) return;
    if (document.documentElement.classList.contains('editing')) return; // у режимі редагування клік = заміна файлу
    setWithSound(true);
  };

  return (
    <div className="hero-shot">
      <div
        className={`tape${showControls ? ' has-controls' : ''}${clickable ? ' clickable' : ''}`}
        onClick={start}
        {...(path ? { 'data-edit-video': path } : {})}
      >
        <video
          key={currentSrc}
          ref={ref}
          src={currentSrc}
          poster={withSound ? undefined : video.poster || undefined}
          width={video.width}
          height={video.height}
          autoPlay={withSound || video.autoplay}
          muted={withSound ? false : video.muted}
          loop={withSound ? false : video.loop}
          controls={showControls}
          playsInline
          preload="metadata"
          aria-label={video.label}
        />
        {video.showPlayBadge && !showControls && (
          clickable ? (
            center ? (
              <button type="button" className={`play-cta${video.pulse ? ' pulse' : ''}`} aria-label={video.playLabel || 'Смотреть видео со звуком'}>
                <span className="play" aria-hidden="true" />
                {video.playLabel && <span className="play-label">{video.playLabel}</span>}
              </button>
            ) : (
              <button type="button" className={`play${video.pulse ? ' pulse' : ''}`} aria-label="Смотреть видео со звуком" />
            )
          ) : (
            <span className="play" aria-hidden="true" />
          )
        )}
      </div>
    </div>
  );
}
