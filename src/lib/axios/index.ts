import axios from 'axios'

export const api = axios.create({
	baseURL: process.env.API_URL ?? '/api',
	withCredentials: true,
	timeout: 30000, // 30 second timeout
})
