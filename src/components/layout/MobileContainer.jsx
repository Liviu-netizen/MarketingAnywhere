export default function MobileContainer({ children, className = '' }) {
    return (
        <div className={`relative min-h-screen w-full max-w-md mx-auto overflow-x-hidden flex flex-col pb-20 ${className}`}>
            {children}
        </div>
    )
}
