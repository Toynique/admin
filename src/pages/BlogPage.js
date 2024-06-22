import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useDispatch , useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import axios from 'axios'
// @mui
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock

import POSTS from '../_mock/blog';
import { Url } from '../url/url';
import { blogdata } from '../redux/slice/blog';
import { fDate } from '../utils/formatTime';


// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

// ----------------------------------------------------------------------

export default function BlogPage() {
  const blogAllData = useSelector(store => store.blog.data)
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
            await axios.delete(`${Url}/blog/${id}` ).then(()=>{ 
                    Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Item Delete Successfully',
                    showConfirmButton: false,
                    timer: 1000
                    })
                    dispatch(blogdata())
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
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography> 
          <Link  className='text-white' to="/dashboard/add-blog">
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>  New Post</Button>
          </Link>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Container>
        <section className='table-responsive'>
            <table className='table table-striped table-bordered text-center table-hover  align-top'>
                <thead className='table-primary'>
                    <tr className='align-top'>
                        <th>S. No.</th>
                        <th> Image</th>
                        <th>Title</th>
                        <th>Created At</th>
                        <th>Short Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {blogAllData.map((cv, i)=>{
                        return(
                        <tr className='text-center' key={i}>
                          <td>{i+1}</td>
                            <td  className=''>
                                <img src={`${cv.image}`} alt="" className='img-fluid mx-auto' style={{width : "60px"}}/>
                            </td>
                            <td  className=''>{cv.title}</td> 
                            <td  className=''>{fDate(cv.createdAt)}</td> 
                            <td  className=''>{cv.shortDescription}</td> 
                            <td  className=''>
                                <Link className='border-0 bg-transparent' to={`/dashboard/update-blog/${cv._id}`}>
                                  <small className='text-warning'> Edit  </small>
                                </Link>
                                <button className='border-0 bg-transparent' onClick={e=>blogdrop(cv._id)}>
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


        {/* <Grid container spacing={3}>
          {blogAllData.length > 0 && blogAllData.map((post, index) => (
            <BlogPostCard key={post._id} post={post} index={index} />
          ))}
        </Grid> */}

        {/* <Grid container spacing={3}>
          {POSTS.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid> */}
      </Container>
    </>
  );
}
