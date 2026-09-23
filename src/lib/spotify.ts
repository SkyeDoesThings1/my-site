let cachedAccessToken: string | null = null;
let tokenExpirationTime = 0;
let refreshPromise: Promise<string> | null = null;

let cachedRecentlyPlayed: RecentlyPlayed | null = null;
let recentlyPlayedExpirationTime = 0;
let recentlyPlayedPromise: Promise<RecentlyPlayed> | null = null;

async function getAccessToken(): Promise<string> {
    const now = Date.now();

    if (cachedAccessToken && now < tokenExpirationTime) {
        return cachedAccessToken;
    }

    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const auth = Buffer.from(`${import.meta.env.SPOTIFY_CLIENT_ID}:${import.meta.env.SPOTIFY_CLIENT_SECRET}`).toString("base64");

            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${auth}`,
                },
                body: new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: import.meta.env.SPOTIFY_REFRESH_TOKEN,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Failed to refresh Spotify token: ${JSON.stringify(data)}`);
            }

            cachedAccessToken = data.access_token;

            // Refresh 5 minutes before Spotify's expiry.
            tokenExpirationTime = Date.now() + Math.max(data.expires_in - 300, 0) * 1000;

            return data.access_token;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

type RecentlyPlayed = {
    items: {
        track: {
            name: string;
            artists: {
                name: string;
            }[];
            album: {
                images: {
                    url: string;
                }[];
            };
            external_urls: {
                spotify: string;
            };
        };
    }[];
};

export async function getRecentlyPlayed(limit = 10): Promise<RecentlyPlayed> {
    const now = Date.now();

    // Return cached Spotify response.
    if (cachedRecentlyPlayed !== null && now < recentlyPlayedExpirationTime) {
        return cachedRecentlyPlayed;
    }

    // If another request is already fetching it, wait for that request.
    if (recentlyPlayedPromise) {
        return recentlyPlayedPromise;
    }

    recentlyPlayedPromise = (async () => {
        try {
            const accessToken = await getAccessToken();

            const response = await fetch(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Spotify API error: ${response.status} ${JSON.stringify(data)}`);
            }

            cachedRecentlyPlayed = data;

            // Cache for 60 seconds.
            recentlyPlayedExpirationTime = Date.now() + 60_000;

            return data;
        } finally {
            recentlyPlayedPromise = null;
        }
    })();

    return recentlyPlayedPromise;
}
