import React, { createRef } from 'react'
import { object } from 'prop-types'
import throttle from 'lodash.throttle'

import styles, { fadeTransparentPercentage, fadeWhitePercentage } from './styles'

export interface IScrollFadeProps {
    scrollElement: EventTarget & HTMLElement
}

interface IScrollFadeState {
    scrollable: boolean;
}

const easeIn = (t: number, alpha: number, reverseDirection = false) => {
    const y = Math.pow(t, alpha)
    return reverseDirection ? 1 - y : y
}

const getBackgroundGradient = (overalOpacity: number) =>
    `linear-gradient(0deg, rgba(255, 255, 255) ${fadeWhitePercentage * overalOpacity}%, rgba(255, 255, 255, 0) ${
        fadeTransparentPercentage * overalOpacity
    }%)`

export class ScrollFade extends React.Component<IScrollFadeProps, IScrollFadeState> {
    public static propTypes = {
        scrollElement: object.isRequired,
    }

    private fadeElement: React.RefObject<HTMLDivElement> = createRef();
    private currentHandler: EventListener  | null = null;

    public state = {
        scrollable: false,
    }

    getScrollHandler(fadeElement: React.RefObject<HTMLDivElement>) {
        return throttle((e) => {
            if (fadeElement.current) {
                const { offsetHeight, scrollTop, scrollHeight } = e.target
                const opacity = easeIn(Math.min(1, scrollTop / (scrollHeight - offsetHeight)), 10, true)
                // applying change directly for performance
                fadeElement.current.style.background = getBackgroundGradient(opacity)
            }
        }, 100)
    }

    componentDidUpdate() {
        const handler = this.getScrollHandler(this.fadeElement)

        if (this.props.scrollElement) {
            this.props.scrollElement.removeEventListener('scroll', this.currentHandler)
            this.props.scrollElement.addEventListener('scroll', handler)
            this.currentHandler = handler
        }
    }

    componentDidMount() {
        const handler = this.getScrollHandler(this.fadeElement)

        if (this.props.scrollElement) {
            this.props.scrollElement.addEventListener('scroll', handler)
            this.currentHandler = handler
        }

        this.setState({
            scrollable: this.props.scrollElement.offsetHeight < this.props.scrollElement.scrollHeight,
        })
    }

    render() {
        return (
            <>
                <div
                    ref={this.fadeElement}
                    className="scroll-fade"
                    style={{
                        background: getBackgroundGradient(this.state.scrollable ? 1 : 0),
                    }}
                />
                <style jsx={true}>{styles}</style>
            </>
        )
    }
}
