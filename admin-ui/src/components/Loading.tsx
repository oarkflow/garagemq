export const Loading = (props) => {
    let height = props.height || "h-full"
    let overlay = props.overlay || true
    let backgroundColor = props.bgColor || 'bg-transparent'
    return (
        <>
            <div className={`relative flex justify-center items-center ${backgroundColor} ${height}`}>
                <div
                    className={`z-20 ${backgroundColor} top-0 ${overlay ? "absolute flex justify-center items-center w-full h-full top-0" : ''}`}>
                    <div className="loader p-3 rounded-full flex space-x-2">
                        <div className="w-3 h-3 bg-green-300 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-blue-700 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        </>
    )
}