import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { orderService } from './orderService'
import { Order } from '../../../types'

// Define the state for the order slice
interface OrderState {
  orders: Order[]            // List of all orders
  currentOrder: Order | null  // Currently created order
  isLoading: boolean          // Loading state for async actions
  error: string | null        // Error message, if any
}

// Initial state setup
const initialState: OrderState = {
  orders: [],                 // No orders initially
  currentOrder: null,         // No current order initially
  isLoading: false,           // Not loading by default
  error: null,                // No error initially
}

// Async action to create an order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: Omit<Order, 'id'>, thunkAPI) => {
    try {
      return await orderService.createOrder(orderData) // Create order through service
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to create order') // Return error message
    }
  }
)

// Async action to fetch all orders
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (_, thunkAPI) => {
    try {
      return await orderService.getOrders() // Fetch orders from service
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch orders') // Return error message
    }
  }
)

// Order slice to handle order-related state and actions
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {}, // No synchronous reducers here
  extraReducers: (builder) => {
    // Handle createOrder lifecycle
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true      // Set loading to true when creating order
        state.error = null          // Clear previous error
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false     // Stop loading after order is created
        state.currentOrder = action.payload  // Store the newly created order
        state.orders.push(action.payload)    // Add order to list of orders
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false     // Stop loading on error
        state.error = action.payload as string // Store error message
      })
    
    // Handle fetchOrders lifecycle
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true      // Set loading to true when fetching orders
        state.error = null          // Clear previous error
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.isLoading = false     // Stop loading after orders are fetched
        state.orders = action.payload // Store the fetched orders
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false     // Stop loading on error
        state.error = action.payload as string // Store error message
      })
  },
})

export default orderSlice.reducer
