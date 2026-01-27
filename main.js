// main.js

const scene = document.getElementById('scene-container');
const sphere = document.getElementById('sphere');

// Drawer Elements
const drawerOverlay = document.getElementById('drawer-overlay');
const drawer = document.getElementById('drawer');
const drawerClose = document.getElementById('drawer-close');
const drawerTitle = document.getElementById('drawer-title');
const drawerProject = document.getElementById('drawer-project');
const drawerDesc = document.getElementById('drawer-desc');
const drawerImage = document.getElementById('drawer-image');
const drawerLink = document.getElementById('drawer-link');

// Configuration
let RADIUS = 900;
let BASE_SCALE = 0.5;
const MAX_SCALE = 1.3;
const DRAG_SENSITIVITY = 0.005;
const INERTIA_DECAY = 0.95;

// Elastic Config
const GRAB_RADIUS_MULT = 1.3;
const GRAB_ITEM_MULT = 0.9;
const NORMAL_MULT = 1.0;
const SCALE_ELASTICITY = 0.1;

// Spring/Damping Config
const MAX_CROSS_ANGLE = Math.PI / 3;
const SPRING_STRENGTH = 0.05;
const CROSS_DAMPING_FACTOR = 0.5;

// State: Cards
let cards = [];
let isMobileLayout = false;

// State: Rotation
let currentRotY = 0;
let currentRotX = 0;
let velocityX = 0;
let velocityY = 0;

// State: Elastic Variables
let currentRadiusMult = 1.0;
let targetRadiusMult = 1.0;
let currentItemMult = 1.0;
let targetItemMult = 1.0;

// State: Dragging
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let dragDistance = 0; // Track drag distance to distinguish click vs drag

function init() {
    checkMode();
    window.addEventListener('resize', () => {
        checkMode();
        rebuildScene();
    });

    createCards();

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);

    // Drawer events
    if (drawerClose) {
        drawerClose.addEventListener('click', closeDrawer);
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    animate();
}

function checkMode() {
    isMobileLayout = window.innerWidth < 768;
    if (isMobileLayout) {
        RADIUS = 650;
        BASE_SCALE = 0.35;
    } else {
        RADIUS = 900;
        BASE_SCALE = 0.5;
    }
}

function rebuildScene() {
    sphere.innerHTML = '';
    cards = [];
    createCards();
}

function createCards() {
    let cardsData = [...projectsData];
    while (cardsData.length < 50) {
        cardsData = cardsData.concat(projectsData);
    }
    cardsData = cardsData.slice(0, 50);

    const count = cardsData.length;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    cardsData.forEach((project, i) => {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';

        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';

        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;
        img.className = 'card-img';

        const title = document.createElement('div');
        title.className = 'card-title';
        title.innerText = project.title;

        cardContent.appendChild(img);
        cardContent.appendChild(title);
        cardContainer.appendChild(cardContent);

        // Click to open drawer (only if not dragging)
        cardContainer.addEventListener('click', (e) => {
            if (dragDistance < 10) {
                e.preventDefault();
                openDrawer(project);
            }
        });
        img.ondragstart = () => false;

        sphere.appendChild(cardContainer);

        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * (i + 0.5) / count);

        const x = RADIUS * Math.sin(phi) * Math.cos(theta);
        const y = RADIUS * Math.sin(phi) * Math.sin(theta);
        const z = RADIUS * Math.cos(phi);

        cards.push({ element: cardContainer, baseX: x, baseY: y, baseZ: z });
    });
}

