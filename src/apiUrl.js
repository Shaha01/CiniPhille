import errorImg from '@/assets/images/no-photo.jpg'

export const apiKey = import.meta.env.VITE_TMDB_API_KEY || 'f13510ec85b25f11273708dcca0c1d86'
export const imgUrlFull = 'https://image.tmdb.org/t/p/original'
export const imgUrl = 'https://image.tmdb.org/t/p/w500'

export const getImageUrl = (path, full = true) => {
  if (!path) return errorImg
  return (full ? imgUrlFull : imgUrl) + path
}
