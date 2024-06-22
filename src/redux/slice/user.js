import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

import {Url} from '../../url/url'

export const userdata =  createAsyncThunk('userdata', async ()=>{ 
    const response = await axios.get(`${Url}/user/get`).then(data => data.data) 
     return response 
  }) 

const UserSlice = createSlice({
    name: "user data",
    initialState: { 
        isLoading: false,
        data: []
    },
    extraReducers: (builder)=>{
        builder.addCase(userdata.pending, (state,action)=>{
          state.isLoading = true;
        })
    
      builder.addCase(userdata.fulfilled, (state,action)=>{
        state.isLoading = false; 
        state.data = action.payload; 
      });
      builder.addCase(userdata.rejected, (state,action)=>{ 
        state.isError=true;
      })
    }
})
 
export default UserSlice.reducer;


 



