import { useState, useEffect } from 'react';

export const useIsIconOnly = () => {
    // true si < 1024px, false si >= 1024px
    const [isIconOnly, setIsIconOnly] = useState(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        return !mq.matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');

        const handleChange = e => {
            // e.matches === true cuando >=1024px → isIconOnly = false
            setIsIconOnly(!e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isIconOnly;
};

export const useIsIconOnlySmall = () => {
    const [isIconOnlySmall, setIsIconOnlySmall] = useState(() => {
        // matchMedia con min-width: 640px (tailwind 'sm')
        const mq = window.matchMedia('(min-width: 400px)');
        // si mq.matches es true (>=640px) → no icon-only → invertimos
        return !mq.matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 400px)');

        const handleChange = (e) => {
        // e.matches === true cuando >=640px → isIconOnly = false
        setIsIconOnlySmall(!e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isIconOnlySmall;
};


export const useIsIconOnlySmallMedium = () => {
    const [isIconOnlySmall, setIsIconOnlySmall] = useState(() => {
        // matchMedia con min-width: 640px (tailwind 'sm')
        const mq = window.matchMedia('(min-width: 640px)');
        // si mq.matches es true (>=640px) → no icon-only → invertimos
        return !mq.matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 640px)');

        const handleChange = (e) => {
        // e.matches === true cuando >=640px → isIconOnly = false
        setIsIconOnlySmall(!e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isIconOnlySmall;
};

export const useIsIconOnlyMedium = () => {
    const [isIconOnlySmall, setIsIconOnlySmall] = useState(() => {
        // matchMedia con min-width: 640px (tailwind 'sm')
        const mq = window.matchMedia('(min-width: 768px)');
        // si mq.matches es true (>=640px) → no icon-only → invertimos
        return !mq.matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');

        const handleChange = (e) => {
        // e.matches === true cuando >=640px → isIconOnly = false
        setIsIconOnlySmall(!e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isIconOnlySmall;
};

export const useIsIconOnlyXL = () => {
    const [isIconOnlySmall, setIsIconOnlySmall] = useState(() => {
        // matchMedia con min-width: 640px (tailwind 'sm')
        const mq = window.matchMedia('(min-width: 1280px)');
        // si mq.matches es true (>=640px) → no icon-only → invertimos
        return !mq.matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1280px)');

        const handleChange = (e) => {
        // e.matches === true cuando >=640px → isIconOnly = false
        setIsIconOnlySmall(!e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    return isIconOnlySmall;
};