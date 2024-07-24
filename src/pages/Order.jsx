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

const  Order = ()=>{
  const productAllData = useSelector(store => store.product.data)
  const categoryAllData = useSelector(store => store.category.data)
  const orderAllData = useSelector(store => store.order.data)
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

  const formatedDate = (date)=>{ 
    const options = { year: 'numeric', month: 'long', day: 'numeric' }; 
    return new Date(date).toLocaleDateString('en-IN', options);
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
            Order
          </Typography>
          {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            <Link className='text-white ' to="/dashboard/add-product">Add New</Link>
          </Button> */}
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
      <section className='table-responsive'>
        <table className='table table-striped table-bordered text-center table-hover align-top'>
            <thead className='table-primary'>
                <tr className='align-top'>
                    <th>S. No.</th>
                    <th>Order Id</th>
                    <th>User</th>
                    <th>Bill</th>
                    <th>Total Product</th>
                    <th>Order Date</th> 
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>  
                {orderAllData.map((orderValue, i)=>{
                    formatedDate(orderValue.createdAt)
                    return(
                        <tr className='text-center' key={i}>
                            <td>{i+1}. </td>
                            <td>{orderValue._id} </td>
                            <td>{orderValue.address.receiver} </td>
                            <td>&#8377; {Number(orderValue.totalproductPrice) - Number(orderValue.offerDiscount) + Number(orderValue.diliveryCharge)} </td>
                            <td>{orderValue.product.length}</td>
                            <td>{formatedDate(orderValue.createdAt)}</td> 
                            <td  >
                                <div className='d-flex align-items-center'> 
                                <Link className='btn btn-success btn-sm ' to={`/dashboard/order/${orderValue._id}`}>Go To Confirm</Link>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </section>
      </Container>

      

    </>
  );
}

export default  Order
