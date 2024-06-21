import axios, { AxiosError } from "axios";

const tokenUrl = "https://accounts.spotify.com/api/token";

export const getSpotifyToken = async () => {
  try {
    const response = await axios.post(
      tokenUrl,
      {
        grant_type: "client_credentials",
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        client_secret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(error);
  }
};

export const getPlaylist = async (playlistId: string, token: string) => {
  try {
    const response = await axios.get(
      `https://api.spotify.com/v1/playlists/${playlistId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
};
