const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "2dca580c2a14b55200e784d157207b4d";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p";

export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  popularity: number;
  original_language: string;
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  "watch/providers"?: {
    results: Record<string, ProviderResult>;
  };
};

export type Cast = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type Crew = {
  id: number;
  name: string;
  job: string;
  department: string;
};

export type Provider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

export type ProviderResult = {
  link: string;
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
};

export type Genre = {
  id: number;
  name: string;
};

export type MovieResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchTMDB<T>(endpoint: string, params: Record<string, string> = {}, retries = 3): Promise<T> {
  const query = new URLSearchParams({ api_key: TMDB_API_KEY, ...params });
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}?${query}`, { next: { revalidate: 3600 } });
      if (!res.ok) throw new Error(`TMDB Error: ${res.status}`);
      return await res.json() as T;
    } catch (error) {
      if (attempt === retries) throw error;
      console.warn(`TMDB fetch failed (attempt ${attempt + 1}/${retries + 1}). Retrying in 500ms...`);
      await wait(500); // Wait 500ms before retrying
    }
  }
  throw new Error("TMDB fetch failed after retries.");
}

export const getTrending = (timeWindow: "day" | "week" = "week") =>
  fetchTMDB<MovieResponse>(`/trending/movie/${timeWindow}`);

export const getNowPlaying = () =>
  fetchTMDB<MovieResponse>("/movie/now_playing");

export const getPopular = (page = "1") =>
  fetchTMDB<MovieResponse>("/movie/popular", { page });

export const getTopRated = () =>
  fetchTMDB<MovieResponse>("/movie/top_rated");

export const getUpcoming = () =>
  fetchTMDB<MovieResponse>("/movie/upcoming");

export const searchMovies = (query: string, page = "1") =>
  fetchTMDB<MovieResponse>("/search/movie", { query, page });

export const getMovieDetails = (id: number) =>
  fetchTMDB<Movie>(`/movie/${id}`, { append_to_response: "videos,credits,watch/providers" });

export const getCollection = (id: number) =>
  fetchTMDB<any>(`/collection/${id}`);

export const getTollywoodMovies = (page = "1") =>
  fetchTMDB<MovieResponse>("/discover/movie", {
    with_original_language: "te",
    sort_by: "popularity.desc",
    page,
  });

export const getMarvelMovies = (page = "1") =>
  fetchTMDB<MovieResponse>("/discover/movie", {
    with_companies: "420", // Marvel Studios
    sort_by: "popularity.desc",
    page,
  });

export const getDCMovies = (page = "1") =>
  fetchTMDB<MovieResponse>("/discover/movie", {
    with_companies: "429", // DC Comics
    sort_by: "popularity.desc",
    page,
  });

export const getMoviesByGenre = (genreId: number, page = "1") =>
  fetchTMDB<MovieResponse>("/discover/movie", {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
    page,
  });

export const getGenres = () =>
  fetchTMDB<{ genres: Genre[] }>("/genre/movie/list");

export const posterUrl = (path: string | null, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500") =>
  path ? `${IMG_BASE}/${size}${path}` : "/placeholder-poster.svg";

export const backdropUrl = (path: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export const formatRating = (r: number) => r.toFixed(1);

export const formatYear = (date: string) => date?.slice(0, 4) ?? "—";

export const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};
