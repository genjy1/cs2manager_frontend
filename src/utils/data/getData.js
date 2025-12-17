const API_URL = import.meta.env.VITE_API_URL

export const getData = async (endpoint) => {
  const request = await fetch(API_URL + endpoint, { headers: { Accept: 'application/json' } })
  const json = await request.json()
  const data = json.data

  return data
}
