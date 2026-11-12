import axios from "axios";
import { apiKey } from "@/apiUrl.js";
import { defineStore } from "pinia";
import { useSettings } from "@/stores/settings.js";

export const useSearch = defineStore('search', {
    state: () => ({
        url: 'https://api.themoviedb.org/3',
        result: null,
        loading: false,
        error: false
    }),
    actions: {
        async searching(text) {
            if (!text || !text.trim()) {
                this.result = null;
                this.loading = false;
                return;
            }
            const settings = useSettings();
            this.loading = true;
            this.error = false;
            try {
                const response = await axios.get(
                    `${this.url}/search/multi?api_key=${apiKey}&language=${settings.lang}&query=${encodeURIComponent(text)}`
                );
                this.result = (response.data.results || []).filter(
                    (item) => item.media_type === 'movie' || item.media_type === 'tv'
                );
            } catch (error) {
                this.error = true;
                console.error("Error while searching: " + error.message);
            } finally {
                this.loading = false;
            }
        }
    }
});
