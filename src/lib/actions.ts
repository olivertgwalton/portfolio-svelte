import type { Action } from 'svelte/action';

interface RevealParams {
    delay?: number;
    duration?: number;
    y?: number;
}

export const reveal: Action<HTMLElement, RevealParams> = (el, params = {}) => {
    const { delay = 0, duration = 600, y = 20 } = params;

    // Skip if already revealed
    if (el.dataset.revealed === 'true') {
        el.style.opacity = '1';
        return { destroy() { } };
    }

    // Initial hidden state
    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px)`;

    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                el.dataset.revealed = 'true';
                el.style.transition = 'none';

                el.animate(
                    [
                        { opacity: 0, transform: `translateY(${y}px)` },
                        { opacity: 1, transform: 'translateY(0)' }
                    ],
                    { duration, delay, easing: 'ease-out', fill: 'forwards' }
                ).onfinish = () => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                    el.style.transition = '';
                };

                observer.disconnect();
            }
        },
        { threshold: 0.1 }
    );

    observer.observe(el);

    return { destroy: () => observer.disconnect() };
};

interface TiltParams {
    max?: number;
    scale?: number;
}

export const tilt: Action<HTMLElement, TiltParams> = (el, params = {}) => {
    const { max = 5, scale = 1.02 } = params;
    let bounds: DOMRect;

    const onEnter = () => {
        bounds = el.getBoundingClientRect();
        el.style.transition = 'transform 400ms ease-out';
    };

    const onMove = (e: MouseEvent) => {
        if (!bounds) return;
        const xRot = ((e.clientY - bounds.top) / bounds.height - 0.5) * max * -1;
        const yRot = ((e.clientX - bounds.left) / bounds.width - 0.5) * max;
        el.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(${scale})`;
    };

    const onLeave = () => {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return {
        destroy() {
            el.removeEventListener('mouseenter', onEnter);
            el.removeEventListener('mousemove', onMove);
            el.removeEventListener('mouseleave', onLeave);
        }
    };
};
