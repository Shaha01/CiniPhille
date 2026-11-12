import axios from "axios";
import { defineStore } from "pinia";
import { apiKey } from "@/apiUrl.js";
import { useSettings } from "@/stores/settings.js";

export const usePopular = defineStore('popular', {
    state: () => ({
        url: 'https://api.themoviedb.org/3/',
        popularMovies: null,
        popularTvs: null,
        genresMovie: [],
        genresTv: [],
        error: false
    }),
    actions: {
        async getPopular({ type, page = 1 }) {
            const settings = useSettings();
            this.error = false;
            try {
                const res = await axios.get(
                    `${this.url}${type}/popular?api_key=${apiKey}&language=${settings.lang}&page=${page}`
                );
                if (type === 'movie') {
                    this.popularMovies = res.data.results;
                } else if (type === 'tv') {
                    this.popularTvs = res.data.results;
                }
                return res.data.results || [];
            } catch (error) {
                this.error = true;
                console.error("An error occurred while retrieving popular information." + error);
                return [];
            }
        },
        async getGenres(type) {
            const settings = useSettings();
            try {
                const res = await axios.get(
                    `${this.url}genre/${type}/list?api_key=${apiKey}&language=${settings.lang}`
                );
                if (type === 'movie') {
                    this.genresMovie = res.data.genres || [];
                } else if (type === 'tv') {
                    this.genresTv = res.data.genres || [];
                }
            } catch (error) {
                console.error("Error loading genres:", error);
            }
        },
        async discoverContent({ type, page = 1, genre = '', year = '', sortBy = 'popularity.desc' }) {
            const settings = useSettings();
            this.error = false;
            try {
                const params = new URLSearchParams({
                    api_key: apiKey,
                    language: settings.lang,
                    page: String(page),
                    sort_by: sortBy,
                    'vote_count.gte': sortBy === 'vote_average.desc' ? '200' : '10'
                });
                if (genre) params.set('with_genres', String(genre));
                if (year) {
                    if (type === 'movie') {
                        params.set('primary_release_year', String(year));
                    } else {
                        params.set('first_air_date_year', String(year));
                    }
                }
                const res = await axios.get(`${this.url}discover/${type}?${params.toString()}`);
                return res.data.results || [];
            } catch (error) {
                this.error = true;
                console.error("Error discovering content:", error);
                return [];
            }
        }
    }
});
