import React from 'react'
import { cn } from '@/utils/helper'

export type DividerProps = {
    text?: string
    containerClassName?: string
    lineClassName?: string
    className?: string
}

export default function Divider({ text, containerClassName, lineClassName, className }: DividerProps) {
    return (
        <div className={cn('my-4 flex items-center justify-between gap-2', containerClassName)}>
            <span className={cn('h-[2px] w-full rounded-full bg-slate-500', lineClassName)} />
            <span className={cn('w-64 break-normal text-center text-sm leading-5', className)}>{text}</span>
            <span className={cn('h-[2px] w-full rounded-full bg-slate-500', lineClassName)} />
        </div>
    )
}
