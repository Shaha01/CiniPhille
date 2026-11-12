import axios from "axios";
import { defineStore } from "pinia";
import { apiKey } from "@/apiUrl.js";
import { useSettings } from "@/stores/settings.js";

export const useRec = defineStore('rec', {
    state: () => ({
        url: 'https://api.themoviedb.org/3/',
        recomMovie: null,
        recomTv: null
    }),
    actions: {
        async getRecom({ type, id }) {
            const settings = useSettings();
            try {
                const res = await axios.get(
                    `${this.url}${type}/${id}/recommendations?api_key=${apiKey}&language=${settings.lang}`
                );
                if (type === 'movie') {
                    this.recomMovie = res.data.results;
                } else if (type === 'tv') {
                    this.recomTv = res.data.results;
                }
            } catch (error) {
                console.error("An error occurred while retrieving recommendations." + error);
            }
        }
    }
});
