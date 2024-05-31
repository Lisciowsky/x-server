import { useEffect, useState } from "react";

function useFancyText(text?: string) {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (text) {
            if (index < text.length) {
                const timer = setTimeout(() => {
                    setDisplayedText((prev) => prev + text[index]);
                    setIndex((prev) => prev + 1);
                }, 150);
    
                return () => clearTimeout(timer);
            }
        }
    }, [index, text]);

    return displayedText;
}

export default useFancyText;
