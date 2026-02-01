// main.js

const scene = document.getElementById('scene-container');
const sphere = document.getElementById('sphere');

// Focus Elements
const focusOverlay = document.getElementById('focus-overlay');
const focusCardPlaceholder = document.getElementById('focus-card-placeholder');
const focusInfoContainer = document.getElementById('focus-info-container');
const focusTitle = document.getElementById('focus-title');
const focusProject = document.getElementById('focus-project');
const focusDesc = document.getElementById('focus-desc');
const focusLink = document.getElementById('focus-link');
const focusClose = document.getElementById('focus-close');

// Configuration
let RADIUS = 900;
let BASE_SCALE = 0.5;
const MAX_SCALE = 1.3;
const DRAG_SENSITIVITY = 0.005;
const INERTIA_DECAY = 0.95;

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



// State: Dragging
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let dragDistance = 0;
let isFocusMode = false; // Track if we are in focus mode
let focusedCardClone = null; // To store the clone for animation

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

    // Focus events
    if (focusClose) {
        focusClose.addEventListener('click', exitFocusMode);
    }
    if (focusOverlay) {
        focusOverlay.addEventListener('click', exitFocusMode);
    }

    // Add escape key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isFocusMode) exitFocusMode();
        }
    });

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
            // Check for click (if not dragged)
            if (dragDistance < 5) {
                if (isMobileLayout) {
                    window.location.href = project.link;
                } else {
                    e.preventDefault();
                    enterFocusMode(project, cardContainer);
                }
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

/* =========================================
   Focus Mode Logic (Central Zoom + Blur)
   ========================================= */

function enterFocusMode(data, originalCard) {
    if (isFocusMode) return;
    isFocusMode = true;

    // 1. Populate Info
    focusTitle.innerText = data.title;
    focusProject.innerText = data.type;
    focusDesc.innerText = data.description || '暂无描述';
    focusLink.href = data.link;

    // 2. Lock Sphere Interaction
    document.body.style.cursor = 'default';

    // 3. FLIP Animation Strategy
    // Get original position
    const rect = originalCard.getBoundingClientRect();

    // Create clone FIRST (so it doesn't inherit hidden state if we hid original first)
    focusedCardClone = originalCard.cloneNode(true);

    // Hide original card temporarily
    originalCard.style.visibility = 'hidden';

    focusedCardClone.style.position = 'fixed';
    focusedCardClone.style.visibility = 'visible'; // Ensure clone is visible
    focusedCardClone.style.margin = '0';
    focusedCardClone.style.top = rect.top + 'px';
    focusedCardClone.style.left = rect.left + 'px';
    focusedCardClone.style.width = rect.width + 'px';
    focusedCardClone.style.height = rect.height + 'px';
    focusedCardClone.style.transform = 'none';
    focusedCardClone.style.zIndex = '10000';
    focusedCardClone.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
    // Remove pointer events from clone so we can click underlying elements if needed (though overlay covers)
    focusedCardClone.style.pointerEvents = 'none';

    document.body.appendChild(focusedCardClone);

    // Force layout reflow
    void focusedCardClone.offsetWidth;

    // Calculate target position (center of the grid-aligned placeholder)
    const targetRect = focusCardPlaceholder.getBoundingClientRect();

    // Animate to target
    // DYNAMIC SCALE: Scale the card to fit the placeholder perfectly
    const widthScale = (targetRect.width / rect.width) * 0.9;
    const heightScale = (targetRect.height / rect.height) * 0.9;
    const scaleFactor = Math.min(widthScale, heightScale);

    // Center it based on placeholder
    const targetX = targetRect.left + targetRect.width / 2 - rect.width / 2;
    const targetY = targetRect.top + targetRect.height / 2 - rect.height / 2;

    focusedCardClone.style.top = targetY + 'px';
    focusedCardClone.style.left = targetX + 'px';
    focusedCardClone.style.transform = `scale(${scaleFactor})`;

    // 4. Show Overlay & Info
    focusOverlay.classList.add('active');
    focusInfoContainer.classList.add('active');

    // Store reference to original card to restore later
    focusedCardClone.originalCardRef = originalCard;
}

function exitFocusMode() {
    if (!isFocusMode || !focusedCardClone) return;

    // 1. Hide Overlay & Info
    focusOverlay.classList.remove('active');
    focusInfoContainer.classList.remove('active');

    // 2. Reverse Animation
    const originalCard = focusedCardClone.originalCardRef;
    const rect = originalCard.getBoundingClientRect();

    focusedCardClone.style.top = rect.top + 'px';
    focusedCardClone.style.left = rect.left + 'px';
    focusedCardClone.style.transform = 'scale(1)';

    // 3. Cleanup after animation
    setTimeout(() => {
        if (focusedCardClone && focusedCardClone.parentNode) {
            focusedCardClone.parentNode.removeChild(focusedCardClone);
        }
        originalCard.style.visibility = 'visible'; // Show original back
        isFocusMode = false;
        focusedCardClone = null;
    }, 500); // Match transition duration
}

function getPointerPos(e) {
    if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
}

function onMouseDown(e) {
    if (isFocusMode) return; // Block interaction in focus mode

    dragDistance = 0; // Reset drag distance ALWAYS

    // ALLOW dragging on cards again (so mobile users don't need to find gaps)

    if (e.type === 'mousedown' && e.button !== 0) return;

    isDragging = true;
    dragDistance = 0; // Reset drag distance
    const pos = getPointerPos(e);
    lastMouseX = pos.x;
    lastMouseY = pos.y;

    velocityX = 0;
    velocityY = 0;

    document.body.style.cursor = 'default';
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
    // Stop rotation if in focus mode or dragging
    if (!isDragging && !isFocusMode) {
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

        let scale = mapRange(finalZ, -RADIUS, RADIUS, BASE_SCALE, MAX_SCALE);

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