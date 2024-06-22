import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// @mui
import {Button, Container, Stack, Typography} from '@mui/material'; 
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
 
// components
import Iconify from '../components/iconify';
import ProductDataList from '../sections/@dashboard/products/ProductDataList';
import { Url } from '../url/url';
// import ProductDataList from 'src/sections/@dashboard/products/ProductDataList';



// ----------------------------------------------------------------------
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];
// ----------------------------------------------------------------------

const  ProductsPage = ()=>{
  const productAllData = useSelector(store => store.product.data)
  const categoryAllData = useSelector(store => store.category.data)
  const [searchData, setSearchValueData] = useState() 
  const [dataValue, setDataValue] = useState([])

  const searchfunc = async(value)=>{
    if(value.length > 0){  
      let findproduct = await axios.get(`${Url}/product/search/${value}`)  
      findproduct = findproduct.data 
      setSearchValueData(findproduct)  
    }
    else{ 
      setSearchValueData()
    }
  } 

  const dataSet = (categoryvalue)=>{ 
    if(categoryvalue){ 
      if(categoryvalue){ 
        setDataValue(productAllData.filter(val => val.category === categoryvalue)) 
      }
      else{ 
        setDataValue(productAllData) 
      }
    }
    else{ 
      setDataValue(productAllData) 
    }
  }

  useEffect(()=>{
    dataSet()
  }, [productAllData])


  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Product
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            <Link className='text-white ' to="/dashboard/add-product">Add New</Link>
          </Button>
        </Stack> 
      </Container>

      <Container className=' '>
          <div className='d-flex align-items-center justify-content-between felx-wrap bg-lightgray rounded-top p-3'>
            <div>
              <form>
                <input type='text' onChange={e=>searchfunc(e.target.value)} placeholder='Search' className='form-control' />
              </form>
            </div>
            <div>
              <div className='d-flex align-items-center '>
                  <p htmlFor="" className='mb-0 me-2'>Category : </p>
                  <form action="">                  
                  <select name="" id="" onChange={e=>dataSet(e.target.value)} className='border-0 rounded p-1'>
                    <option value="">All</option>
                    {categoryAllData.map((cv, i)=>{
                      return(
                        <option value={cv.category} className='text-capitalize' key={i}>{cv.category} </option>
                      )
                    })} 
                  </select>
                  </form>

              </div>
            </div>  
          </div>
      </Container>
      <Container>
        {searchData ? <ProductDataList data ={searchData}/> : <ProductDataList data ={dataValue}/>} 
      </Container>

      

    </>
  );
}

export default  ProductsPage
