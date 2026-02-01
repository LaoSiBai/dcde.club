'use client';

import Link from 'next/link';

export default function Header() {
    // Original logic:
    // - Mobile (max-width: 768px): always logo-3.svg (small logo with text)
    // - Desktop: always logo-2.svg (large DCDE letters)
    // The page location doesn't affect which logo is shown.

    return (
        <header className="main-header layout-grid" style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1000, pointerEvents: 'none' }}>
            <Link href="/" className="main-logo-link col-span-1" style={{ pointerEvents: 'auto' }}>
                <picture>
                    <source srcSet="/logo-3.svg" media="(max-width: 768px)" />
                    <img src="/logo-2.svg" alt="DCDE Logo" className="main-logo" />
                </picture>
            </Link>
        </header>
    );
}
