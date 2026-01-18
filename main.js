// main.js

// --- 1. 导航交互 ---
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

// --- 2. 抽屉逻辑 ---
const drawer = document.getElementById('project-drawer');
const drawerContent = document.getElementById('drawer-content');
const closeBtn = document.getElementById('close-drawer');

function openDrawer(url) {
    drawerContent.innerHTML = '<div style="padding:5vw; text-align:center;">LOADING...</div>';
    
    // 打开抽屉
    drawer.classList.add('active');
    
    // 锁死主页滚动
    document.body.classList.add('no-scroll');
    
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('.project-page-container');
            
            if (content) {
                drawerContent.innerHTML = '';
                drawerContent.appendChild(content);
            } else {
                drawerContent.innerHTML = doc.body.innerHTML;
            }
        })
        .catch(err => {
            console.error(err);
            drawerContent.innerHTML = 'ERROR.';
        });
}

closeBtn.addEventListener('click', () => {
    // 关闭抽屉
    drawer.classList.remove('active');
    
    // 恢复主页滚动
    document.body.classList.remove('no-scroll');
    
    setTimeout(() => {
        drawerContent.innerHTML = '';
    }, 600);
});

// --- 3. 渲染作品 ---
const gridContainer = document.querySelector('.grid-container');

function renderProjects() {
    if(typeof projectsData === 'undefined') return;

    projectsData.forEach(project => {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell', 'p-0');
        if (project.size === 'large') {
            cell.classList.add('big-square');
        }
        
        const link = document.createElement('a');
        link.href = project.link;
        link.className = 'project-link';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openDrawer(project.link);
        });

        link.innerHTML = `
            <img src="${project.image}" class="project-img" alt="${project.title}">
        `;
        
        cell.appendChild(link);
        gridContainer.appendChild(cell);
    });
}

// --- 4. 页脚 ---
function renderFooter() {
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

initNavInteraction();
renderProjects();
renderFooter();

console.log("System Online.");