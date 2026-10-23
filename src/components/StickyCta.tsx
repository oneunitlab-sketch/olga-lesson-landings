import { useEffect, useState } from 'react';
import type { Cta } from '../content/landing';
import { Button } from './ui';

/** Липка кнопка знизу екрана (< 900px): зʼявляється після прокрутки, ховається біля фінального блоку. */
export function StickyCta({ cta, showAfter, targetId }: { cta: Cta; showAfter: number; targetId: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const update = () => {
      const beforeTarget = !target || target.getBoundingClientRect().top > window.innerHeight;
      setOn(window.scrollY > showAfter && beforeTarget);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [showAfter, targetId]);

  return (
    <div className={`sticky${on ? ' on' : ''}`} aria-hidden={!on}>
      <Button cta={cta} />
    </div>
  );
}
