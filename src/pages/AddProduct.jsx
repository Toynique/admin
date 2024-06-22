import React, { useState } from "react"
import { Helmet } from 'react-helmet-async';
import { Container } from "@mui/material";
import ReactQuill from 'react-quill';
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Url, awsFileUrl } from "../url/url";
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "../utils/EditorToolbar";
import "../App.css"
import { productdata } from "../redux/slice/product";



const AddProduct = () => {


    const navigate = useNavigate()
    const dispatch = useDispatch()
    const categoryAllData = useSelector(store => store.category.data)
    const subcategoryAllData = useSelector(store => store.subcategory.data)
    const characterAllData = useSelector(store => store.character.data)
    const subcharacterAllData = useSelector(store => store.subcharacter.data)
    const [keyvalue, setKeyValue] = useState('');
    const [specificationvalue, setSpecificationValue] = useState('');
    const [otherValue, setOtherValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState(''); 
    const [loading, setLoading] = useState(false)
    const [formValue, setFormValue] = useState({}); 


    const [uploadLoading, setUploadLoading] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(false);


    const [multipleFileProgress, setMultipleFileProgress] = useState(0)
    const [totalfiles, setTotalFiles] = useState(0)
    const [totalUpload, setTotalUpload] = useState(0)
    const [multipleFileStatus, setMultipleFileStatus] = useState(false)

    const formHandle = (e) => {
        const name = e.target.name
        const value = e.target.value 
        setFormValue({ ...formValue, [name]: value })
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
    const thumbnailHandle = async (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        setUploadLoading(true)
        try {
            if (file) {
                const response = await axios.post(`${Url}/api/createPresignedUrl/products`, { fileName: file.name, fileType: file.type })
                if (response.status === 200) {
                    const { preSignedUrl, key } = response?.data
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

        // const { productName, height, width, depth, measurement, mrp, salePrice, discount, totalProduct, category, subcategory, sku, batch, shortDescription, replacement, altTag, character, subcharacter } = formValue
        if (descriptionValue ) {
            const dataValue = { ...formValue, "description": descriptionValue, "specification": specificationvalue, "keyFeature": keyvalue, "otherInfo": otherValue }
            try {
                await axios.post(`${Url}/product/add`, dataValue).then((data) => {
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
    return (
        <>
            <Helmet>
                <title> Dashboard: Blog | Minimal UI </title>
            </Helmet>


            <Container>
                <div className="mb-4 text-primary">
                    <h2 className="text-capitalize">Add new product</h2>
                </div>
                <div className="p-3 bg-light rounded shadow border">
                    <form action="" onSubmit={e => submit(e)}>
                        <div className="row">
                            <div className="col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">Product Name</p>
                                    <input type="text" name="productName" value={formValue.productName} onChange={e => formHandle(e)} className="form-control" required />
                                </div>
                            </div>
                            <div className="col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">short Description</p>
                                    <textarea className="form-control" name="shortDescription" value={formValue.shortDescription} onChange={e => formHandle(e)} rows="3" required />
                                </div>
                            </div>
                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">Image Alt Tag</p>
                                    <input type="text" name="altTag" value={formValue.altTag} onChange={e => formHandle(e)} className="form-control" required />
                                </div>
                            </div>

                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">Thumbnail Image</p>
                                    <input type="file" name="thumbnailImage" onChange={e => thumbnailHandle(e)} className="form-control" required />

                                    <div className="d-flex justify-content-end gap-2 pt-2">
                                        {uploadLoading && progressValue && <progress className="flex-grow-1" value={progressValue} max="100" style={{ height: "5px" }} />}

                                        {uploadStatus && <small className="fs-10 text-success">{uploadLoading ? `${progressValue} %` : 'success'} </small>}

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">Images</p>
                                    <input type="file" name="images" multiple onChange={e => fileHandle(e)} className="form-control" required />
                                    {multipleFileStatus && <progress className=" w-100" value={multipleFileProgress} max="100" style={{ height: "5px" }} />}
                                    {totalfiles !== 0 &&
                                        <div className="d-flex justify-content-end gap-2 pt-2 align-items-center">
                                            <progress className="flex-grow-1 " value={(totalUpload / totalfiles) * 100} max="100" style={{ height: "5px" }} />

                                            <small className="fs-10 text-secondary w-max-content">{totalUpload}/{totalfiles}  </small>
                                            <small className="fs-10 text-success w-max-content">{((totalUpload / totalfiles) * 100).toFixed(1)} % </small>

                                        </div>}

                                </div>
                            </div>
                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">MRP (<i className="fa-solid fa-indian-rupee-sign text-muted fa-sm" />)</p>
                                    <input type="number" name="mrp" value={formValue.mrp} onChange={e => formHandle(e)} className="form-control" required />
                                </div>
                            </div>
                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">Sale Price (<i className="fa-solid fa-indian-rupee-sign text-muted fa-sm" />)</p>
                                    <input type="number" name="salePrice" value={formValue.salePrice} onChange={e => formHandle(e)} className="form-control" required />
                                </div>
                            </div>
                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">Discount (%)</p>
                                    <input type="number" name="discount" value={formValue.discount} onChange={e => formHandle(e)} className="form-control" required />
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <div className="row">
                                    <div className="col-lg-3 col-md-6 mb-2">
                                        <div className="form-group">
                                            <p className="mb-0 fw-bold">Height</p>
                                            <input type="height" name="height" value={formValue.height} onChange={e => formHandle(e)} className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 mb-2">
                                        <div className="form-group">
                                            <p className="mb-0 fw-bold">Width</p>
                                            <input type="width" name="width" value={formValue.width} onChange={e => formHandle(e)} className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 mb-2">
                                        <div className="form-group">
                                            <p className="mb-0 fw-bold">Depth</p>
                                            <input type="depth" name="depth" value={formValue.depth} onChange={e => formHandle(e)} className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 mb-2">
                                        <div className="form-group">
                                            <p className="mb-0 fw-bold">size</p>
                                            <select name="measurement" value={formValue.measurement} onChange={e => formHandle(e)} className="form-select" required>
                                                <option value='' disabled={(formValue.measurement)} >Choose</option>
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
                                    <input type="number" name="totalProduct" value={formValue.totalProduct} onChange={e => formHandle(e)} className="form-control" required />
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
                                        <option value='' disabled={(formValue.subcategory)} > Choose</option>
                                        {formValue.category && subcategoryAllData.filter(val => val.category === formValue.category).map((value, i) => {
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
                                        <option disabled={(formValue.subcharacter)} value='' > Choose</option>
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
                                    <input type="text" name="batch" value={formValue.batch} onChange={e => formHandle(e)} className="form-control" required />
                                </div>
                            </div>
                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">SKU No.</p>
                                    <input type="text" name="sku" value={formValue.sku} onChange={e => formHandle(e)} className="form-control" required />
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
                                    <button className="btn btn-primary" type="submit" disabled={loading}  >
                                        {loading ? "Saving..." : "Post"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Container>
        </>
    )
}

export default AddProduct
