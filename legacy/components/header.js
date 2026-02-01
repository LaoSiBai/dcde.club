// header.js
(function () {
    const pathname = window.location.pathname;

    // Check if we're in a project subpage (2 levels deep: /projects/[id]/)
    const isProjectPage = pathname.includes('/projects/') && pathname.split('/').filter(Boolean).length >= 2;

    // Check if we're in a regular subpage (1 level deep)
    const isSubPage = pathname.includes('/biliboard/') ||
        pathname.includes('/styleguide/') ||
        pathname.includes('/info/');

    // Determine base path based on depth
    let basePath = './';
    if (isProjectPage) {
        basePath = '../../';  // projects/[id]/ -> go up 2 levels
    } else if (isSubPage) {
        basePath = '../';     // [subpage]/ -> go up 1 level
    }

    const logoFile = (isSubPage || isProjectPage) ? 'logo-3.svg' : 'logo-1.svg';

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
