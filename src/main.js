import '@/assets/styles/settings/common.scss';
import '@/assets/styles/main.scss'

// Componentlar uchun SCSS
import '@/components/Catalog/Catalog.scss';
import '@/components/InfoBox/InfoBox.scss';
import '@/components/MAT/Mat.scss';
import '@/components/Navbar/Navbar.scss';
import '@/components/Search/Search.scss';
import '@/components/Top/Top.scss';
import '@/components/Upcoming/Upcoming.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload';

const app = createApp(App)

import errorImg from '@/assets/images/no-photo.jpg';

app.use(VueLazyload, {
    loading: errorImg, // Yuklash holatida ishlatiladigan tasvir
    error: errorImg,   // Xato holatida ishlatiladigan tasvir
});

app.use(createPinia())
app.use(router)

// Registration of global components

import BtnMore from "@/components/UI/BtnMore.vue";
import Loader from '@/components/UI/Loader.vue';
import Actors from "@/components/UI/Actors.vue";
import Trailer from "@/components/UI/Trailer.vue";

app.component('BtnMoreName', BtnMore)
app.component('Loader', Loader)
app.component('Actors', Actors)
app.component('Trailer', Trailer)

app.mount('#app')
