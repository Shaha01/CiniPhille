import '@/assets/styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueLazyload from 'vue-lazyload'

import App from './App.vue'
import router from './router'
import errorImg from '@/assets/images/no-photo.jpg'

import BtnMore from '@/components/UI/BtnMore.vue'
import Loader from '@/components/UI/Loader.vue'
import Actors from '@/components/UI/Actors.vue'
import Trailer from '@/components/UI/Trailer.vue'

const app = createApp(App)

app.use(VueLazyload, {
  loading: errorImg,
  error: errorImg
})

app.use(createPinia())
app.use(router)

app.component('BtnMoreName', BtnMore)
app.component('Loader', Loader)
app.component('Actors', Actors)
app.component('Trailer', Trailer)

app.mount('#app')
