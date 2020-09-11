import React, { createRef } from "react";
import { object } from "prop-types";
import styles, {fadeTransparentPercentage, fadeWhitePercentage} from "./styles";
import { throttle } from 'lodash';

const easeIn = (t, alpha, reverseDirection = false) =>{
    const y = Math.pow(t, alpha)
    return reverseDirection ? 1 - y : y;
} 

const getBackgroundGradient = (overalOpacity) => `linear-gradient(0deg, rgba(255, 255, 255) ${fadeWhitePercentage * overalOpacity}%, rgba(255, 255, 255, 0) ${fadeTransparentPercentage * overalOpacity}%)`;

export class ScrollFade extends React.Component {

    constructor(props) {
        super(props);

        this.fadeElement = createRef();
        this.state = {
            scrollable: false
        }
    }

    getScrollHandler(fadeElement) {
        return throttle((e) => {
            if(fadeElement.current){
                const {offsetHeight, scrollTop, scrollHeight} = e.target;
                const opacity = easeIn(Math.min(1, scrollTop / (scrollHeight - offsetHeight)), 10, true);
                // applying change directly for performance
                fadeElement.current.style.background = getBackgroundGradient(opacity);
            }
        }, 100);
    }
    

    componentDidUpdate() {
        const handler = this.getScrollHandler(this.fadeElement);

        if(this.props.scrollElement) {
            this.props.scrollElement.removeEventListener("scroll", this.currentHandler);
            this.props.scrollElement.addEventListener("scroll", handler);
            this.currentHandler = handler;
        } 
    }

    componentDidMount() {
        const handler = this.getScrollHandler(this.fadeElement);

        if(this.props.scrollElement) {
            this.props.scrollElement.addEventListener("scroll", handler);
            this.currentHandler = handler;
        }

        this.setState({
            scrollable: this.props.scrollElement.offsetHeight < this.props.scrollElement.scrollHeight
        })
    }

    render() {
        return (
            <>
                <div ref={this.fadeElement} className="scroll-fade" style={{
                    background: getBackgroundGradient(this.state.scrollable ? 1 : 0)
                }} />
                <style jsx>{styles}</style>
            </>
        )
    }
}


ScrollFade.propTypes = {
    scrollElement: object.isRequired
}
