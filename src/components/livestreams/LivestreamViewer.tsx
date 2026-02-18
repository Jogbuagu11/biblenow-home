'use client';

import { useMemo } from 'react';
import { Livestream } from '@/shared/services/supabase';

interface LivestreamViewerProps {
  livestream: Livestream;
  onClose: () => void;
}

function getDisplayName(livestream: Livestream) {
  const vp = livestream.verified_profiles;
  if (!vp) return 'Streamer';
  if (vp.ministry_name && vp.ministry_name.trim()) return vp.ministry_name.trim();
  const full = `${vp.first_name ?? ''} ${vp.last_name ?? ''}`.trim();
  return full || 'Streamer';
}

export function LivestreamViewer({ livestream, onClose }: LivestreamViewerProps) {
  const title = livestream.title ?? 'Livestream';
  const hostName = getDisplayName(livestream);
  const room = livestream.room_name ?? livestream.id;

  const endstreamUrl = useMemo(() => {
    const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://biblenow.io').replace(/\/+$/, '');
    return `${base}/endstream`;
  }, []);

  return (
    <div className="fixed inset-0 z-[60]">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#140a05] shadow-2xl">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-white">
                {title}
              </div>
              <div className="truncate text-xs text-white/70">Hosted by {hostName}</div>
            </div>

            <div className="flex items-center gap-2">
              <a
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
                href={endstreamUrl}
                target="_blank"
                rel="noreferrer"
                title="Open end screen"
              >
                End screen
              </a>
              <button
                onClick={onClose}
                className="rounded-lg bg-[#E1AB31] px-3 py-2 text-xs font-bold text-black hover:brightness-95"
              >
                Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_320px]">
            <div className="relative aspect-video bg-black">
              {/* Placeholder viewer.
                 We are no longer using the self-hosted Jitsi server, and LiveKit playback
                 is not implemented in web here yet. */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                <div className="text-5xl">📺</div>
                <div className="mt-4 text-lg font-semibold text-white">Live stream</div>
                <div className="mt-2 text-sm text-white/70">
                  Room: <span className="font-mono">{room}</span>
                </div>
                <div className="mt-4 max-w-md text-sm text-white/60">
                  Web playback isn’t wired up yet in this app. View on mobile for LiveKit,
                  or connect a proper web player component here.
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 p-5 lg:border-l lg:border-t-0">
              <div className="text-sm font-semibold text-white">Details</div>
              <div className="mt-3 space-y-2 text-sm text-white/70">
                <div>
                  <span className="text-white/50">Viewers:</span> {livestream.viewer_count ?? 0}
                </div>
                <div>
                  <span className="text-white/50">Room name:</span>{' '}
                  <span className="font-mono text-xs">{livestream.room_name ?? '—'}</span>
                </div>
                <div>
                  <span className="text-white/50">Stream id:</span>{' '}
                  <span className="font-mono text-xs">{livestream.id}</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
                If you want this modal to actually play the LiveKit stream on web,
                tell me whether you want an embedded LiveKit web player or a link-out.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

