import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/views/HomePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    { path: '/', name: 'home', component: HomePage, meta: { title: 'CiniPhile' } },
    { path: '/movie', name: 'movie', component: () => import('@/views/MoviesPage.vue'), meta: { title: 'Films — CiniPhile' } },
    { path: '/tv', name: 'tv', component: () => import('@/views/TvsPage.vue'), meta: { title: 'Serials — CiniPhile' } },
    { path: '/favorites', name: 'favorites', component: () => import('@/views/FavoritesPage.vue'), meta: { title: 'Favorites — CiniPhile' } },
    { path: '/search', name: 'search', component: () => import('@/views/SearchPage.vue'), meta: { title: 'Search — CiniPhile' } },
    { path: '/movie/:id', name: 'moviePage', component: () => import('@/views/MoviePage.vue') },
    { path: '/tv/:id', name: 'tvPage', component: () => import('@/views/TvPage.vue') },
    { path: '/person/:id', name: 'personPage', component: () => import('@/views/PersonPage.vue') },
    { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import('@/views/NotFoundPage.vue'), meta: { title: '404 — CiniPhile' } }
  ],

  scrollBehavior() {
    return {
      top: 0
    }
  }
})

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  }
})

export default router
