import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
// @mui
import { Container, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ClipLoader from "react-spinners/ClipLoader"; 

import { Url, orderStatusMessage } from '../url/url';



const Order = () => {
  const [searchData, setSearchValueData] = useState()
  const [currentOrderStatus, setCurrentOrderStatus] = useState('confirmed')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(50)
  const [totalOrder, setTotalOrder] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [orderAllData, setOrderAllData] = useState([])
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    fetchOrderData()
  }, [currentOrderStatus, page, limit])

  useEffect(() => {
    if (!startDate && !endDate) {
      fetchOrderData()
    }
    if (startDate && endDate) {
      fetchOrderData()
    }
  }, [startDate, endDate])

  const searchfunc = async (value) => {
    if (value.length > 0) {
      let findproduct = await axios.get(`${Url}/product/search/${value}`)
      console.log("findproduct", findproduct);

      findproduct = findproduct.data
      setSearchValueData(findproduct)
    }
    else {
      setSearchValueData()
    }
  }

  const formatedDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-IN', options);
  }
  const fetchOrderData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Url}/api/order/filterOrder`, {
        params: {
          startDate,
          endDate,
          currentOrderStatus,
          page,
          limit
        }
      })
      setLoading(false)
      if (response.status === 200) {
        setOrderAllData(response.data.data)
        setTotalOrder(response.data.totalOrder)
        setPage(response.data.currentPage)
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  }
  const confirmOrder = async (orderId) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Accept Order"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`${Url}/api/order/updateOrderStatus`, { orderId, status: 'processing' })
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Order Accepted',
            showConfirmButton: false,
            timer: 1500
          })
          fetchOrderData()
        } catch (error) {
          console.log(error);
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "Something Went Wrong",
            showConfirmButton: false,
            timer: 1500
          })
          fetchOrderData()
        }
      }

    });



  }
  const shipOrder = async (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Dispatched Order"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`${Url}/api/order/dispatch`, { orderId, status: 'dispatched' })
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Order shipped successfully',
            showConfirmButton: false,
            timer: 1500
          })
          fetchOrderData()
        } catch (error) {
          console.log(error);
          if (error.response.status === 401) {
            Swal.fire({
              title: "Order has been Cancelled",
              text: "This Order has been Cancelled by Customer. Please don't Dispatch this Order.",
              icon: "warning",
              showClass: {
                popup: `
                  animate__animated
                  animate__fadeInUp
                  animate__faster
                `
              },
              hideClass: {
                popup: `
                  animate__animated
                  animate__fadeOutDown
                  animate__faster
                `
              }
            });
            fetchOrderData()
            return
          }
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: "Something Went Wrong",
            showConfirmButton: false,
            timer: 1500
          })
          fetchOrderData()
        }
      }
    });
  }
  const filterWithDate = (e) => {
    e.preventDefault();
    setPage(1)
    fetchOrderData()
  }
  const removeDateFunc = async () => {
    setStartDate('')
    setEndDate('')
    setPage(1)
  }
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    hours = String(hours).padStart(2, '0');
    return `${hours}:${minutes} ${amPm}`;
  }
  const orderStatusColor = (orderStatus) => {
    switch (orderStatus) {
      case 'confirmed':
        return "text-success";
      // break;
      case "cancelled":
        return "text-danger";
      // break;
      // Add more cases as needed
      default:
        return null
    }
  }


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

      <Container className='mb-2'>
        <div className='border rounded px-2 py-2 d-flex justify-content-between'>
          <div>
            {startDate && endDate ?
              <p className='mb-1 text-muted'> <span className='text-warning'>{formatedDate(startDate)}</span>  to <span className='text-warning'>{formatedDate(endDate)}</span> </p>
              : null}
            <p className="mb-0">Total Order : <span className='text-primary'>{totalOrder}</span> </p>
            <form>
              <input type='text' onChange={e => searchfunc(e.target.value)} placeholder='Search' className='form-control' />
            </form>
          </div>
          <div className='d-flex gap-3'>
            <form className='d-flex justify-content-between align-itmes-end gap-3' onSubmit={e => filterWithDate(e)}>
              <div className="form-group">
                <p className='mb-0 text-muted'>Start Date</p>
                <input type="date" name="startDate" value={startDate} className='form-control' onChange={e => setStartDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <p className='mb-0 text-muted'>End Date</p>
                <input type="date" name="endDate" value={endDate} className='form-control' onChange={e => setEndDate(e.target.value)} required />
              </div>
              <div className='mt-auto'>
                <button className='btn btn-outline-primary h-auto' type='submit' >Filter Order</button>
              </div>
            </form>
            {startDate && endDate ?
              <div className='mt-auto'>
                <button className='btn btn-outline-danger h-auto' onClick={removeDateFunc}  > Reset Date</button>
              </div> : null}
          </div>
        </div>
      </Container>

      <Container className=' '>
        <div className='d-flex align-items-end justify-content-between felx-wrap bg-lightgray rounded-top p-3'>
          <div className='d-flex align-items-cenrter gap-3'>
            <div className="d-flex gap-3 flex-wrap">
              <button className='btn btn-sm btn-secondary' onClick={e => setCurrentOrderStatus('all')} disabled={currentOrderStatus === "all"}>All</button>
              <button className='btn btn-sm btn-secondary' onClick={e => setCurrentOrderStatus('pending')} disabled={currentOrderStatus === "pending"}>Pending</button>
              <button className='btn btn-sm btn-secondary' onClick={e => setCurrentOrderStatus('confirmed')} disabled={currentOrderStatus === "confirmed"}>Confirmed Order</button>
              <button className='btn btn-sm btn-secondary' onClick={e => setCurrentOrderStatus('processing')} disabled={currentOrderStatus === "processing"}>Ready to ship</button>
              <button className='btn btn-sm btn-secondary' onClick={e => setCurrentOrderStatus('dispatched')} disabled={currentOrderStatus === "dispatched"}>Shipped</button>
              <button className='btn btn-sm btn-secondary' onClick={e => setCurrentOrderStatus('delivered')} disabled={currentOrderStatus === "delivered"}>Delivered</button>
              <button className='btn btn-sm btn-secondary' onClick={e => setCurrentOrderStatus('cancelled')} disabled={currentOrderStatus === "cancelled"}>Cancelled</button>


              {/* <option value="all" >All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed Order</option>
                <option value="processing">Ready to ship</option>
                <option value="dispatched">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option> */}
            </div>
            <button className='btn btn-outline-success btn-sm' onClick={fetchOrderData}>Refresh</button>
          </div>
          <div className='d-flex gap-3 align-items-end'>
            <div>
              <p className='mb-1 text-success'>Limit</p>
              <select className='border-0 form-control rounded ' defaultValue={limit} onChange={e => setLimit(e.target.value)}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            {/* <div className=''>
              <p className='mb-1 text-success'>Order Status </p>
              <select onChange={e => setCurrentOrderStatus(e.target.value)} defaultValue={currentOrderStatus} className='border-0 form-control rounded '>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed Order</option>
                <option value="processing">Ready to ship</option>
                <option value="dispatched">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

            </div> */}
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
                <th>Order Date/Time</th>
                <th>Order Status</th>
                {currentOrderStatus === 'cancelled' &&
                  <th>Reason</th>
                }
                <th>Action</th>
              </tr>
            </thead>
            {!loading ? 
            <tbody>
              {orderAllData.map((orderValue, i) => {
                return (
                  <tr className='text-center' key={i}>
                    <td>{i + 1}. </td>
                    <td>{orderValue._id} </td>
                    <td>{orderValue.address.receiver} </td>
                    <td>&#8377; {Number(orderValue.totalproductPrice) - Number(orderValue.offerDiscount) + Number(orderValue.diliveryCharge)} </td>
                    <td>{orderValue.product.length}</td>
                    <td>
                      {formatTime(orderValue.createdAt)} <br />
                      {formatedDate(orderValue.createdAt)}
                    </td>
                    <td className={`text-capitalize ${orderStatusColor(orderValue.currentOrderStatus)}`}>{orderStatusMessage[orderValue.currentOrderStatus]}</td>
                    {currentOrderStatus === 'cancelled' &&
                      <td>{orderValue?.orderStatus?.find(d => d.status === 'cancelled')?.reason}</td>
                    }
                    <td >
                      <div className='d-flex align-items-center gap-3'>
                        <Link className='btn btn-success btn-sm ' to={`/dashboard/order/${orderValue._id}`}>Order Details</Link>

                        {
                          orderValue.currentOrderStatus === 'confirmed' && (
                            <button className='btn btn-outline-success btn-sm' onClick={() => confirmOrder(orderValue._id)}>Accept Order</button>
                          )
                        }
                        {
                          orderValue.currentOrderStatus === 'processing' && (
                            <button className='btn btn-outline-primary btn-sm' onClick={() => shipOrder(orderValue._id)}>Shipped</button>
                          )
                        }
                        {/* <button className='btn btn-outline-success btn-sm ' onClick={() => confirmOrder(orderValue._id)}>Confirm this order</button> */}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>: null}


          </table>
          <div className='text-center'>
            {(orderAllData.length === 0) && !loading ?  <p>No Data Found</p> : null   }
            
            <ClipLoader
              color="#3498db"
              loading={loading}
              size={50} // Size of the loader
            />  
          </div>
        </section>

        <div className='d-flex justify-content-center flex-wrap gap-2'>
          {totalOrder > limit ? Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={page === pageNum}
              className='rounded border-1 btn'
            >
              {pageNum}
            </button>
          )) : null}
        </div>
      </Container>



    </>
  );
}

export default Order
