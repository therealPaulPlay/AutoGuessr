
export async function fetchWithErrorHandling(url, options) {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            // Try to parse error message from response if available
            const errorData = await response.json();
            throw new Error(errorData.message || errorData.error || `Request failed with status: ${response.status}`);
        }

        return response;
    } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            throw new Error("Network error. Please check your connection & the server status.");
        }
        throw error;
    }
}