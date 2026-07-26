export default function AccessDenied() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="p-10 rounded text-center max-w-xl">
                <p className="text-gray-700">
                    Not authorized
                </p>
            </div>
        </div>
    );
}
