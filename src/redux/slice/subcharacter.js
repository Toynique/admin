import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

import {Url} from '../../url/url'

export const subcharacterdata =  createAsyncThunk('subcharacterdata', async ()=>{
    const response = await axios.get(`${Url}/api/subcharacter/all`).then(data => data.data)
     return response 
  })

const SubCharacterSlice = createSlice({
    name: "subcharacter data",
    initialState: { 
        isLoading: false,
        data: []
    },
    extraReducers: (builder)=>{
        builder.addCase(subcharacterdata.pending, (state )=>{
          state.isLoading = true;
        })
    
      builder.addCase(subcharacterdata.fulfilled, (state,action)=>{
        state.isLoading = false; 
        state.data = action.payload; 
      });
      builder.addCase(subcharacterdata.rejected, (state )=>{ 
        state.isError=true;
      })
    }
})
 
export default SubCharacterSlice.reducer;


 



