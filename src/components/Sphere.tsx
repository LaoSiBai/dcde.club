'use client';

import React, { useEffect, useRef, useState } from 'react';
import { getAllProjects, Project } from '@/lib/api';
import siteData from '@/data/site.json';

// Types
// Project type is now imported from @/lib/api

interface CardState {
    element: HTMLDivElement;
    baseX: number;
    baseY: number;
    baseZ: number;
    project: Project;
}

export default function Sphere() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sphereRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<CardState[]>([]);
    const requestRef = useRef<number | undefined>(undefined);

    // Focus Mode State
    const [focusData, setFocusData] = useState<Project | null>(null);
    const [isFocusMode, setIsFocusMode] = useState(false);

    // Constants
    const RADIUS_DESKTOP = 900;
    const RADIUS_MOBILE = 650;
    const SCALE_DESKTOP = 0.5;
    const SCALE_MOBILE = 0.35;

    // Animation State - use ref so animation loop can access latest values
    const state = useRef({
        radius: RADIUS_DESKTOP,
        baseScale: SCALE_DESKTOP,
        isMobile: false,
        isFocusMode: false,  // Track in ref for animation loop

        rotY: 0,
        rotX: 0,
        velX: 0,
        velY: 0,

        isDragging: false,
        lastX: 0,
        lastY: 0,
        dragDist: 0,
    });

    // Focus Animation Refs (must be before enterFocus/exitFocus)
    const focusedCardCloneRef = useRef<HTMLElement | null>(null);

    const enterFocus = (p: Project, originalCard: HTMLDivElement) => {
        if (state.current.isFocusMode) return;
        state.current.isFocusMode = true;
        setFocusData(p);
        setIsFocusMode(true);

        // FLIP Animation
        const rect = originalCard.getBoundingClientRect();
        const clone = originalCard.cloneNode(true) as HTMLElement;

        // Hide original
        originalCard.style.visibility = 'hidden';

        // Init clone state
        clone.style.position = 'fixed';
        clone.style.visibility = 'visible';
        clone.style.margin = '0';
        clone.style.top = `${rect.top}px`;
        clone.style.left = `${rect.left}px`;
        clone.style.width = `${rect.width}px`;
        clone.style.height = `${rect.height}px`;
        clone.style.transform = 'none';
        clone.style.zIndex = '10000';
        clone.style.transition = 'all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
        clone.style.pointerEvents = 'none';

        document.body.appendChild(clone);
        focusedCardCloneRef.current = clone;

        // Save original ref on the clone for restoration
        (clone as HTMLElement & { originalCard?: HTMLElement }).originalCard = originalCard;

        // Force reflow
        void clone.offsetWidth;

        // Animate to target
        requestAnimationFrame(() => {
            const placeholder = document.getElementById('focus-card-placeholder');
            if (placeholder) {
                const targetRect = placeholder.getBoundingClientRect();

                // Calculate scale to fit
                const widthScale = (targetRect.width / rect.width) * 0.9;
                const heightScale = (targetRect.height / rect.height) * 0.9;
                const scaleFactor = Math.min(widthScale, heightScale);

                const targetX = targetRect.left + targetRect.width / 2 - rect.width / 2;
                const targetY = targetRect.top + targetRect.height / 2 - rect.height / 2;

                clone.style.top = `${targetY}px`;
                clone.style.left = `${targetX}px`;
                clone.style.transform = `scale(${scaleFactor})`;
            }
        });
    };

    const exitFocus = () => {
        // Don't unlock physics yet - wait for animation
        setIsFocusMode(false);
        // setFocusData(null); // Moved to timeout

        if (focusedCardCloneRef.current) {
            const clone = focusedCardCloneRef.current;
            const original = (clone as HTMLElement & { originalCard?: HTMLElement }).originalCard;

            // Reverse animation
            if (original) {
                const rect = original.getBoundingClientRect();
                clone.style.top = `${rect.top}px`;
                clone.style.left = `${rect.left}px`;
                clone.style.transform = 'scale(1)';
            }

            // Cleanup after animation completes
            setTimeout(() => {
                if (clone.parentElement) clone.parentElement.removeChild(clone);
                if (original) original.style.visibility = 'visible';
                focusedCardCloneRef.current = null;

                // NOW unlock physics and clear data
                setFocusData(null);
                state.current.isFocusMode = false;
            }, 500);
        } else {
            // No animation, just reset
            setFocusData(null);
            state.current.isFocusMode = false;
        }
    };

    const handleCardClick = (e: MouseEvent, p: Project, div: HTMLDivElement) => {
        if (state.current.dragDist > 5) return;

        // Check mobile -> direct navigation
        if (state.current.isMobile) {
            window.location.href = `/projects/${p.id}`;
            return;
        }

        // Desktop -> Focus Mode
        enterFocus(p, div);
    };

    const createCards = (projects: Project[]) => {
        if (!sphereRef.current) return;
        sphereRef.current.innerHTML = ''; // Clear
        cardsRef.current = [];

        // Fill to configured count
        const targetCount = siteData.sphereCardCount || 50;
        let list = [...projects];
        while (list.length < targetCount) list = list.concat(projects);
        list = list.slice(0, targetCount);

        const count = list.length;
        const goldenRatio = (1 + Math.sqrt(5)) / 2;

        list.forEach((p, i) => {
            const div = document.createElement('div');
            div.className = 'card-container';

            const content = document.createElement('div');
            content.className = 'card-content';

            const img = document.createElement('img');
            img.src = p.thumbnail.startsWith('http') ? p.thumbnail : `/projects/${p.id}/${p.thumbnail}`;
            img.className = 'card-img';
            // Prevent drag
            img.ondragstart = (e) => e.preventDefault();

            const title = document.createElement('div');
            title.className = 'card-title';
            title.innerText = p.title;

            content.appendChild(img);
            content.appendChild(title);
            div.appendChild(content);

            // Event Listener for Click
            div.onclick = (e) => handleCardClick(e, p, div);

            sphereRef.current?.appendChild(div);

            // Calc Position
            const theta = 2 * Math.PI * i / goldenRatio;
            const phi = Math.acos(1 - 2 * (i + 0.5) / count);

            cardsRef.current.push({
                element: div,
                baseX: Math.sin(phi) * Math.cos(theta),
                baseY: Math.sin(phi) * Math.sin(theta),
                baseZ: Math.cos(phi),
                project: p
            });
        });
    };

    const updatePhysics = () => {
        const s = state.current;
        if (s.isFocusMode) return;  // Stop all physics in focus mode

        if (!s.isDragging) {
            // Apply inertia decay
            s.velX *= 0.95;
            s.velY *= 0.95;
            if (Math.abs(s.velX) < 0.0001) s.velX = 0;
            if (Math.abs(s.velY) < 0.0001) s.velY = 0;

            // Auto Rotation recovery (slowly return to auto-spin)
            const targetSpeed = 0.006;
            const blendRate = Math.abs(s.velY) > targetSpeed * 3 ? 0.005 : 0.02;
            s.velY += (targetSpeed - s.velY) * blendRate;

            // Spring back X to center (polar damping)
            s.rotX += (0 - s.rotX) * 0.05;

            // Apply velocity to rotation (only when not dragging)
            s.rotY += s.velY;
            s.rotX += s.velX;
        }
        // When dragging, rotation is applied directly in handleMove
    };

    const renderSphere = () => {
        const s = state.current;
        const r = s.radius;

        const sinX = Math.sin(s.rotX);
        const cosX = Math.cos(s.rotX);
        const sinY = Math.sin(s.rotY);
        const cosY = Math.cos(s.rotY);

        cardsRef.current.forEach(card => {
            // baseXYZ are normalized vectors. Multiply by radius.
            const x = card.baseX * r;
            const y = card.baseY * r;
            const z = card.baseZ * r;

            const x1 = x * cosY - z * sinY;
            const z1 = x * sinY + z * cosY;

            const y2 = y * cosX - z1 * sinX;
            const z2 = y * sinX + z1 * cosX;
            const x2 = x1; // No rotation around Z

            let scale = mapRange(z2, -r, r, s.baseScale, 1.3);
            let opacity = mapRange(z2, -r, r * 0.5, 0.1, 1.0);

            scale = Math.max(0, scale);
            opacity = Math.max(0, Math.min(1, opacity));

            const transform = s.isMobile
                ? `translate3d(${y2}px, ${-x2}px, 0px) scale(${scale})`
                : `translate3d(${x2}px, ${y2}px, 0px) scale(${scale})`;

            card.element.style.transform = transform;
            card.element.style.zIndex = Math.floor(z2 + r).toString();
            card.element.style.opacity = opacity.toString();
            card.element.style.pointerEvents = z2 < 0 ? 'none' : 'auto';
        });
    };

    useEffect(() => {
        // Initialize
        const checkMode = () => {
            state.current.isMobile = window.innerWidth < 768;
            if (state.current.isMobile) {
                state.current.radius = RADIUS_MOBILE;
                state.current.baseScale = SCALE_MOBILE;
            } else {
                state.current.radius = RADIUS_DESKTOP;
                state.current.baseScale = SCALE_DESKTOP;
            }
        };

        checkMode();
        window.addEventListener('resize', checkMode);

        // Fetch Data
        const loadData = async () => {
            try {
                const projects = await getAllProjects();
                createCards(projects);
            } catch (e) {
                console.error("Failed to load projects", e);
            }
        };
        loadData();

        // Animation Loop
        const animate = () => {
            updatePhysics();
            renderSphere();
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', checkMode);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // Mouse/Touch Handlers
    const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
        if (isFocusMode) return;
        state.current.isDragging = true;
        state.current.dragDist = 0;

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        state.current.lastX = clientX;
        state.current.lastY = clientY;
        state.current.velX = 0;
        state.current.velY = 0;
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!state.current.isDragging) return;
        const s = state.current;

        const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

        const dx = clientX - s.lastX;
        const dy = clientY - s.lastY;

        s.dragDist += Math.abs(dx) + Math.abs(dy);
        s.lastX = clientX;
        s.lastY = clientY;

        const sensitivity = s.isMobile ? 0.0075 : 0.005;
        const MAX_CROSS_ANGLE = Math.PI / 3;
        const CROSS_DAMPING_FACTOR = 0.5;

        if (s.isMobile) {
            // Mobile: dy = main rotation (Y), dx = damped tilt (X)
            s.velY = dy * sensitivity;

            let resistance = 1.0;
            if (Math.abs(s.rotX) > MAX_CROSS_ANGLE / 2) resistance = CROSS_DAMPING_FACTOR;
            if (Math.abs(s.rotX) > MAX_CROSS_ANGLE) resistance = 0.1;
            s.velX = -dx * sensitivity * resistance;
        } else {
            // Desktop: dx = Y rotation, dy = damped X rotation
            s.velY = -dx * sensitivity;

            let resistance = 1.0;
            if (Math.abs(s.rotX) > MAX_CROSS_ANGLE / 2) resistance = CROSS_DAMPING_FACTOR;
            if (Math.abs(s.rotX) > MAX_CROSS_ANGLE) resistance = 0.1;
            s.velX = -dy * sensitivity * resistance;
        }

        // Apply velocity immediately during drag (like original)
        s.rotY += s.velY;
        s.rotX += s.velX;
    };

    const handleUp = () => {
        state.current.isDragging = false;
    };

    return (
        <div
            className="sphere-wrapper"
            onMouseDown={handleDown}
            onMouseMove={handleMove}
            onMouseUp={handleUp}
            onTouchStart={handleDown}
            onTouchMove={handleMove}
            onTouchEnd={handleUp}
            ref={containerRef}
            style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, overflow: 'hidden' }}
        >
            {/* scene-container positioning comes from CSS (left: 65% desktop, left: 50% mobile) */}
            <div id="scene-container">
                <div id="sphere" ref={sphereRef}></div>
            </div>

            {/* Focus Overlay - Use ID for CSS matching, add inline style to force it if CSS fails */}
            <div
                id="focus-overlay"
                className={isFocusMode ? 'active' : ''}
                onClick={exitFocus}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    zIndex: 9990,
                    opacity: isFocusMode ? 1 : 0,
                    pointerEvents: isFocusMode ? 'auto' : 'none',
                    transition: 'opacity 0.4s ease'
                }}
            ></div>

            {/* Focus Info Panel - Use ID for CSS matching */}
            <div id="focus-info-container" className={isFocusMode ? 'active' : ''}>
                <div id="focus-card-placeholder"></div>
                <div className="focus-info-inner">
                    <div className="focus-content">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <button
                                id="focus-close"
                                className="jump-link"
                                onClick={(e) => { e.stopPropagation(); exitFocus(); }}
                            >← 返回</button>
                            <h2 className="focus-title" style={{ marginBottom: 0 }}>{focusData?.title}</h2>
                        </div>
                        <div className="focus-meta">
                            <div>
                                <div className="focus-meta-label">项目</div>
                                <div className="focus-meta-value">{focusData?.type}</div>
                            </div>
                        </div>
                        <p className="focus-description">{focusData?.summary || '暂无描述'}</p>
                        <a href={focusData ? `/projects/${focusData.id}` : '#'} className="jump-link focus-link">查看详情 →</a>
                    </div>
                </div>
                {/* Button moved inside */}
            </div>
        </div>
    );
}

function mapRange(value: number, low1: number, high1: number, low2: number, high2: number) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}