import React from 'react'

type Props = {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

export const DebouncedTextarea: React.FC<Props> = ({value: initialValue, onChange, debounce = 300, ...props}) => {
    const [value, setValue] = React.useState<number | string>(initialValue)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value)
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (onChange) {
                onChange(value)
            }
        }, debounce)
        return () => clearTimeout(timeout)
    }, [value])
    return <textarea {...props} value={value} onChange={handleInputChange}/>
}

export default DebouncedTextarea
