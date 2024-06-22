import {configureStore} from '@reduxjs/toolkit'
import CategorySlice from './slice/category' 
import SubCategorySlice from './slice/subcategory' 
import ProductSlice from './slice/product' 
import UserSlice from './slice/user'  
import blogSlice from './slice/blog'  
import CharacterSlice from './slice/character'  
import SubCharacterSlice from './slice/subcharacter'  

export  const store = configureStore({
    reducer : {
        "category" : CategorySlice,
        "subcategory" : SubCategorySlice,
        "product" : ProductSlice,
        "user" : UserSlice, 
        "blog" : blogSlice, 
        "character" : CharacterSlice, 
        "subcharacter" : SubCharacterSlice, 
    }
})
