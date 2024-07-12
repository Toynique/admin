import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import axios from 'axios'
// @mui
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify'; 
// mock
 
import { Url } from '../url/url';
import { blogdata } from '../redux/slice/blog';
import { fDate } from '../utils/formatTime';
import { bannerdata } from '../redux/slice/banner';


// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

export default function BannerPage() {
  const bannerAllData = useSelector(store => store.banner.data)
  const dispatch = useDispatch() 

  const blogdrop = async(id)=>{
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(async(result) => {
        if (result.isConfirmed) { 
            await axios.delete(`${Url}/api/banner/${id}` ).then(()=>{ 
                    Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Item Delete Successfully',
                    showConfirmButton: false,
                    timer: 1000
                    })
                    dispatch(bannerdata())
             }).catch((error)=>{
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'something went wrong',
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
             
        }
    }) 
} 
  return (
    <>
      <Helmet>
        <title> Dashboard: Banner  </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Home Page Banner 
          </Typography> 
          <Link  className='text-white' to="/dashboard/add-banner">
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>  add New banner</Button>
          </Link>
        </Stack> 
        </Container> 

        <Container>
        <section className='table-responsive'>
            <table className='table table-striped table-bordered text-center table-hover  align-top'>
                <thead className='table-primary'>
                    <tr className='align-top'>
                        <th>S. No.</th>
                        <th> Title</th>
                        <th>Image Large Screen</th>
                        <th>Image Tablet Screen</th>
                        <th>Image Mobile Screen</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {bannerAllData.map((bannerValue, i)=>{
                        return(
                        <tr className='text-center' key={i}>
                          <td>{i+1}</td>
                          <td  className=''>{bannerValue.title}</td> 
                            <td  className=''>
                                <img src={`${bannerValue.bannerLg}`} alt="" className='img-fluid mx-auto' style={{width : "60px"}}/>
                            </td>
                            <td  className=''>
                                <img src={`${bannerValue.bannerMd}`} alt="" className='img-fluid mx-auto' style={{width : "60px"}}/>
                            </td>
                            <td  className=''>
                                <img src={`${bannerValue.bannerSm}`} alt="" className='img-fluid mx-auto' style={{width : "60px"}}/>
                            </td>
                              
                            <td  className=''>
                                {/* <Link className='border-0 bg-transparent' to={`/dashboard/update-blog/${bannerValue._id}`}>
                                  <small className='text-warning'> Edit  </small>
                                </Link> */}
                                <button className='border-0 bg-transparent' onClick={e=>blogdrop(bannerValue._id)}>
                                  <small className='text-danger'>Delete</small>
                                    {/* <i className="fa-solid fa-trash text-danger fa-lg"  /> */}
                                </button>
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
