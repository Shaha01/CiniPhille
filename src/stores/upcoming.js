import axios from "axios";
import { apiKey } from "@/apiUrl.js";
import { defineStore } from "pinia";
import { useSettings } from "@/stores/settings.js";

export const useUpcoming = defineStore('upcoming', {
    state: () => ({
        url: 'https://api.themoviedb.org/3/movie/upcoming',
        upcoming: null,
        error: false
    }),
    actions: {
        async getUpcoming() {
            const settings = useSettings();
            this.error = false;
            try {
                const response = await axios.get(`${this.url}?api_key=${apiKey}&language=${settings.lang}`);
                this.upcoming = response.data.results;
            } catch (error) {
                this.error = true;
                console.error("Error while retrieving upcoming movies: " + error.message);
            }
        }
    }
});
