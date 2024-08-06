import React, { useEffect, useState }  from "react";
import { Helmet } from 'react-helmet-async';
import { Container  } from "@mui/material";
import ReactQuill from 'react-quill';
import axios from "axios";
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";


import { Url } from "../url/url";
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "../utils/EditorToolbar";
import "../App.css"
import { productdata } from "../redux/slice/product";

const EditProduct = () => { 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {id} = useParams()
    const categoryAllData = useSelector(store => store.category.data) 
    const subcategoryAllData = useSelector(store => store.subcategory.data) 
    const subcharacterAllData = useSelector(store => store.subcharacter.data) 
    const characterAllData = useSelector(store => store.character.data) 
    const productAllData = useSelector(store => store.product.data)  
    const [keyvalue, setKeyValue] = useState('');
    const [specificationvalue, setSpecificationValue] = useState("");
    const [otherValue, setOtherValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState("");
    const [productName, setProductName] = useState('');
    const [mrp, setMrp] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [discount, setDiscount] = useState(''); 
    const [totalProduct, setTotalProduct] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [sku, setSku] = useState('');
    const [batch, setBatch] = useState('');
    const [thumbnailImage, setThumbnailImage] = useState('');
    const [oldThumbnailImage, setOldThumbnailImage] = useState('');
    const [images, setImages] = useState(''); 
    const [oldImages, setOldImages] = useState(''); 
     const [category, setCategory] = useState('');
     const [oldCategory, setOldCategory] = useState('');
     const [replacement, setReplacement] = useState('');
     const [height, setHeight] = useState('');
     const [width, setWidth] = useState('');
     const [depth, setDepth] = useState('');
     const [measurement, setMeasurement] = useState('');
     const [shortDescription, setShortDescription] = useState('');
     const [slug, setSlug] = useState('');
     const [type, setType] = useState('');
     const [loading, setLoading] = useState(false);


    //  const [altTag, setAltTag] = useState(false);
     const [formValue, setFormValue] = useState({})


     const formHandle = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        const lowervalue = value.toLowerCase()
        setFormValue({...formValue, [name]:lowervalue});
     }


    const submit = async(e)=>{
        e.preventDefault() 
        setLoading(true)   
        const {altTag} = formValue 
        if(productName && mrp && salePrice && discount  && totalProduct && subCategory && sku && batch && category && keyvalue && specificationvalue && otherValue && descriptionValue && height && width && depth && measurement && shortDescription && slug && type ){ 
            const formData = new FormData();   
            formData.append("productName", productName);
            formData.append("mrp", mrp);
            formData.append("salePrice", salePrice);
            formData.append("discount", discount); 
            formData.append("totalProduct", totalProduct);
            formData.append("category", category);
            formData.append("subCategory", subCategory);
            formData.append("sku", sku);
            formData.append("batch", batch); 
            formData.append("keyFeature", keyvalue);
            formData.append("specification", specificationvalue);
            formData.append("otherInfo", otherValue);
            formData.append("description", descriptionValue);  
            formData.append("height", height);  
            formData.append("width", width);  
            formData.append("depth", depth);  
            formData.append("measurement", measurement);  
            formData.append("shortDescription", shortDescription);  
            formData.append("replacement", replacement); 
            formData.append("slug", slug); 
            formData.append("type", type); 
            formData.append("altTag", altTag); 

            if(thumbnailImage){ 
                formData.append("thumbnailImage", thumbnailImage); 
            }
            else{ 
                formData.append("thumbnailImage", oldThumbnailImage);
            } 
            if(images){ 
                for(let i = 0; i < images.length; i += 1) { 
                    formData.append("images", images[i]); 
                } 
            }
            else{ 
                formData.append("images", [oldImages]); 
            }  
            try {
                await axios.post(`${Url}/product/update/${id}`, formData).then((data)=>{ 
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Product Updated Successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                    setLoading(false)
                    dispatch(productdata())
                    navigate("/dashboard/products")
                })
            } catch (error) { 
                console.log(error.message);
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'something went wrong',
                    showConfirmButton: false,
                    timer: 1500
                  })
                setLoading(false)
            }
        }
        else {
            setLoading(false)
            console.log("all fields are required ");
            Swal.fire('All fields are required')
        }

    }
    const editDataFilter = async()=>{
        const dt = await productAllData.find(val => val._id === id)  
        if(dt){ 
        setFormValue(dt)
        setSpecificationValue(dt.specification)
        setOtherValue(dt.otherInfo)
        setDescriptionValue(dt.description)
        setKeyValue(dt.keyFeature)
        setProductName(dt.productName)
        setMrp(dt.mrp)
        setSalePrice(dt.salePrice)
        setDiscount(dt.discount) 
        setTotalProduct(dt.totalProduct)
        setSubCategory(dt.subCategory)
        setSku(dt.sku)
        setBatch(dt.batch) 
        setOldThumbnailImage(dt.thumbnailImage) 
        setOldImages(dt.images)
        setCategory(dt.category)
        setOldCategory(dt.category)
        setReplacement(dt.replacement)
        setHeight(dt.productSize.height)
        setWidth(dt.productSize.width)
        setDepth(dt.productSize.depth)
        setMeasurement(dt.productSize.measurement) 
        setShortDescription(dt.shortDescription) 
        setSlug(dt.slug)   
        setType(dt.type)   
        }
    }
    const thumbnailImagefunc = (file)=>{ 
        setThumbnailImage(file)
    }
    const imagesFunc = (files)=>{ 
        const fileArr = Object.values(files) 
        setImages(fileArr) 
    }
    useEffect(()=>{
        editDataFilter() 
    }, [productAllData])
  return (
    <>
    <Helmet>
        <title> Update Product Toynique </title>
    </Helmet>
 

        <Container>
            <div className="mb-4 text-primary">
                <h2 className="text-capitalize">Update product</h2>
            </div>  
            {productAllData ? 
            <div className="p-3 bg-light rounded shadow border">
                <form action="">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Product Name</p>
                                <input type="text" value={productName} name="productName"  onChange={e=>setProductName(e.target.value)}  className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Slug</p>
                                <input type="text" value={slug} name="slug"  onChange={e=>setSlug(e.target.value)}  className="form-control" />
                            </div>
                        </div> 
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Image alt tag</p>
                                <input type="text" value={formValue.altTag} name="altTag"  onChange={e=>formHandle(e)}  className="form-control" />
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">short Description</p> 
                                <textarea className="form-control" value={shortDescription} name="shortDescription" onChange={e=>setShortDescription(e.target.value)}   rows="3" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Thumbnail Image</p>
                                <input type="file" name="thumbnailImage" onChange={e=>thumbnailImagefunc(e.target.files[0])} className="form-control" />
                            </div>
                            <div className="mt-2">
                                <img src={`${Url}/${oldThumbnailImage}`} alt="" style={{width: "100px"}} className="border rounded" /> 
                            </div> 
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Images</p>
                                <input type="file" name="images" multiple onChange={e=>imagesFunc(e.target.files)} className="form-control" />
                            </div>
                            <div className="mt-2 d-flex flex-wrap">
                                {oldImages && oldImages.map((cv, i)=>{
                                    return(
                                        <div className="position-relative" key={i}>
                                        <img  src={`${Url}/${cv}`} alt="" style={{width: "100px"}} className="border rounded me-1 mb-1"/>
                                        <span className="position-absolute top-0 end-0 text-danger">-</span> 
                                        </div>
                                    )
                                })}
                            </div> 
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">MRP (<i className="fa-solid fa-indian-rupee-sign text-muted fa-sm"/>)</p>
                                <input type="number" value={mrp} name="mrp" onChange={e=>setMrp(e.target.value)}  className="form-control"/>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Sale Price (<i className="fa-solid fa-indian-rupee-sign text-muted fa-sm"/>)</p>
                                <input type="number" value={salePrice} name="salePrice" onChange={e=>setSalePrice(e.target.value)}  className="form-control"/>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Discount (%)</p>
                                <input type="number" value={discount} name="discount" onChange={e=>setDiscount(e.target.value)} className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="row">
                                <div className="col-lg-3 col-md-6 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Height</p>
                                        <input type="height" name="height" value={height} onChange={e=>setHeight(e.target.value)}className="form-control" />
                                    </div>
                                </div> 
                                <div className="col-lg-3 col-md-6 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Width</p>
                                        <input type="width" name="width" value={width} onChange={e=>setWidth(e.target.value)} className="form-control" />
                                    </div>
                                </div> 
                                <div className="col-lg-3 col-md-6 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Depth</p>
                                        <input type="depth" name="depth" value={depth} onChange={e=>setDepth(e.target.value)} className="form-control" />
                                    </div>
                                </div> 
                                <div className="col-lg-3 col-md-6 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">size</p> 
                                        <select name="measurement" onChange={e=>setMeasurement(e.target.value)} id="" className="form-select">
                                            <option value={measurement} >{measurement}</option> 
                                            <option value={"cm"} >cm</option> 
                                            <option value={"inch"} >inch</option> 
                                        </select>
                                    </div>
                                </div>  
                                
                            </div> 
                        </div> 
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Total Product</p>
                                <input type="number" value={totalProduct} name="totalProduct" onChange={e=>setTotalProduct(e.target.value)} className="form-control" />
                            </div>
                        </div> 
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Category</p>
                                <select name="category"   onChange={e=>setCategory(e.target.value)} id="" className="form-select">
                                    <option defaultValue={category} >{category}</option>
                                    {categoryAllData.map((cv, i)=>{
                                        return(
                                            <option value={cv.category} key={i}>{cv.category}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Sub Category</p>
                                <select name="subCategory" onChange={e=>setSubCategory(e.target.value)} id="" className="form-select">
                                {(oldCategory === category)? 
                                <option value={subCategory} selected >{subCategory}</option> :
                                <option  selected>Select Subcategory</option> }
                                {category ? 
                                <>
                                {subcategoryAllData.filter(val => val.category === category).map((value, i)=>{
                                    return(
                                        <option value={value.subcategory} key={i}>{value.subcategory}</option>
                                    )
                                })}
                                </> 
                                : null} 
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">character</p>
                                <select name="character" value={formValue.character}   onChange={e=>setFormValue(e)} id="" className="form-select" required>
                                    {/* <option defaultValue={category} >{category}</option> */}
                                    {characterAllData.map((cv, i)=>{
                                        return(
                                            <option value={cv.character} key={i}>{cv.character}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Sub Character</p>
                                <select name="subcharacter" onChange={e=>setFormValue(e)} id="" className="form-select" required> 
                                {formValue.character && subcharacterAllData.filter(val => val.character === formValue.character).map((value, i)=>{
                                    return(
                                        <option value={value.subcharacter} key={i}>{value.subcharacter}</option>
                                    )
                                })} 
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Type</p>
                                <select name="type" onChange={e=>setType(e.target.value)} id="" className="form-select"> 
                                <option value={type} disabled={type} selected className="text-capitalize" >{type}</option>  
                                <option value ="big">Big</option> 
                                <option value ="small">Small</option> 
                                
                                </select>
                            </div>
                        </div> 
                        
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Batch No.</p>
                                <input type="text" value={batch} name="batch" onChange={e=>setBatch(e.target.value)} className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">SKU No.</p>
                                <input type="text" value={sku} name="sku" onChange={e=>setSku(e.target.value)} className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Replacement (days)</p>
                                <input type="number" name="replacement" value={replacement} onChange={e=>setReplacement(e.target.value)}className="form-control" />
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Descrption</p>
                                <div className="text-editor bg-white rounded">
                                <ReactQuill   theme="snow" value={descriptionValue} onChange={setDescriptionValue} placeholder={"Write something awesome..."}  />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">key features</p>
                                <div className="text-editor bg-white">
                                <EditorToolbar />
                                <ReactQuill   theme="snow" value={keyvalue} onChange={setKeyValue} placeholder={"Write something awesome..."} modules={modules} formats={formats} />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Specification</p>
                                <div className="text-editor bg-white">
                                <ReactQuill   theme="snow" value={specificationvalue} onChange={setSpecificationValue} placeholder={"Write something awesome..."}  />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Other Info</p>
                                <div className="text-editor bg-white"> 
                                <ReactQuill  theme="snow" name="other_info" value={otherValue} onChange={setOtherValue} placeholder={"Write something awesome..."}  />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 ">
                            <div className="form-group text-end">
                                <button className="btn btn-primary " onClick={e=>submit(e)} disabled={loading}>{loading ? "saving..." : "Post"}</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div> 
            : null}
        </Container>
    </>
  )
}

export default EditProduct
