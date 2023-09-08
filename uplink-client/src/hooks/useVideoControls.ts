import { useEffect, useRef } from "react";

// expose callbacks for video element events

interface VideoControlsProps {
    onMute?: (event: Event) => any;
    onSeek?: (event: Event) => any;
    onTimeToggle?: (event: Event) => any;
}
const useVideoControls = ({ onMute, onSeek, onTimeToggle }: VideoControlsProps) => {
    const muteButtonRef = useRef<HTMLElement | null>(null);
    const seekRef = useRef<HTMLInputElement | null>(null);
    const timeRef = useRef<HTMLSpanElement | null>(null);

    const handleMuteButtonClick = (e: Event) => {
        if (onMute) {
            onMute(e);
        }
    };

    const handleSeekClick = (e: Event) => {
        if (onSeek) {
            onSeek(e);
        }
    }

    const handleTimeClick = (e: Event) => {
        if (onTimeToggle) {
            onTimeToggle(e);
        }
    }

    useEffect(() => {

        const muteButtonElem = muteButtonRef.current;
        const seekElem = seekRef.current;
        const timeElem = timeRef.current;

        if (muteButtonElem) muteButtonElem.addEventListener("click", handleMuteButtonClick);
        if (seekElem) seekElem.addEventListener("click", handleSeekClick);
        if (timeElem) timeElem.addEventListener("click", handleTimeClick);

        // Cleanup on unmount
        return () => {
            if (muteButtonElem) {
                muteButtonElem.removeEventListener("click", handleMuteButtonClick);
            }
            if (seekElem) {
                seekElem.removeEventListener("click", handleSeekClick);
            }
            if (timeElem) {
                timeElem.removeEventListener("click", handleTimeClick);
            }
        };
    }, [onMute, onSeek, onTimeToggle]);

    return {
        muteButtonRef,
        seekRef,
        timeRef,
    };
};



export default useVideoControls;