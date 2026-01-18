// main.js

// 1. 导航交互
function initNavInteraction() {
    const navLinks = document.querySelectorAll('.nav-text');
    const globalDesc = document.getElementById('global-desc');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            globalDesc.textContent = link.getAttribute('data-desc');
            globalDesc.style.opacity = '1';
        });
        link.addEventListener('mouseleave', () => {
            globalDesc.style.opacity = '0';
        });
    });
}

// 2. 渲染作品
const gridContainer = document.querySelector('.grid-container');

function renderProjects() {
    if (typeof projectsData === 'undefined' || !gridContainer) return;

    gridContainer.innerHTML = '';

    projectsData.forEach(project => {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell', 'p-0', 'scroll-reveal');
        if (project.size === 'large') {
            cell.classList.add('big-square');
        }

        const link = document.createElement('a');
        link.href = project.link;
        link.className = 'project-link';

        link.innerHTML = `
            <img src="${project.image}" class="project-img" alt="${project.title}">
        `;

        cell.appendChild(link);
        gridContainer.appendChild(cell);
    });

    renderFooter();
    initScrollObserver();
}

// 3. 页脚
function renderFooter() {
    if (!gridContainer) return;

    const spacer1 = document.createElement('div');
    spacer1.classList.add('grid-cell');
    gridContainer.appendChild(spacer1);

    const spacer2 = document.createElement('div');
    spacer2.classList.add('grid-cell');
    gridContainer.appendChild(spacer2);

    const footer = document.createElement('div');
    footer.classList.add('grid-cell');
    footer.innerHTML = `
        <div class="footer-text">
            © 2026 DCDE<br>ALL RIGHTS RESERVED.
        </div>
    `;
    gridContainer.appendChild(footer);
}

// 4. 滚动动画初始化
function initScrollObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 50);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '20px'
    });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
}

// 7. 初始化
document.addEventListener('DOMContentLoaded', () => {
    initNavInteraction();

    const grid = document.querySelector('.grid-container');
    if (grid && !grid.querySelector('.detail-text') && !grid.classList.contains('detail-grid')) {
        renderProjects();
    }

    initScrollObserver();
});

console.log("System Online.");