import { getData } from './data/getData'
import { postData } from './data/postData'

/**
 * API Service - централизованный сервис для всех API запросов
 * Применяет Dependency Inversion Principle (SOLID)
 */

class ApiService {
  // Player endpoints
  async getPlayers() {
    return await getData('players/get')
  }

  async getPlayer(id) {
    return await getData(`player/${id}/get`)
  }

  async createPlayer(data) {
    return await postData('player/new', data)
  }

  async updatePlayer(id, data) {
    return await postData(`player/${id}/update`, data)
  }

  async deletePlayer(id) {
    return await postData(`player/${id}/delete`)
  }

  // Team endpoints
  async getTeams() {
    return await getData('teams/get')
  }

  async getTeam(id) {
    return await getData(`team/${id}/get`)
  }

  async createTeam(data) {
    return await postData('team/new', data)
  }

  async updateTeam(id, data) {
    return await postData(`team/${id}/update`, data)
  }

  async deleteTeam(id) {
    return await postData(`team/${id}/delete`)
  }

  // Auth endpoints
  async login(credentials) {
    return await postData('login', credentials)
  }

  async register(userData) {
    return await postData('register', userData)
  }
}

// Singleton pattern - одна инстанция на приложение
export const apiService = new ApiService()
