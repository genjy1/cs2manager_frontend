const API_URL = import.meta.env.VITE_API_URL

export const postData = async (endpoint, data) => {
  const requestURL = API_URL + `${endpoint}`

  try {
    const request = await fetch(requestURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(data),
    })

    const res = await request.json()

    // Return consistent object structure
    if (request.ok) {
      return res
    }

    // For non-200 responses, throw an error with the response data
    throw {
      status: request.status,
      statusText: request.statusText,
      data: res,
    }
  } catch (error) {
    // Re-throw structured errors
    if (error.status) {
      throw error
    }

    // Handle network errors or JSON parsing errors
    throw {
      status: 0,
      statusText: 'Network Error',
      message: error.message || 'Failed to connect to server',
      originalError: error,
    }
  }
}
