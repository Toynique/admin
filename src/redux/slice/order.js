import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

import {Url} from '../../url/url'

export const orderdata =  createAsyncThunk('orderdata', async ()=>{
    const response = await axios.get(`${Url}/api/order`).then(data => data.data)
     return response 
  })

const OrderSlice = createSlice({
    name: "order data",
    initialState: { 
        isLoading: false,
        data: []
    },
    extraReducers: (builder)=>{
        builder.addCase(orderdata.pending, (state,)=>{
          state.isLoading = true;
        })
    
      builder.addCase(orderdata.fulfilled, (state,action)=>{
        state.isLoading = false; 
        state.data = action.payload; 
      });
      builder.addCase(orderdata.rejected, (state)=>{ 
        state.isError=true;
      })
    }
})
 
export default OrderSlice.reducer;


 



