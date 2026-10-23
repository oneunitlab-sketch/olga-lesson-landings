import { content, variant } from './content';
import { Hero } from './components/Hero';
import { WhoSection } from './components/WhoSection';
import { QuestionsSection } from './components/QuestionsSection';
import { InsideSection } from './components/InsideSection';
import { DocsSection } from './components/DocsSection';
import { AuthorSection } from './components/AuthorSection';
import { FaqSection } from './components/FaqSection';
import { ManifestSection } from './components/ManifestSection';
import { FinalSection } from './components/FinalSection';
import { Footer } from './components/Footer';
import { StickyCta } from './components/StickyCta';
import { EditMode } from './components/EditMode';
import { LeadModal } from './components/LeadModal';

// тема з content.theme: 'noir' — темна, як у референсі (стилі — у sections.css, блок «ТЕМА NOIR»)
document.documentElement.classList.toggle('theme-noir', content.theme === 'noir');

export default function App() {
  return (
    <>
      <a className="skip" href={content.skipLink.target}>{content.skipLink.text}</a>
      <Hero data={content.hero} />
      <div className="divider" aria-hidden="true"><span /></div>
      <WhoSection data={content.who} />
      <QuestionsSection data={content.questions} />
      <InsideSection data={content.inside} />
      <DocsSection data={content.docs} />
      <AuthorSection data={content.author} />
      <FaqSection data={content.faq} />
      <ManifestSection data={content.manifest} />
      <FinalSection data={content.final} />
      <Footer text={content.footer} />
      {content.sticky.enabled && (
        <StickyCta cta={content.hero.cta} showAfter={content.sticky.showAfter} targetId={content.final.id} />
      )}
      {variant !== 'v1' && <LeadModal lead={content.lead} />}
      {import.meta.env.DEV && <EditMode />}
    </>
  );
}
