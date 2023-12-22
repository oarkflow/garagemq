import React from "react";
import { FieldError } from "react-hook-form";

type PropsToOmit<P> = keyof P;

// This is the first reusable type utility we built
type PolymorphicComponentProp<
    T extends React.ElementType,
    Props = {}
> = React.PropsWithChildren<Props> &
    Omit<React.ComponentPropsWithoutRef<T>, PropsToOmit<T>>;

// This is a new type utitlity with ref!
type PolymorphicComponentPropWithRef<
    T extends React.ElementType,
    Props = {}
> = PolymorphicComponentProp<T, Props> & { ref?: PolymorphicRef<T> };

// This is the type for the "ref" only
type PolymorphicRef<T extends React.ElementType> =
    React.ComponentPropsWithRef<T>["ref"];

/**
 * This is the updated component props using PolymorphicComponentPropWithRef
 */
type InputProps<T extends React.ElementType> = PolymorphicComponentPropWithRef<
    T,
    {
        name: string;
        type: string;
        label: string;
        value?: string;
        required?: boolean;
        variant?: boolean;
        placeholder?: string;
        disabled?: boolean;
        inline?: boolean;
        error?: FieldError | undefined;
        helperText?: string
    }
>;

/**
 * This is the type used in the type annotation for the component
 */
type InputComponent = <T extends React.ElementType = "input">(
    props: InputProps<T>
) => React.ReactElement | null;

export const Input: InputComponent = React.forwardRef(
    <T extends React.ElementType = "input">(
        {
            name,
            label,
            disabled = false,
            type = "text",
            // value = '',
            required = false,
            helperText = '',
            error,
            variant = false,
            placeholder = "",
            inline = false,
            ...props
        }: InputProps<T>,
        ref?: PolymorphicRef<T>
    ) => {
        return (
            <fieldset disabled={disabled} className={`${inline ? 'grid grid-cols-2 gap-2': ''}`}>
                <label htmlFor={name} className="block whitespace-nowrap text-sm text-gray-600">
                    {label} {required && <span>
                        <span className="text-red-500 font-black">*</span>
                        {helperText && <small className="">{helperText}</small>}
                    </span>
                    }
                </label>
                <div className="relative">
                    <input type={type} id={name} name={name} disabled={disabled} ref={ref} placeholder={placeholder} aria-describedby={`${name}-error`}
                        className={`"block w-full rounded-md py-3 px-4 text-sm ${variant && "bg-gray-50"
                            } ${error
                                ? "border-1 border-red-300"
                                : "border-gray-200 focus:border-blue-500  focus:ring-blue-500"
                            }"`} {...props}/>
                    <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center pr-3">
                        <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                        </svg>
                    </div>
                    {error && <span className={`mt-2 text-xs text-red-600`}>{error?.message || "Required Field"}</span>}
                </div>
            </fieldset>
        );
    }
);
