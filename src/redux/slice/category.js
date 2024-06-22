import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

import {Url} from '../../url/url'

export const categorydata =  createAsyncThunk('categorydata', async ()=>{
    const response = await axios.get(`${Url}/api/category/all`).then(data => data.data)
     return response 
  })

const CategorySlice = createSlice({
    name: "category data",
    initialState: { 
        isLoading: false,
        data: []
    },
    extraReducers: (builder)=>{
        builder.addCase(categorydata.pending, (state)=>{
          state.isLoading = true;
        })
    
      builder.addCase(categorydata.fulfilled, (state,action)=>{
        state.isLoading = false; 
        state.data = action.payload; 
      });
      builder.addCase(categorydata.rejected, (state)=>{ 
        state.isError=true;
      })
    }
})
 
export default CategorySlice.reducer;


 



