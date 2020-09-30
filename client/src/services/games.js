import api from './api-helper'

export const getGames = async () => {
  const res = await api.get(`games`)
  return res.data
}

export const readGame = async (code) => {
  const res = await api.get(`game/${code}/users`)
  return res.data
} 

export const postGame = async (gameData) => {
  const res = await api.post('/games', { game: gameData })
  return res.data
}

export const destroyGame = async (code) => {
  const res = await api.delete(`game/${code}`)
  return res
}

export const postUser = async (userData) => {
  const res = await api.post('/users/', {user: userData})
  return res.data
}