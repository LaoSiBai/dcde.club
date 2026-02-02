import Sphere from '@/components/Sphere';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main>
      <Header position="absolute" />
      <Sphere />

      <div className="ui-element bottom-left" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <a href="/info" className="jump-link">Information →</a>
        <a href="#" className="jump-link">Collaboration →</a>
      </div>

      <div className="ui-element bottom-right">
        <p className="copyright">© 2026 DCDE. All Rights Reserved.</p>
      </div>
    </main>
  );
}
