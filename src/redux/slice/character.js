import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

import {Url} from '../../url/url'

export const characterdata =  createAsyncThunk('characterdata', async ()=>{
    const response = await axios.get(`${Url}/api/character/all`).then(data => data.data)
     return response 
  })

const CharacterSlice = createSlice({
    name: "character data",
    initialState: { 
        isLoading: false,
        data: []
    },
    extraReducers: (builder)=>{
        builder.addCase(characterdata.pending, (state,)=>{
          state.isLoading = true;
        })
    
      builder.addCase(characterdata.fulfilled, (state,action)=>{
        state.isLoading = false; 
        state.data = action.payload; 
      });
      builder.addCase(characterdata.rejected, (state)=>{ 
        state.isError=true;
      })
    }
})
 
export default CharacterSlice.reducer;


 



