// The MIT License (MIT)

// Copyright (c) 2020 Julien CARON

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

"use client";
import { useCallback, useEffect, useRef } from 'react'

export function useEventCallback<Args extends unknown[], R>(
    fn: (...args: Args) => R,
) {
    const ref = useRef<typeof fn>(() => {
        throw new Error('Cannot call an event handler while rendering.')
    })

    useEffect(() => {
        ref.current = fn
    }, [fn])

    return useCallback((...args: Args) => ref.current(...args), [ref])
}