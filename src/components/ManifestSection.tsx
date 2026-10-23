import type { Content } from '../content/landing';
import { Rich, ed } from './ui';

/** Схематичний графік: сіра лінія падає з «шумом», золота — стабільно росте. */
const MARKET = 'M0 58 L55 80 L105 68 L165 102 L225 94 L285 136 L345 128 L405 166 L465 158 L525 190 L600 184';
const OURS = 'M0 192 L115 158 L235 144 L355 122 L475 86 L600 30';

export function ManifestSection({ data }: { data: Content['manifest'] }) {
  return (
    <section className="sec manifest">
      <div className="wrap">
        <figure className="mchart" aria-label={data.chart.label}>
          <svg viewBox="0 0 600 220" preserveAspectRatio="none">
            <path className="mk" d={MARKET} />
            <path className="us" d={OURS} />
            <circle className="dot" cx="600" cy="30" r="5" />
          </svg>
          <figcaption>
            <span {...ed('manifest.chart.left')}>{data.chart.left}</span>
            <span {...ed('manifest.chart.right')}>{data.chart.right}</span>
          </figcaption>
        </figure>
        <p className="m1" {...ed('manifest.line1', true)}><Rich text={data.line1} /></p>
        <p className="m2" {...ed('manifest.text', true)}><Rich text={data.text} /></p>
        <p className="m1" {...ed('manifest.line2', true)}><Rich text={data.line2} /></p>
      </div>
    </section>
  );
}
