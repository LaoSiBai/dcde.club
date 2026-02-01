import Sphere from '@/components/Sphere';

export default function Home() {
  return (
    <main>
      {/* Global Header is handled in layout or here */}
      {/* Since the original logic injected header via JS, we should migrate that too. 
           For now, let's just make sure the Sphere works. 
           The Header logic (header.js) needs to be a React component.*/}
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
