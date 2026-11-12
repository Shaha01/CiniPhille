import axios from "axios";
import { apiKey } from "@/apiUrl.js";
import { defineStore } from "pinia";
import { useSettings } from "@/stores/settings.js";

export const useTop = defineStore('top', {
    state: () => ({
        url: 'https://api.themoviedb.org/3/movie/',
        top: null,
        error: false
    }),
    actions: {
        async getTop() {
            const settings = useSettings();
            this.error = false;
            try {
                const response = await axios.get(`${this.url}top_rated?api_key=${apiKey}&language=${settings.lang}`);
                this.top = response.data.results;
            } catch (error) {
                this.error = true;
                console.error("Error while retrieving top movies: " + error.message);
            }
        }
    }
});
