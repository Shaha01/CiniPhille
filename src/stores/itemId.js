import axios from "axios";
import { defineStore } from "pinia";
import { apiKey } from "@/apiUrl.js";
import { useSettings } from "@/stores/settings.js";

export const useItemId = defineStore('itemId', {
    state: () => ({
        url: 'https://api.themoviedb.org/3/',
        movie: null,
        tv: null,
        error: false
    }),
    actions: {
        async getItemId({ type, id }) {
            const settings = useSettings();
            this.error = false;
            try {
                const res = await axios.get(`${this.url}${type}/${id}?api_key=${apiKey}&language=${settings.lang}`);
                if (type === 'movie') {
                    this.movie = res.data;
                } else if (type === 'tv') {
                    this.tv = res.data;
                }
            } catch (error) {
                this.error = true;
                console.error("An error occurred while retrieving information by ID." + error);
            }
        }
    }
});
