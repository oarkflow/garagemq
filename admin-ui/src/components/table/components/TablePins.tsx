import React from 'react'
import {BiChevronLeft, BiChevronRight} from "react-icons/bi";
import {TbEqual} from "react-icons/tb";
import {ColumnPinningPosition} from "@tanstack/table-core";

type Props = {
    isPinned: ColumnPinningPosition
    pin: (position: ColumnPinningPosition) => void
}

export const TablePins: React.FC<Props> = ({isPinned, pin}) => {
    const pinLeft = () => pin('left')
    const unPin = () => pin(false)
    const pinRight = () => pin('right')

    return (
        <div className="flex gap-1 justify-center">
            {isPinned !== 'left' ? (
                <button className="border rounded px-2" onClick={pinLeft}>
                    <BiChevronLeft className="h-5 w-5"/>
                </button>
            ) : null}
            {isPinned ? (
                <button className="border rounded px-2" onClick={unPin}>
                    <TbEqual className="h-5 w-5"/>
                </button>
            ) : null}
            {isPinned !== 'right' ? (
                <button className="border rounded px-2" onClick={pinRight}>
                    <BiChevronRight className="h-5 w-5"/>
                </button>
            ) : null}
        </div>
    )
}

export default TablePins
