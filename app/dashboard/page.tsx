'use client'

import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import { BookmarkForm } from '@/components/BookmarkForm'
import { BookmarkList } from '@/components/BookmarkList'
import { AuthButton } from '@/components/AuthButton'
import { useEffect, useState } from 'react'

export default function Dashboard() {
    const [userId, setUserId] = useState<string | null>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                redirect('/')
            }
            setUserId(user.id)
        }
        checkUser()
    }, [])

    const handleBookmarkAdded = () => {
        // Trigger a refresh by changing the key
        setRefreshKey(prev => prev + 1)
    }

    if (!userId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="max-w-6xl mx-auto p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
                    <div>
                        <h1 className="text-3xl font-black text-white">
                            Smart <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Bookmarks</span>
                        </h1>
                        <p className="text-gray-300 mt-1">Manage your bookmarks with real-time sync</p>
                    </div>
                    <AuthButton />
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Add Bookmark Form */}
                    <div>
                        <BookmarkForm userId={userId} onBookmarkAdded={handleBookmarkAdded} />
                    </div>

                    {/* Bookmarks List */}
                    <div className="lg:col-span-1">
                        <BookmarkList userId={userId} key={refreshKey} />
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 text-sm text-purple-200">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>
                            <strong>Real-time sync enabled:</strong> Open this page in multiple tabs to see bookmarks update instantly across all of them!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
