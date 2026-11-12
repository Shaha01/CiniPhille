import axios from "axios";
import { defineStore } from "pinia";
import { apiKey } from "@/apiUrl.js";
import { useSettings } from "@/stores/settings.js";

export const useActors = defineStore('actors', {
    state: () => ({
        url: 'https://api.themoviedb.org/3/',
        actorsMovie: null,
        actorsTv: null
    }),
    actions: {
        async getActors({ type, id }) {
            const settings = useSettings();
            try {
                const res = await axios.get(
                    `${this.url}${type}/${id}/credits?api_key=${apiKey}&language=${settings.lang}`
                );
                if (type === 'movie') {
                    this.actorsMovie = res.data.cast;
                } else if (type === 'tv') {
                    this.actorsTv = res.data.cast;
                }
            } catch (error) {
                console.error("An error occurred while retrieving information about the actors." + error);
            }
        }
    }
});
