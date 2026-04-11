import React from 'react';
import Link from 'next/link';

export default function DreamiragePreviewPage() {
  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <main className="projects-section">
        <article className="project-row grid-12">
          <div className="project-meta col-12">
            <div>
              <p className="text-sm" style={{ marginBottom: '10px' }}>
                项目名称：Dreamirage 官网重构
              </p>
              <p className="text-sm" style={{ marginBottom: '40px' }}>
                项目编号：#dcde202604
              </p>
              
              <p className="text-sm" style={{ marginBottom: '60px' }}>
                一切就绪后，您将可以在此预览网站的开发进度。
              </p>
            </div>

            <div>
              <Link href="/" className="read-more text-sm" style={{ display: 'inline-block' }}>
                返回首页
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
