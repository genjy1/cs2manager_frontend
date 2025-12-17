const API_URL = import.meta.env.VITE_API_URL

export const postData = async (endpoint, data) => {
  console.log(API_URL)

  const requestURL = API_URL + `${endpoint}`

  const request = await fetch(requestURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  })

  const res = await request.json()

  return request.status === 200 ? res : request.status
}
