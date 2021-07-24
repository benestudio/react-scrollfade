import React, { useCallback, useEffect, useRef } from 'react';

const easeIn = (t: number, alpha: number) => Math.pow(t, alpha);
const FADE_HEIGHT = 56;

type ScrollFadeProps = { height?: number };

const ScrollFade = ({ height }: ScrollFadeProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const getMaskRef = useRef<(opacity: number) => string>(
        (opacity: number) => `linear-gradient(180deg, black, rgba(0,50, 255, ${opacity})) center bottom/100%
        ${height}px no-repeat,
    linear-gradient(180deg, black, black) center top/100% calc(100% - ${height}px)
        no-repeat`
    );

    const onScroll = useCallback(() => {
        const scrollElement = rootRef.current?.parentElement;
        if (scrollElement) {
            const getMask = getMaskRef.current;
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
                const mask = getMaskRef.current(0);
                scrollElement.style.mask = mask;
                scrollElement.style.webkitMask = mask;
            }

            scrollElement.addEventListener('scroll', onScroll);
            return () => scrollElement.removeEventListener('scroll', onScroll);
        }
    }, []);

    return <div className="scroll-fade" ref={rootRef} />;
};
ScrollFade.defaultProps = {
    height: FADE_HEIGHT,
};
export default ScrollFade;
