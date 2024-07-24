import React, { useEffect, useState } from 'react'
import {Button, Container, Stack, Typography} from '@mui/material'; 
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';

const OrderView = () => {
    const {orderId} = useParams()
    const productAllData = useSelector(d=>d.product.data)
    const orderAllData = useSelector(d=>d.order.data) 
    const [order, setOrder] = useState() 

    const productFind = (productID)=>{ 
        const dt = productAllData.find(val => val._id === productID)    
          // console.log(dt);
          return dt  
    }
    const orderFind = (odrId)=>{
      if(odrId){
        const dt = orderAllData.find(val => val._id === odrId)  
        console.log("order", dt);
        if(dt){  
          setOrder(dt)  
        }
      }
    }

    useEffect(()=>{
      orderFind(orderId)
    }, [])
    
  return (
    order ? 
    <> 
    <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h4" gutterBottom>
            OrderId : {orderId}
          </Typography> 
        </Stack> 
      </Container> 
      
      <Container>
        <div className="row">
          <div className="col-6">
            <h5>Order Details</h5>
            <div>
              <p> <span className='text-muted fw-bold'>User</span> : {order.address.receiver}</p>
              <p> <span className='text-muted fw-bold'>Total Price</span>  : &#8377; {Number(order.totalproductPrice) - Number(order.offerDiscount) + Number(order.diliveryCharge)}</p>
              <p> <span className='text-muted fw-bold'>Order Date</span> : {new Date(order.createdAt).toLocaleString()}</p>
              <p> <span className='text-muted fw-bold'>Payment Type</span> : {order.paymentType === "cod" ? "Cash on delivery" : "Online"}</p>
              {order.paymentStatus &&
              <p> <span className='text-muted fw-bold'>Payment Status </span>: {order.paymentStatus}</p> }
            </div>
          </div>
          <div className="col-6">
            <h5>Address Details</h5>
            <div>
              <p> <span className='text-muted fw-bold'>Receiver Name</span> : {order.address.receiver}</p>
              <div className='d-flex gap-2'> <span className='text-muted fw-bold'>Receiver Phone</span> : 
                <span>
                  <p>{order.address.country.code} {order.address.primaryNumber}</p>
                  {order.address.secondaryNumber ?
                  <p>{order.address.secondaryNumber}</p> : null }
                </span>
              </div>
              <p> <span className='text-muted fw-bold'>Address</span> : {order.address.address}</p>
              {order.address.nearBy ? 
              <p> <span className='text-muted fw-bold'>Near by</span> : {order.address.nearBy}</p> : null }
              <p> <span className='text-muted fw-bold'>city</span> : {order.address.city}</p>
              <p> <span className='text-muted fw-bold'>State</span> : {order.address.state}</p>
              <p> <span className='text-muted fw-bold'>Pincode</span> : {order.address.pincode}</p>
 
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <div className="row">
          <div className="col-12">
            <h5>Product Details</h5>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Product</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {order && order?.product.map((productValue, index) => {
                  const product = productFind(productValue.productId)
                return (
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>
                      <img src={product.thumbnailImage} alt="product" width={50} />
                    </td>
                    {/* <td>{product.productName}</td> */}
                    <td>
                      <div>
                        <div className="d-flex align-items-top gap-2">
                          <span className='text-muted fw-bold'>Product</span> :
                          <p className='mb-0'>{product.productName}</p>
                        </div>
                        <div className="d-flex align-items-top gap-2">
                          <span className='text-muted fw-bold'>SKU</span> :
                          <p className='mb-0'>{product.sku}</p>
                        </div>
                        <div className="d-flex align-items-top gap-2">
                          <span className='text-muted fw-bold'>Batch</span> :
                          <p className='mb-0'>{product.batch}</p>
                        </div>
                      </div>
                    </td>
                    <td>{productValue.price}</td>
                    <td>{productValue.productQuantity}</td>
                  </tr>
                )}
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Container>

    </> : null
  )
}

export default OrderView