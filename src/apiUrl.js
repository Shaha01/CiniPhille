import errorImg from '@/assets/images/no-photo.jpg'

export const apiKey = import.meta.env.VITE_TMDB_API_KEY || 'f13510ec85b25f11273708dcca0c1d86'
export const imgUrlFull = 'https://image.tmdb.org/t/p/original'
export const imgUrl = 'https://image.tmdb.org/t/p/w500'

/**
 * getImageUrl(path)            -> original
 * getImageUrl(path, false)     -> w500
 * getImageUrl(path, 'w780')    -> any TMDB size
 */
export const getImageUrl = (path, size = true) => {
  if (!path) return errorImg
  if (typeof size === 'string') return `https://image.tmdb.org/t/p/${size}${path}`
  return (size ? imgUrlFull : imgUrl) + path
}

export const getYear = (item) => {
  const dateStr = item?.release_date || item?.first_air_date
  if (!dateStr) return ''
  const year = new Date(dateStr).getFullYear()
  return Number.isNaN(year) ? '' : String(year)
}

export const formatRuntime = (minutes) => {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h === 0 ? `${m}m` : `${h}h ${m}m`
}
