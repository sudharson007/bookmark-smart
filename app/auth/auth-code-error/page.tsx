export default function AuthError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 max-w-md">
                <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
                <p className="text-gray-300 mb-6">
                    There was an error during authentication. Please try again.
                </p>
                <a
                    href="/"
                    className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
                >
                    Return Home
                </a>
            </div>
        </div>
    )
}
