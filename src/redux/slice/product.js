import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

import {Url} from '../../url/url'

export const productdata =  createAsyncThunk('productdata', async ()=>{
    const response = await axios.get(`${Url}/product`).then(data => data.data) 
     return response 
  })

const ProductSlice = createSlice({
    name: "product data",
    initialState: { 
        isLoading: false,
        data: []
    },
    extraReducers: (builder)=>{
        builder.addCase(productdata.pending, (state,action)=>{
          state.isLoading = true;
        })
    
      builder.addCase(productdata.fulfilled, (state,action)=>{
        state.isLoading = false; 
        state.data = action.payload; 
      });
      builder.addCase(productdata.rejected, (state,action)=>{ 
        state.isError=true;
      })
    }
})
 
export default ProductSlice.reducer;


 



