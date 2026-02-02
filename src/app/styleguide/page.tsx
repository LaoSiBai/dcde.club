import Header from '@/components/Header';
import './style.css';

export default function Styleguide() {
    return (
        <>
            <Header position="relative" />

            <div className="page-content subpage-container layout-grid">

                <header className="sg-header col-span-4">
                    <h1 className="sg-title">Design System</h1>
                    <p style={{ color: 'var(--text-muted)' }}>DCDE 品牌视觉设计规范定义 · v2.1</p>
                </header>

                {/* 1. Typography */}
                <section className="sg-section col-span-4">
                    <h2 className="sg-section-title">Typography / 排版</h2>
                    <div className="type-row">
                        <span className="type-label">XL (Title)</span>
                        <span className="type-preview" style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>
                            Page Title / 页面标题
                        </span>
                    </div>
                    <div className="type-row">
                        <span className="type-label">LG (Sub)</span>
                        <span className="type-preview" style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>
                            Card Title / 卡片标题 / 副标题
                        </span>
                    </div>
                    <div className="type-row">
                        <span className="type-label">Base</span>
                        <span className="type-preview" style={{ fontSize: 'var(--text-base)' }}>
                            Body Text / 正文内容：随着 2025 年业务版图的拓展，我们在秩序中寻找变量。
                        </span>
                    </div>
                    <div className="type-row">
                        <span className="type-label">SM (Meta)</span>
                        <span className="type-preview" style={{ fontSize: 'var(--text-sm)' }}>
                            METADATA / 辅助信息 / 标签
                        </span>
                    </div>
                </section>

                {/* 2. Spacing */}
                <section className="sg-section col-span-4">
                    <h2 className="sg-section-title">Spacing / 间距规范</h2>
                    <div className="type-row">
                        <span className="type-label">Vertical</span>
                        <span className="type-preview">
                            <code>--spacing-vertical: 3rem;</code> (Header Gap, Section Gap)
                        </span>
                    </div>
                    <div className="type-row">
                        <span className="type-label">Text Gap</span>
                        <span className="type-preview">
                            <code>--spacing-text: 1.5rem;</code> (Subtitle to Body)
                        </span>
                    </div>
                    <div className="type-row">
                        <span className="type-label">Grid Gutter</span>
                        <span className="type-preview">
                            <code>--grid-gutter: 2rem;</code> (Column Gap)
                        </span>
                    </div>
                </section>

                {/* 3. Colors */}
                <section className="sg-section col-span-4">
                    <h2 className="sg-section-title">Color Palette / 色彩</h2>
                    <div className="color-grid">
                        {/* Brand Blue */}
                        <div className="color-card">
                            <div className="color-swatch" style={{ background: 'var(--brand-color)' }}></div>
                            <div className="color-info">
                                <span className="color-name">Brand Blue</span>
                                <span className="color-var">--brand-color</span>
                            </div>
                        </div>
                        {/* Background */}
                        <div className="color-card">
                            <div className="color-swatch" style={{ background: 'var(--bg-color)', borderBottom: '1px solid #333' }}></div>
                            <div className="color-info">
                                <span className="color-name">Background</span>
                                <span className="color-var">--bg-color</span>
                            </div>
                        </div>
                        {/* Text Color */}
                        <div className="color-card">
                            <div className="color-swatch" style={{ background: 'var(--text-color)' }}></div>
                            <div className="color-info">
                                <span className="color-name">Text Primary</span>
                                <span className="color-var">--text-color</span>
                            </div>
                        </div>
                        {/* Text Muted */}
                        <div className="color-card">
                            <div className="color-swatch" style={{ background: 'var(--text-muted)' }}></div>
                            <div className="color-info">
                                <span className="color-name">Text Muted</span>
                                <span className="color-var">--text-muted</span>
                            </div>
                        </div>
                        {/* Border */}
                        <div className="color-card">
                            <div className="color-swatch" style={{ background: 'var(--border-color)' }}></div>
                            <div className="color-info">
                                <span className="color-name">Border</span>
                                <span className="color-var">--border-color</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Components */}
                <section className="sg-section col-span-4">
                    <h2 className="sg-section-title">Components / 组件</h2>
                    <div className="component-demos">

                        <div className="demo-row">
                            <span className="demo-label">Jump Link</span>
                            <a href="#" className="jump-link">STANDARD LINK →</a>
                        </div>

                        <div className="demo-row">
                            <span className="demo-label">Glow Box</span>
                            <button className="glow-box">Action Button</button>
                        </div>

                        <div className="demo-row">
                            <span className="demo-label">Meta Labels</span>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div>
                                    <div className="meta-label">Label</div>
                                    <div className="meta-value">Value Content</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

            </div>
        </>
    );
}
