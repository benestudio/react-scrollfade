import React, { useCallback, useEffect, useRef } from 'react';

const easeIn = (t: number, alpha: number) => Math.pow(t, alpha);

const getMask = (opacity: number) => `linear-gradient(180deg, black, rgba(255, 255, 255, ${opacity})) center bottom/100%
    56px no-repeat,
linear-gradient(180deg, black, black) center top/100% calc(100% - 56px)
    no-repeat`;

const ScrollFade = () => {
    const rootRef = useRef<HTMLDivElement>(null);

    const onScroll = useCallback(() => {
        const scrollElement = rootRef.current?.parentElement;
        if (scrollElement) {
            const { offsetHeight: elementHeight, scrollHeight: elementWidth, scrollTop } = scrollElement;
            const opacity = easeIn(scrollTop / (elementHeight - elementWidth), 10);
            const mask = getMask(opacity);

            scrollElement.style.mask = mask;
            scrollElement.style.webkitMask = mask;
        }
    }, []);

    useEffect(() => {
        const scrollElement = rootRef.current?.parentElement;

        if (scrollElement) {
            const { offsetHeight, scrollHeight } = scrollElement;
            if (offsetHeight !== scrollHeight) {
                const mask = getMask(0);
                scrollElement.style.mask = mask;
                scrollElement.style.webkitMask = mask;
            }

            scrollElement.addEventListener('scroll', onScroll);
            return () => scrollElement.removeEventListener('scroll', onScroll);
        }
    }, []);

    return <div className="scroll-fade" ref={rootRef} />;
};

export default ScrollFade;
