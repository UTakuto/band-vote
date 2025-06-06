export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-700"></div>
                <p className="text-gray-600 text-lg font-medium">読み込み中...</p>
            </div>
        </div>
    );
}
