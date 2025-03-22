import { CircularProgress } from "@heroui/react"

const Loader = () => {
    return (
        <div
            className="absolute inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
        >
            <CircularProgress size="lg" aria-label="Loading..." />
        </div>
    )
}

export default Loader