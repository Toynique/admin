import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

import {Url} from '../../url/url'

export const subcategorydata =  createAsyncThunk('subcategorydata', async ()=>{
    const response = await axios.get(`${Url}/api/subcategory/all`).then(data => data.data)
     return response 
  })

const SubCategorySlice = createSlice({
    name: "category data",
    initialState: { 
        isLoading: false,
        data: []
    },
    extraReducers: (builder)=>{
        builder.addCase(subcategorydata.pending, (state,action)=>{
          state.isLoading = true;
        })
    
      builder.addCase(subcategorydata.fulfilled, (state,action)=>{
        state.isLoading = false; 
        state.data = action.payload; 
      });
      builder.addCase(subcategorydata.rejected, (state,action)=>{ 
        state.isError=true;
      })
    }
})
 
export default SubCategorySlice.reducer;


 



