import React from 'react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container">
      <header className="header-section grid-12">
        <div className="logo-col">
          {/* Logo Placeholder */}
          <div className="logo-placeholder">
            <Image src="/logo.svg" alt="DCDE Logo" width={335} height={340} style={{ width: '100%', height: 'auto', display: 'block' }} priority />
          </div>
        </div>
        <div className="header-info-col">
          <div className="header-text">
            <h1 className="mission-cn text-lg">
              我们欣赏每一个独立灵魂，并为独立团队提供设计支持。<br />
              通过 DCDE 的视角，重塑原创的视觉资产。
            </h1>
            <p className="mission-en text-sm">
              We celebrate every unique spirit and provide dedicated design support for independent teams.<br />
              Through the lens of DCDE, we reshape original visual assets.
            </p>
          </div>
        </div>

        {/* Navigation direct children of the grid */}
        <a href="#" className="nav-item nav-works active text-sm">&gt; Works</a>
        <a href="#" className="nav-item nav-info text-sm">Info</a>
        <a href="#" className="nav-item nav-contact text-sm">Contact</a>
      </header>

      <hr className="divider" />

      <main className="projects-section">
        {/* Project 1 */}
        <article className="project-row grid-12">
          <div className="project-meta col-3">
            <h2 className="project-title text-lg">
              Bili-Baord _Atel<br />
              OpenUI
            </h2>
            <div className="project-desc-wrapper">
              <p className="project-desc-cn text-sm">
                由 Bili-Board_Atel 发起：从琐碎排版中解放热忱，以开源重构定义周榜美学。
              </p>
              <p className="project-desc-en text-sm">
                By Bili-Board_Atel: Liberating passion from layout through open-source reimagining.
              </p>
            </div>
            <div>
              <a href="#" className="read-more text-sm">了解更多</a>
            </div>
          </div>
          <div className="project-visual col-9" style={{ position: 'relative' }}>
            <Image
              src="/projects/openui-cover.png"
              alt="Bili-Board_Atel OpenUI Cover"
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 75vw"
            />
          </div>
        </article>

        {/* Project 2 */}
        <article className="project-row grid-12">
          <div className="project-meta col-3">
            <h2 className="project-title text-lg">Potato & Tomato</h2>
            <div className="project-desc-wrapper">
              <p className="project-desc-cn text-sm">
                为充满生命力的 Minecraft 独立服务器打造极具辨识度的视觉符号。从像素逻辑出发，在方块世界中建立专属的品牌秩序。
              </p>
              <p className="project-desc-en text-sm">
                Crafting iconic visual identities for vibrant Minecraft independent servers. Building a dedicated brand order within the blocky world, rooted in pixel logic.
              </p>
            </div>
            <div>
              <a href="#" className="read-more text-sm">了解更多</a>
            </div>
          </div>
          <div className="project-visual col-9 bg-grey-placeholder"></div>
        </article>

        {/* Project 3 */}
        <article className="project-row grid-12">
          <div className="project-meta col-3">
            <h2 className="project-title text-lg">标题</h2>
            <div className="project-desc-wrapper">
              <p className="project-desc-cn text-sm">简介</p>
              <p className="project-desc-en text-sm">Description</p>
            </div>
            <div>
              <a href="#" className="read-more text-sm">了解更多</a>
            </div>
          </div>
          <div className="project-visual col-9 bg-grey-placeholder"></div>
        </article>
      </main>
    </div>
  );
}