// Drawer Functions
function openDrawer(project) {
    if (drawerTitle) drawerTitle.textContent = project.title;
    if (drawerProject) drawerProject.textContent = project.id;
    if (drawerDesc) drawerDesc.textContent = project.description || '暂无描述';
    if (drawerImage) {
        drawerImage.src = project.image;
        drawerImage.alt = project.title;
    }
    if (drawerLink) {
        drawerLink.href = project.link;
    }

    if (drawerOverlay) drawerOverlay.classList.add('active');
    if (drawer) drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDrawer() {
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    if (drawer) drawer.classList.remove('active');
    document.body.style.overflow = '';
}

function getPointerPos(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

function onMouseDown(e) {
    if (e.type === 'mousedown' && e.button !== 0) return;

    isDragging = true;
    dragDistance = 0; // Reset drag distance
    const pos = getPointerPos(e);
    lastMouseX = pos.x;
    lastMouseY = pos.y;

    velocityX = 0;
    velocityY = 0;

    targetRadiusMult = GRAB_RADIUS_MULT;
    targetItemMult = GRAB_ITEM_MULT;

    document.body.style.cursor = 'grabbing';
}

function onMouseMove(e) {
    if (!isDragging) return;

    const pos = getPointerPos(e);
    if (pos.x === undefined) return;

    const dx = pos.x - lastMouseX;
    const dy = pos.y - lastMouseY;

    // Track total drag distance
    dragDistance += Math.abs(dx) + Math.abs(dy);

    lastMouseX = pos.x;
    lastMouseY = pos.y;

    const sensitivity = isMobileLayout ? DRAG_SENSITIVITY * 1.5 : DRAG_SENSITIVITY;

    if (isMobileLayout) {
        // Mobile: Same as desktop but rotated 90 degrees
        // dy (vertical swipe) = rotY (infinite, main axis)
        // dx (horizontal swipe) = rotX (damped tilt)
        velocityY = dy * sensitivity;  // Vertical swipe = main rotation (reversed)

        let resistance = 1.0;
        if (Math.abs(currentRotX) > MAX_CROSS_ANGLE / 2) resistance = CROSS_DAMPING_FACTOR;
        if (Math.abs(currentRotX) > MAX_CROSS_ANGLE) resistance = 0.1;
        velocityX = -dx * sensitivity * resistance;  // Horizontal swipe = damped tilt (like desktop vertical)

    } else {
        velocityY = -dx * sensitivity;

        let resistance = 1.0;
        if (Math.abs(currentRotX) > MAX_CROSS_ANGLE / 2) resistance = CROSS_DAMPING_FACTOR;
        if (Math.abs(currentRotX) > MAX_CROSS_ANGLE) resistance = 0.1;
        velocityX = -dy * sensitivity * resistance;
    }

    currentRotY += velocityY;
    currentRotX += velocityX;
}

function onMouseUp() {
    isDragging = false;
    document.body.style.cursor = 'default';
    targetRadiusMult = NORMAL_MULT;
    targetItemMult = NORMAL_MULT;
}

function onTouchStart(e) {
    if (e.touches.length > 0) onMouseDown(e);
}

function onTouchMove(e) {
    if (e.touches.length > 0) {
        e.preventDefault();
        onMouseMove(e);
    }
}

function animate() {
    currentRadiusMult += (targetRadiusMult - currentRadiusMult) * SCALE_ELASTICITY;
    currentItemMult += (targetItemMult - currentItemMult) * SCALE_ELASTICITY;

    if (!isDragging) {
        currentRotY += velocityY;
        currentRotX += velocityX;

        velocityX *= INERTIA_DECAY;
        velocityY *= INERTIA_DECAY;

        if (Math.abs(velocityX) < 0.0001) velocityX = 0;
        if (Math.abs(velocityY) < 0.0001) velocityY = 0;

        if (isMobileLayout) {
            // Mobile: rotX springs back, velocityY always recovers to auto-scroll
            currentRotX += (0 - currentRotX) * SPRING_STRENGTH;
            const targetSpeed = 0.006;
            // Always blend toward target, faster when close to it
            const blendRate = Math.abs(velocityY) > targetSpeed * 3 ? 0.005 : 0.03;
            velocityY += (targetSpeed - velocityY) * blendRate;
        } else {
            currentRotX += (0 - currentRotX) * SPRING_STRENGTH;
            const targetSpeed = 0.006;
            const blendRate = Math.abs(velocityY) > targetSpeed * 3 ? 0.005 : 0.02;
            velocityY += (targetSpeed - velocityY) * blendRate;
        }
    }

    const sinX = Math.sin(currentRotX);
    const cosX = Math.cos(currentRotX);
    const sinY = Math.sin(currentRotY);
    const cosY = Math.cos(currentRotY);

    cards.forEach(card => {
        const x = card.baseX;
        const y = card.baseY;
        const z = card.baseZ;

        // Same transformation for both desktop and mobile
        let x1 = x * cosY - z * sinY;
        let z1 = x * sinY + z * cosY;

        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;
        let x2 = x1;

        let finalX = x2;
        let finalY = y2;
        let finalZ = z2;

        finalX *= currentRadiusMult;
        finalY *= currentRadiusMult;

        let scale = mapRange(finalZ, -RADIUS, RADIUS, BASE_SCALE, MAX_SCALE);
        scale *= currentItemMult;

        let opacity = mapRange(finalZ, -RADIUS, RADIUS * 0.5, 0.1, 1.0);

        scale = Math.max(0, scale);
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;

        // Mobile: swap X/Y to rotate visual 90 degrees
        if (isMobileLayout) {
            card.element.style.transform = `translate3d(${finalY}px, ${-finalX}px, 0px) scale(${scale})`;
        } else {
            card.element.style.transform = `translate3d(${finalX}px, ${finalY}px, 0px) scale(${scale})`;
        }
        card.element.style.zIndex = Math.floor(finalZ + RADIUS);
        card.element.style.opacity = opacity;

        if (finalZ < 0) {
            card.element.style.pointerEvents = 'none';
        } else {
            card.element.style.pointerEvents = 'auto';
        }
    });

    requestAnimationFrame(animate);
}

function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

window.addEventListener('DOMContentLoaded', init);