import axios from 'axios'
import { Order } from '../../../types'

const API_URL = '/api/orders/'

export const orderService = {
  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    const response = await axios.post(API_URL, orderData)
    return response.data
  },

  async getOrders(): Promise<Order[]> {
    const response = await axios.get(API_URL)
    return response.data
  },

  async getOrderById(id: string): Promise<Order> {
    const response = await axios.get(API_URL + id)
    return response.data
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const response = await axios.put(API_URL + id, { status })
    return response.data
  },
}