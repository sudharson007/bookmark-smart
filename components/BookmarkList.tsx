'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

type Bookmark = {
    id: string
    url: string
    title: string
    created_at: string
}

export function BookmarkList({ userId }: { userId: string }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchBookmarks = async () => {
        const { data, error } = await supabase
            .from('bookmarks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching bookmarks:', error)
        } else {
            setBookmarks(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        // Fetch initial bookmarks
        fetchBookmarks()

        // Subscribe to real-time changes
        const channel = supabase
            .channel('bookmarks-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    console.log('Realtime event received:', payload.eventType, payload)
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((current) => [payload.new as Bookmark, ...current])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((current) =>
                            current.filter((bookmark) => bookmark.id !== payload.old.id)
                        )
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((current) =>
                            current.map((bookmark) =>
                                bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
                            )
                        )
                    }
                }
            )
            .subscribe((status) => {
                console.log('Realtime subscription status:', status)
                // If subscription fails, we'll rely on manual refresh
                if (status === 'CHANNEL_ERROR') {
                    console.warn('Realtime subscription failed. Using manual refresh fallback.')
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, supabase])

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)

        if (error) {
            console.error('Error deleting bookmark:', error)
            alert('Failed to delete bookmark')
        } else {
            // Immediately update UI by removing the bookmark from state
            setBookmarks((current) => current.filter((bookmark) => bookmark.id !== id))
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">No bookmarks yet</h3>
                <p className="mt-1 text-sm text-gray-400">Get started by adding your first bookmark above.</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white mb-4">
                Your Bookmarks ({bookmarks.length})
            </h2>
            {bookmarks.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="group bg-white/10 backdrop-blur-lg p-5 rounded-xl shadow-lg border border-white/20 hover:bg-white/15 transition-all duration-200"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white mb-1 truncate">
                                {bookmark.title}
                            </h3>
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-purple-300 hover:text-purple-200 truncate block transition-colors"
                            >
                                {bookmark.url}
                            </a>
                            <p className="text-xs text-gray-400 mt-2">
                                Added {new Date(bookmark.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={bookmark.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-200"
                                title="Open bookmark"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                            <button
                                onClick={() => handleDelete(bookmark.id)}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-200"
                                title="Delete bookmark"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
