import React, {useState, useEffect} from 'react';
import Lottie from "react-lottie";
import * as legoData from "./lego-loader";
import * as doneData from "./done-loader";
import "bootstrap/dist/css/bootstrap.css";
import './loading.css';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: legoData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};
const defaultOptions2 = {
    loop: false,
    autoplay: true,
    animationData: doneData.default,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};

const LoadingScreen = function ({minLoadingTime, ready, onAnimationFinished}) {
    const [loading, setLoading] = useState(true);
    const [done, setDone] = useState(false);

    useEffect( () => {
        setTimeout(() => {
            setLoading(false);
        }, minLoadingTime);
    },[]);
    useEffect( () => {
        if(!loading){
            if(onAnimationFinished){
                setTimeout(() => {
                    setDone(true);
                }, 1000);
            }
        }
    },[loading, onAnimationFinished]);
    useEffect( () => {
        if(done && ready && onAnimationFinished){
            onAnimationFinished();
        }
    }, [done, ready]);

    return (
        <div className="loading-container">
            <div className="loading-indicator">
                <div className="d-flex justify-content-center align-items-center">
                    <h1 className="loading-message">Building your context</h1>
                    {loading ?
                        <Lottie options={defaultOptions} height={120} width={120} />
                    :
                        <Lottie options={defaultOptions2} height={120} width={120} />
                    }
                </div>
            </div>
        </div>
    )
};

export default LoadingScreen;