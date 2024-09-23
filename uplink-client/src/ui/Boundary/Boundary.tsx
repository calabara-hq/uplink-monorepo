import clsx from 'clsx';
import React from 'react';

const Label = ({
    children,
    animateRerendering,
    color,
}: {
    children: React.ReactNode;
    animateRerendering?: boolean;
    color?: 'default' | 'pink' | 'blue' | 'violet' | 'cyan' | 'orange';
}) => {
    return (
        <div
            className={clsx('rounded-full px-1.5 shadow-[0_0_1px_3px_bg-base]', {
                'bg-base-100 text-gray-300': color === 'default',
                'bg-pink-700 text-white': color === 'pink',
                'bg-blue-700 text-white': color === 'blue',
                'bg-cyan-700 text-white': color === 'cyan',
                'bg-violet-700 text-violet-100': color === 'violet',
                'bg-orange-700 text-white': color === 'orange',
                'animate-[highlight_1s_ease-in-out_1]': animateRerendering,
            })}
        >
            {children}
        </div>
    );
};
export const Boundary = ({
    children,
    labels = [],
    size = 'default',
    color = 'default',
    animateRerendering = true,
}: {
    children: React.ReactNode;
    labels?: string[];
    size?: 'small' | 'default';
    color?: 'default' | 'pink' | 'blue' | 'violet' | 'cyan' | 'orange';
    animateRerendering?: boolean;
}) => {
    return (
        <div
            className={clsx('relative rounded-lg border border-dashed', {
                'p-3 lg:p-5': size === 'small',
                'p-4 lg:p-9': size === 'default',
                'border-base-200': color === 'default',
                'border-pink-700': color === 'pink',
                'border-blue-700': color === 'blue',
                'border-cyan-700': color === 'cyan',
                'border-violet-700': color === 'violet',
                'border-orange-700': color === 'orange',
                'text-vercel-pink animate-[rerender_1s_ease-in-out_1]':
                    animateRerendering,
            })}
        >
            <div
                className={clsx(
                    'absolute -top-2.5 flex gap-x-1 text-[9px] uppercase leading-4 tracking-widest',
                    {
                        'left-3 lg:left-5': size === 'small',
                        'left-4 lg:left-9': size === 'default',
                    },
                )}
            >
                {labels.map((label) => {
                    return (
                        <Label
                            key={label}
                            color={color}
                            animateRerendering={animateRerendering}
                        >
                            {label}
                        </Label>
                    );
                })}
            </div>

            {children}
        </div>
    );
};