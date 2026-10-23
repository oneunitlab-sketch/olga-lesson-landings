import { ed } from './ui';

export function Footer({ text }: { text: string }) {
  return (
    <footer className="site-footer">
      <div className="wrap" {...ed('footer')}>{text}</div>
    </footer>
  );
}
