import type { Content } from '../content/landing';
import { Button } from './ui';

export function FinalSection({ data }: { data: Content['final'] }) {
  return (
    <section className="sec final" id={data.id}>
      <div className="blob a blob-bottom" />
      <div className="wrap">
        <div className="cta-row"><Button cta={data.cta} path="final.cta" id="cta-main" /></div>
      </div>
    </section>
  );
}
