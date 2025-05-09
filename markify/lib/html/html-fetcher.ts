/**
 * Fetches HTML content from a provided URL
 */
export const getHTML = async (url: string, fetchOptions?: RequestInit)
  : Promise<string> => {
  const response = await fetch(url, fetchOptions)

  if (!response.ok) {
    throw new Error('Error status: ' + response.status + '. Message: ' + response.statusText)
  }
  return await response.text()
}



