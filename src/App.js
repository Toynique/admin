import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useEffect } from 'react';
import {useDispatch} from 'react-redux'
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import "./App.css"
import {categorydata} from './redux/slice/category'
import {subcategorydata} from './redux/slice/subcategory'
import {productdata} from './redux/slice/product'
import {userdata} from './redux/slice/user'
import { blogdata } from './redux/slice/blog';
import { characterdata } from './redux/slice/character';
import { subcharacterdata } from './redux/slice/subcharacter';

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useDispatch()
  useEffect(()=>{
    dispatch(categorydata()) 
    dispatch(subcategorydata()) 
    dispatch(characterdata()) 
    dispatch(subcharacterdata()) 
    dispatch(productdata()) 
    dispatch(userdata()) 
    dispatch(blogdata()) 
  }, []) 
  return (
    <>
     <HelmetProvider>
       <BrowserRouter>
         <ThemeProvider>
          <ScrollToTop />
          <StyledChart />
          <Router />
         </ThemeProvider>
       </BrowserRouter>
     </HelmetProvider>
    </>
  );
}
