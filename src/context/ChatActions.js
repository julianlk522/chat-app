const API_URL = 'http://localhost:5000'

export const loginUser = async (loginData) => {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)

    })

    return response
}

export const getUserContacts = async (userId) => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return response
}