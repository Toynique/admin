
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { Url } from "../../url/url";



export const bannerdata = createAsyncThunk('bannerdata', async ()=>{
    const responce = await axios.get(`${Url}/api/banner`).then(data => data.data)
    return responce
})

const BannerSlice = createSlice({
    name: 'banner data',
    initialState: {
        isLoading: false,
        data: []
    },
    extraReducers : (builder)=>{
        builder.addCase(bannerdata.pending, (state)=>{
            state.isLoading = true;
          })
      
        builder.addCase(bannerdata.fulfilled, (state,action)=>{
          state.isLoading = false; 
          state.data = action.payload; 
        });
        builder.addCase(bannerdata.rejected, (state)=>{ 
          state.isError=true;
        })
      }
    
})

export default BannerSlice.reducer;