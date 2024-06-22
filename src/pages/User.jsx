import React from 'react'
import { Helmet } from 'react-helmet-async';
import {Button, Container, Stack, Typography} from '@mui/material'; 
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


import { Url } from '../url/url';

const User = () => {
    const userAllData = useSelector(store => store.user.data) 

  return (
    <>
    <Helmet>
        <title> Dashboard: Products | Minimal UI </title>
    </Helmet> 
    <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography> 
        </Stack> 
      </Container>
      <Container className=' '>
          <div className='d-flex align-items-center justify-content-between felx-wrap bg-lightgray rounded-top p-3'>
            <div>
              <form>
                <input type='text'  placeholder='Search' className='form-control' />
              </form>
            </div> 
            <div>
              <div className='d-flex align-items-center '>
                  <p className='mb-0 me-2 '>Total User : </p>
                  <h4 className='text-primary fw-bold mb-0'>{userAllData.length}</h4>
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
                        <th>User Name</th>
                        <th>User Email</th> 
                        <th>Verified</th> 
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>  
                    {userAllData.map((cv, i)=>{
                        return(
                            <tr className='text-center' key={i}>
                                <td>{i + 1}</td> 
                                <td className=''>{cv.name}</td>
                                <td  className=''>{cv.email}</td>
                                <td  className=''>{cv.isVerify? <p className="text-success">Verify</p> : <p className="text-warning">Unverify</p>}</td> 
                                <td  >
                                    <div className='d-flex align-items-center justify-content-center'>
                                    <button className='btn border-0'>
                                        <i className="fa-solid fa-ban text-danger fa-lg"  /> 
                                    </button>
                                    <Link className='btn border-0' > 
                                        <i className="fa-solid fa-eye text-primary fa-lg" />  
                                    </Link>
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
  )
}

export default User