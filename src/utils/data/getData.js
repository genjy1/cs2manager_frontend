const API_URL = import.meta.env.VITE_API_URL

export const getData = async (endpoint) => {
  try {
    const request = await fetch(API_URL + endpoint, {
      headers: { Accept: 'application/json' },
    })

    const json = await request.json()

    // Check if request was successful
    if (request.ok) {
      return json.data || json
    }

    // For non-ok responses, throw an error with the response data
    throw {
      status: request.status,
      statusText: request.statusText,
      data: json,
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
