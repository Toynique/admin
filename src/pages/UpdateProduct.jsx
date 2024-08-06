import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { Container } from "@mui/material";
import ReactQuill from 'react-quill';
import axios from "axios";
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { CSSTransition } from 'react-transition-group';


import { Url, awsFileUrl } from "../url/url";
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "../utils/EditorToolbar";
import "../App.css"
import { productdata } from "../redux/slice/product";

const UpdateProduct = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const categoryAllData = useSelector(store => store.category.data)
    const subcategoryAllData = useSelector(store => store.subcategory.data)
    const subcharacterAllData = useSelector(store => store.subcharacter.data)
    const characterAllData = useSelector(store => store.character.data)
    const productAllData = useSelector(store => store.product.data)
    const [keyvalue, setKeyValue] = useState('');
    const [specificationvalue, setSpecificationValue] = useState("");
    const [otherValue, setOtherValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [formValue, setFormValue] = useState({})
    const [modalShow, setModalShow] = useState(false);


    const [uploadLoading, setUploadLoading] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(false);


    const [multipleFileProgress, setMultipleFileProgress] = useState(0)
    const [totalfiles, setTotalFiles] = useState(0)
    const [totalUpload, setTotalUpload] = useState(0)
    const [multipleFileStatus, setMultipleFileStatus] = useState(false)

    const [updateImageLoading, setUpdateImageLoading] = useState(false)
    const [updateImageProgress, setUpdateImageProgress] = useState(0)
    // const [updateImageValue, setUpdateImageValue] = useState({
    //     imageLink: "https://toynique.s3.ap-south-1.amazonaws.com/products/1722433626929-1 copy 2.webp"
    // })
    const [updateImageValue, setUpdateImageValue] = useState({})


    const formHandle = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === 'category') {
            setFormValue({ ...formValue, 'subcategory': "" });
        }
        if (name === 'character') {
            setFormValue({ ...formValue, 'subcharacter': "" });
        }
        setFormValue({ ...formValue, [name]: value });
    }
    const fileHandle = async (e) => {
        const files = e.target.files;
        const name = e.target.name;
        const uploadedFiles = [];
        setTotalFiles(files?.length);
        setTotalUpload(0);
        setMultipleFileProgress(0);
        setMultipleFileStatus(true);
        try {
            await Array.from(files).reduce(async (previousPromise, file, i) => {
                await previousPromise;
                if (file) {
                    const response = await axios.post(`${Url}/api/createPresignedUrl/products`, { fileName: file.name, fileType: file.type });
                    if (response.status === 200) {
                        const { preSignedUrl, key } = response?.data;
                        const responseFileSave = await axios.put(preSignedUrl, file, {
                            onUploadProgress: (progressEvent) => {
                                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                setMultipleFileProgress(progress);
                            },
                        });

                        if (responseFileSave.status === 200) {
                            const fileUrl = `${awsFileUrl}/${key}`;
                            setTotalUpload(i + 1);
                            uploadedFiles.push(fileUrl);
                        } else {
                            throw new Error('File upload failed');
                        }
                    }
                }
            }, Promise.resolve());
            setFormValue({ ...formValue, [name]: uploadedFiles });
            setMultipleFileStatus(false);
            setUploadStatus(true);
        } catch (error) {
            console.log(error);
        } finally {
            setMultipleFileStatus(false);
            setProgressValue(0);
        }
    };


    const updateImageHandle = async (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        setUpdateImageLoading(true)
        
        
        try {
            if (file) {
                const response = await axios.post(`${Url}/api/createPresignedUrl/products`, { fileName: file.name, fileType: file.type })
                if (response.status === 200) {
                    const { preSignedUrl, key, fileType } = response?.data
                    const responseFileSave = await axios.put(preSignedUrl, file, {
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUpdateImageProgress(progress)
                        },
                    })
                    if (responseFileSave.status === 200) {
                        const fileUrl = `${awsFileUrl}/${key}`
                        setUpdateImageValue({ ...updateImageValue, [name]: fileUrl })
                        setUpdateImageLoading(false)
                    }
                    else {
                        setUpdateImageLoading(false)
                    }
                    setUpdateImageLoading(false)
                }
                setUpdateImageLoading(false)
            }
        } catch (error) {
            console.log(error);
            setUpdateImageLoading(false)
        }
        setUpdateImageLoading(false)
    }

    const thumbnailHandle = async (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        setUploadLoading(true)
        try {
            if (file) {
                const response = await axios.post(`${Url}/api/createPresignedUrl/products`, { fileName: file.name, fileType: file.type })
                if (response.status === 200) {
                    const { preSignedUrl, key, fileType } = response?.data
                    const responseFileSave = await axios.put(preSignedUrl, file, {
                        onUploadProgress: (progressEvent) => {
                            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setProgressValue(progress)
                        },
                    })
                    if (responseFileSave.status === 200) {
                        const fileUrl = `${awsFileUrl}/${key}`
                        setFormValue({ ...formValue, [name]: fileUrl })
                        setUploadStatus(true)
                        setUploadLoading(false)
                        setProgressValue(0)
                    }
                    else {
                        setUploadLoading(false)
                        setProgressValue(0)
                        setUploadStatus(false)
                    }
                    setUploadLoading(false)
                }
                setUploadLoading(false)
            }
        } catch (error) {
            console.log(error);
            setUploadLoading(false)
        }
        setUploadLoading(false)
    }
    const submit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (descriptionValue) {
            const dataValue = { ...formValue, "description": descriptionValue, "specification": specificationvalue, "keyFeature": keyvalue, "otherInfo": otherValue }
            try {
                await axios.post(`${Url}/product/update/${id}`, dataValue).then((data) => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Add Product Success',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setLoading(false)
                    dispatch(productdata())
                    navigate("/dashboard/products")
                })
            } catch (error) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: "Something Went Wrong",
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log(error.message);
                setLoading(false)
            }
        }
        else {
            setLoading(false)
            console.log("all fields are required ");
            Swal.fire('All fields are required')
        }

    }
    const removeProductImgFunc = async (e, i, productId) => {
        e.preventDefault()
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Remove it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                // console.log(i, productId);
                const response = await axios.put(`${Url}/product/${productId}/remove-image/${i}`)
                dispatch(productdata())
                if (response.status === 200) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "File removed successfully",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }

            }
        });
    }
    const updateImageSubmit = async (e) => {
        e.preventDefault();
        console.log("updateImageValue", updateImageValue);
        
        if (formValue?._id && updateImageValue?.position && updateImageValue?.imageLink) {
            try {
                const response = await axios.put(`${Url}/product/${formValue._id}/add-image/${updateImageValue.position}`, updateImageValue)
                console.log("response", response);
                
                dispatch(productdata())
                closeModal()
                setUpdateImageValue({})
                setUpdateImageProgress(0)
                if (response.status === 200) {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: "Image Updated",
                        showConfirmButton: false,
                        timer: 1500
                    })
                }

            } catch (error) {
                console.log(error)
            }
        }

    }


    const closeModal = () => {
        setModalShow(false)
    }
    const openModal = (e) => {
        e.preventDefault()
        setModalShow(true)
    }




    const editDataFilter = async () => {
        const response = await productAllData.find(val => val._id === id)
        if (response) {
            setFormValue({ ...response, ...response?.productSize })
            setSpecificationValue(response.specification)
            setOtherValue(response.otherInfo)
            setDescriptionValue(response.description)
            setKeyValue(response.keyFeature)
        }
    }
    useEffect(() => {
        editDataFilter()
    }, [productAllData])
    return (
        <>
            <Helmet>
                <title> Update Product </title>
            </Helmet>


            <Container>
                <div className="mb-4 text-primary">
                    <h2 className="text-capitalize">Update product new</h2>
                </div>
                {productAllData && formValue ?
                    <div className="p-3 bg-light rounded shadow border">
                        {/* <form  onSubmit={e => submit(e)}> */}
                        <form >
                            <div className="row">
                                <div className="col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Product Name</p>
                                        <input type="text" value={formValue.productName} name="productName" onChange={e => formHandle(e)} className="form-control" required />
                                    </div>
                                </div>
                                <div className="col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">short Description</p>
                                        <textarea className="form-control" value={formValue.shortDescription} name="shortDescription" onChange={e => formHandle(e)} rows="3" required />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12 mb-4">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Thumbnail Image</p>
                                        <input type="file" name="thumbnailImage" onChange={e => thumbnailHandle(e)} className="form-control" />
                                        <div className="d-flex justify-content-end gap-2 pt-2">
                                            {uploadLoading && progressValue && <progress className="flex-grow-1" value={progressValue} max="100" style={{ height: "5px" }} />}
                                            {/* {uploadStatus && <small className="fs-10 text-success">{uploadLoading ? `${progressValue} %` : 'success'} </small>}  */}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        {/* <img src={`${oldThumbnailImage}`} alt="" style={{width: "100px"}} className="border rounded" />  */}
                                        <img src={`${formValue?.thumbnailImage}`} alt="" style={{ width: "70px" }} className="border rounded" />
                                    </div>
                                </div>



                                <div className="col-lg-6 col-12 mb-4">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Product Images</p>
                                        <input type="file" name="images" multiple onChange={e => fileHandle(e)} className="form-control" />
                                        {totalfiles !== 0 &&
                                            <div className="d-flex justify-content-end gap-2 pt-2 align-items-center">
                                                <progress className="flex-grow-1 " value={(totalUpload / totalfiles) * 100} max="100" style={{ height: "5px" }} />

                                                <small className="fs-10 text-secondary w-max-content">{totalUpload}/{totalfiles}  </small>
                                                <small className="fs-10 text-success w-max-content">{((totalUpload / totalfiles) * 100).toFixed(1)} % </small>

                                            </div>}
                                    </div>
                                    <div className="mt-4 d-flex flex-wrap gap-4 align-items-center">
                                        {formValue?.images?.map((cv, i) => {
                                            return (
                                                <div className="position-relative" key={i}>
                                                    <img src={`${cv}`} alt="toynique" style={{ width: "70px" }} className="border rounded " />
                                                    <button className="position-absolute top-0 start-100 translate-middle  text-danger cursor-pointer fw-bold  bg-danger text-white remove rounded-circle border " onClick={(e) => removeProductImgFunc(e, i, formValue._id)}>x</button>
                                                </div>
                                            )
                                        })}
                                        <div className="border rounded" style={{ width: "70px" }} >
                                            <button onClick={openModal} className="m-0 p-0 border-0 d-block w-100">
                                                <i className="fa-solid fa-plus fw-bold fs-1 w-100 text-add" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Image alt tag</p>
                                        <input type="text" value={formValue.altTag} name="altTag" onChange={e => formHandle(e)} className="form-control" required />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                    <div className="row">
                                        <div className="col-lg-4  mb-2">
                                            <div className="form-group">
                                                <p className="mb-0 fw-bold">MRP (<i className="fa-solid fa-indian-rupee-sign text-muted fa-sm" />)</p>
                                                <input type="number" value={formValue.mrp} name="mrp" onChange={e => formHandle(e)} className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 mb-2">
                                            <div className="form-group">
                                                <p className="mb-0 fw-bold">Sale Price (<i className="fa-solid fa-indian-rupee-sign text-muted fa-sm" />)</p>
                                                <input type="number" value={formValue.salePrice} name="salePrice" onChange={e => formHandle(e)} className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-lg-4 mb-2">
                                            <div className="form-group">
                                                <p className="mb-0 fw-bold">Discount (%)</p>
                                                <input type="number" value={formValue.discount} name="discount" onChange={e => formHandle(e)} className="form-control" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                    <div className="row">
                                        <div className="col-lg-3 col-md-6 mb-2">
                                            <div className="form-group">
                                                <p className="mb-0 fw-bold">Height</p>
                                                <input type="text" name="height" value={formValue?.height} onChange={e => formHandle(e)} className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-6 mb-2">
                                            <div className="form-group">
                                                <p className="mb-0 fw-bold">Width</p>
                                                <input type="text" name="width" value={formValue?.width} onChange={e => formHandle(e)} className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-6 mb-2">
                                            <div className="form-group">
                                                <p className="mb-0 fw-bold">Depth</p>
                                                <input type="text" name="depth" value={formValue?.depth} onChange={e => formHandle(e)} className="form-control" required />
                                            </div>
                                        </div>
                                        <div className="col-lg-3 col-md-6 mb-2">
                                            <div className="form-group">
                                                <p className="mb-0 fw-bold">size</p>
                                                <select name="measurement" onChange={e => formHandle(e)} value={formValue?.measurement} className="form-select" required>
                                                    <option value="">choose</option>
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
                                        <input type="number" value={formValue.totalProduct} name="totalProduct" onChange={e => formHandle(e)} className="form-control" required />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Category</p>
                                        <select name="category" value={formValue.category} onChange={e => formHandle(e)} className="form-select" required>
                                            <option value='' disabled={(formValue.category)}>Category Choose</option>
                                            {categoryAllData.map((cv, i) => {
                                                return (
                                                    <option value={cv.category} key={i}>{cv.category}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Sub Category</p>
                                        <select name="subcategory" value={formValue.subcategory} onChange={e => formHandle(e)} className="form-select" required>
                                            <option value='' > Choose</option>
                                            {subcategoryAllData.filter(val => val.category === formValue.category).map((value, i) => {
                                                return (
                                                    <option value={value.subcategory} key={i}>{value.subcategory}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Character</p>
                                        <select name="character" value={formValue.character} onChange={e => formHandle(e)} id="" className="form-select" required>
                                            <option value='' disabled={(formValue.character)} >Character Choose</option>
                                            {characterAllData.map((cv, i) => {
                                                return (
                                                    <option value={cv.character} key={i}>{cv.character}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Sub Character</p>
                                        <select name="subcharacter" value={formValue.subcharacter} onChange={e => formHandle(e)} className="form-select" required>
                                            <option value='' > Choose</option>
                                            {formValue.character && subcharacterAllData.filter(val => val.character === formValue.character).map((value, i) => {
                                                return (
                                                    <option value={value.subcharacter} key={i}>{value.subcharacter}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Batch No.</p>
                                        <input type="text" value={formValue.batch} name="batch" onChange={e => formHandle(e)} className="form-control" required />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">SKU No.</p>
                                        <input type="text" value={formValue.sku} name="sku" onChange={e => formHandle(e)} className="form-control" required />
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Replacement (days)</p>
                                        <input type="number" name="replacement" value={formValue.replacement} onChange={e => formHandle(e)} className="form-control" required />
                                    </div>
                                </div>
                                <div className="col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Descrption</p>
                                        <div className="text-editor bg-white rounded">
                                            <ReactQuill theme="snow" value={descriptionValue} onChange={setDescriptionValue} placeholder={"Write something awesome..."} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">key features</p>
                                        <div className="text-editor bg-white">
                                            <EditorToolbar />
                                            <ReactQuill theme="snow" value={keyvalue} onChange={setKeyValue} placeholder={"Write something awesome..."} modules={modules} formats={formats} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Specification</p>
                                        <div className="text-editor bg-white">
                                            <ReactQuill theme="snow" value={specificationvalue} onChange={setSpecificationValue} placeholder={"Write something awesome..."} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 mb-2">
                                    <div className="form-group">
                                        <p className="mb-0 fw-bold">Other Info</p>
                                        <div className="text-editor bg-white">
                                            <ReactQuill theme="snow" name="other_info" value={otherValue} onChange={setOtherValue} placeholder={"Write something awesome..."} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 ">
                                    <div className="form-group text-end">
                                        <button className="btn btn-primary " type="submit" onClick={e => submit(e)} disabled={loading}>{loading ? "saving..." : "Post"}</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    : null}
            </Container>

            <CSSTransition
                in={modalShow}
                timeout={2000}
                classNames="modal-transition"
                unmountOnExit
            >
                <Modal show={modalShow} onHide={closeModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Product Images</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={e => updateImageSubmit(e)}>
                            <div className="form-group mb-3">
                                <p className="mb-1">Upload Image</p>
                                <input type="file" accept="image/*" name="imageLink" onChange={e=>updateImageHandle(e)} className="form-control" required/>
                                <div className="d-flex justify-content-end gap-2 pt-2">
                                    {(updateImageProgress && updateImageProgress !== 100) ? <progress className="flex-grow-1" value={updateImageProgress} max="100" style={{ height: "5px" }} /> : null}
                                    {updateImageProgress ? <small className="fs-10 text-success">{updateImageProgress !== 100 ? `${updateImageProgress} %` : 'success'} </small> : null} 
                                </div>
                            </div>
                            <div className="form-group mb-3">
                                <p className="mb-1">Choose Image Position</p>
                                <select name="position" className="form-select" onChange={e => setUpdateImageValue({ ...updateImageValue, [e.target.name]: e.target.value })} required >
                                    <option value="" disabled={updateImageValue.position}>Choose position</option>
                                    {formValue?.images?.map((imageValue, i) => {
                                        return (
                                            <option value={i} key={i}>{i + 1}</option>
                                        )
                                    })}
                                    <option value={formValue?.images?.length} > At Last</option>
                                </select>
                            </div>
                            <div className="text-end">
                                <button type="submit" className="btn btn-primary" disabled={updateImageLoading}>Update</button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </CSSTransition>
        </>
    )
}

export default UpdateProduct
