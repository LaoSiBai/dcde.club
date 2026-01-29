// header.js
(function () {
    const isSubPage = window.location.pathname.includes('/biliboard/') ||
        window.location.pathname.includes('/styleguide/') ||
        window.location.pathname.includes('/info/');

    const basePath = isSubPage ? '../' : './';
    const logoFile = isSubPage ? 'logo-3.svg' : 'logo-1.svg'; // Using logo-3 for subpages (darker/consistent) or keep same

    const headerHTML = `
        <header class="main-header layout-grid">
            <a href="${basePath}index.html" class="main-logo-link col-span-1">
                <picture>
                    <source srcset="${basePath}logo-3.svg" media="(max-width: 768px)">
                    <img src="${basePath}logo-2.svg" alt="DCDE Logo" class="main-logo">
                </picture>
            </a>
        </header>
    `;

    const container = document.getElementById('global-header');
    if (container) {
        container.innerHTML = headerHTML;
    }
})();
