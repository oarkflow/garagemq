import React from 'react'

type Props = {
    indeterminate?: boolean
} & React.HTMLProps<HTMLInputElement>

function Checkbox({
                      indeterminate,
                      className = '',
                      ...rest
                  }: Props) {
    const ref = React.useRef<HTMLInputElement>(null!)

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate
        }
    }, [ref, indeterminate])

    return (
        <input
            type="checkbox"
            ref={ref}
            className={className + ' cursor-pointer w-4 h-4  accent-gray-700  rounded'}
            {...rest}
        />
    )
}

export default Checkbox
