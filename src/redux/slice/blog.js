
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'
import { Url } from "../../url/url";



export const blogdata = createAsyncThunk('blogdata', async ()=>{
    const responce = await axios.get(`${Url}/blog`).then(data => data.data)
    return responce
})

const blogSlice = createSlice({
    name: 'blog data',
    initialState: {
        isLoading: false,
        data: []
    },
    extraReducers : (builder)=>{
        builder.addCase(blogdata.pending, (state)=>{
            state.isLoading = true;
          })
      
        builder.addCase(blogdata.fulfilled, (state,action)=>{
          state.isLoading = false; 
          state.data = action.payload; 
        });
        builder.addCase(blogdata.rejected, (state)=>{ 
          state.isError=true;
        })
      }
    
})

export default blogSlice.reducer;