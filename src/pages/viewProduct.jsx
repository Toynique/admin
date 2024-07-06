import React, { useEffect, useState }  from "react";
import ReactHtmlParser from 'html-react-parser';
// import parse from 'html-react-parser';
import { Helmet } from 'react-helmet-async'; 
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Url } from "../url/url";
 

// ----------------------------------------------------------------------

const ViewProduct = ()=>{
    const productAllData = useSelector(store => store.product.data)  
    const {id} = useParams()
    const [productData, setProductData] = useState()


    const editDataFilter = async()=>{
        const dt = await productAllData.find(val => val._id === id)  
        if(dt){ 
            setProductData(dt) 
        }
    }

    useEffect(()=>{
        editDataFilter() 
    }, [productAllData])
  return (
    <>
      <Helmet>
        <title> Toynique </title>
      </Helmet>  
      <h5 className="mb-3">{productData && productData.productName}</h5>
      <div className="row">
        <div className="col-lg-6 mb-3">
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6 col-12 mb-3">
              <div>
                <img src={`${productData && productData.thumbnailImage}`} alt="toynique" className="border rounded w-100 img-fluid" />
              </div>
            </div>
            
              {productData && productData.images.map((cv, i)=>{
                return (
                  <div className="col-lg-4 col-md-4 col-sm-6 col-12 mb-3" key={i}>
                    <div>
                    <img src={`${cv}`} alt="toynique" className="border rounded w-100 img-fluid" />
                    </div>
                  </div>
                )
              })} 
          </div>
        </div>
        <div className="col-lg-6 mb-3">
          <p>{productData && productData.slug}</p>
          <p>{productData && productData.shortDescription}</p>
          <div className="mb-2">
            <table className="table ">
              <thead>
                <tr>
                  <th>MRP</th>
                  <th>Sale Price </th>
                  <th>Discount (%)</th> 
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{productData && productData.mrp}</td>
                  <td>{productData && productData.salePrice}</td>
                  <td>{productData && productData.discount}</td> 
                </tr>
              </tbody>
            </table> 
          </div>
          <p><span className="fw-bold">Category</span> :- <span>{productData && productData.category}</span></p> 
          <p><span className="fw-bold">SubCategory</span> :- <span>{productData && productData.subcategory}</span></p> 
          <p><span className="fw-bold">Total Product</span> :- <span>{productData && productData.totalProduct}</span></p> 
          <p><span className="fw-bold">Product Size</span> :- <span>{productData && productData.productSize.height}</span> * <span>{productData && productData.productSize.height}</span> * <span>{productData && productData.productSize.height}</span> (<span>{productData && productData.productSize.measurement}</span>)</p> 
          <p><span className="fw-bold">Replacement (Days)</span> :- <span>{productData && productData.replacement}</span></p> 
          <p><span className="fw-bold">Batch No.</span> :- <span>{productData && productData.batch}</span></p> 
          <p><span className="fw-bold">Sku No.</span> :- <span>{productData && productData.sku}</span></p> 


        </div>
      </div>
      <h3>Description</h3>
      <p>{productData && ReactHtmlParser(productData.description)}</p>
      <h3>key features</h3>
      <p>{productData &&  ReactHtmlParser(productData.keyFeature)}</p>
      <h3>Specification</h3>
      <p>{productData &&  ReactHtmlParser(productData.specification)}</p>
      <h3>Other Info</h3>
      <p>{productData && ReactHtmlParser(productData.otherInfo)}</p>
    </>
  );
}

export default  ViewProduct
