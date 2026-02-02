'use client';

import Link from 'next/link';

interface HeaderProps {
    position?: 'absolute' | 'relative';
}

export default function Header({ position = 'absolute' }: HeaderProps) {
    // Responsive logo switching:
    // - Mobile (max-width: 768px): logo-3.svg (compact logo)
    // - Desktop: logo-2.svg (large DCDE letters)

    const positionClass = position === 'absolute' ? 'header--absolute' : 'header--relative';

    return (
        <header className={`main-header layout-grid ${positionClass}`}>
            <Link href="/" className="main-logo-link col-span-1">
                <picture>
                    <source srcSet="/logo-3.svg" media="(max-width: 768px)" />
                    <img src="/logo-2.svg" alt="DCDE Logo" className="main-logo" />
                </picture>
            </Link>
        </header>
    );
}
