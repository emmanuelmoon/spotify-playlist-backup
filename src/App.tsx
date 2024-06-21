import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getPlaylist, getSpotifyToken } from "./services/spotifyService";
import Alert from "@mui/material/Alert";
import "./App.css";
import CsvDownload from "react-json-to-csv";
import { Button, TextField } from "@mui/material";
import { AxiosError } from "axios";
// const createColor = (mainColor: string) =>
//   augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  palette: {
    primary: {
      main: "#1DB954",
    },
  },
});

type Artist = {
  name: string;
};
type item = {
  track: {
    name: string;
    artists: Artist[];
    external_urls: {
      spotify: string;
    };
  };
};

type Tracks = {
  items: item[];
};

function App() {
  const [token, setToken] = useState<string>("");
  const [playlistId, setPlaylistId] = useState<string>("");
  const [playlist, setPlaylist] = useState<{
    description: string;
    name: string;
    tracks: Tracks;
  } | null>(null);
  useEffect(() => {
    getSpotifyToken().then((t) => {
      setToken(t);
    });
  });
  const [error, setError] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setPlaylistId(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = await getPlaylist(playlistId, token);
      setPlaylist(data);
    } catch (error) {
      if ((error as AxiosError).response?.status === 400) {
        setError("Playlist not found. Enter a valid playlist id.");
      }
    }
  };
  if (playlist === null) {
    return (
      <div>
        {error !== "" ? <Alert severity="info">{error}</Alert> : null}
        <h1>Backup public Spotify playlists</h1>
        <ThemeProvider theme={theme}>
          <form onSubmit={handleSubmit} className="App">
            <TextField
              id="standard-basic"
              label="Enter Playlist Id"
              variant="standard"
              value={playlistId}
              onChange={handleChange}
            />
            <Button type="submit">Backup</Button>
          </form>
        </ThemeProvider>
      </div>
    );
  }
  const trimmedPlaylist = playlist.tracks.items.map((item) => {
    return {
      name: item.track.name,
      artists: item.track.artists.map((artist) => artist.name).join(", "),
      url: item.track.external_urls.spotify,
    };
  });
  return (
    <CsvDownload
      style={{ color: "#1DB954" }}
      data={trimmedPlaylist}
      filename={`${playlist.name}.csv`}
    />
  );
}

export default App;
