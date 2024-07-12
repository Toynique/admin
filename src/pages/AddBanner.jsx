import React, { useState } from "react"
import { Helmet } from 'react-helmet-async';
import { Container } from "@mui/material";
import ReactQuill from 'react-quill';
import axios from "axios";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Url, awsFileUrl } from "../url/url";
import 'react-quill/dist/quill.snow.css';
import "../App.css"
import { blogdata } from "../redux/slice/blog";
import { bannerdata } from "../redux/slice/banner";



const AddBanner = () => {


    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [descriptionValue, setDescriptionValue] = useState('');
    const [loading, setLoading] = useState(false)

    const [formValue, setFormValue] = useState({});
    const [fileValue, setFileValue] = useState({});


    const [uploadLoading, setUploadLoading] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(false);


    const formHandle = (e) => {
        const name = e.target.name
        const value = e.target.value
        setFormValue({ ...formValue, [name]: value })
    }

    const fileHandle = async (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        setUploadLoading(true)
        try {
            if (file) {
                const response = await axios.post(`${Url}/api/createPresignedUrl/banner`, { fileName: file.name, fileType: file.type })
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
            try { 
                await axios.post(`${Url}/api/banner`, formValue ).then((data) => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Successfully Post',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    setLoading(false)
                    dispatch(bannerdata())
                    navigate("/dashboard/banner")
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

    return (
        <>
            <Helmet>
                <title> Dashboard: Blog | IMOFFICIAL </title>
            </Helmet>


            <Container>
                <div className="mb-4 text-primary">
                    <h2 className="text-capitalize">Post Blog</h2>
                </div>
                <div className="p-3 bg-light rounded shadow border">
                    <form action="" onSubmit={(e) => submit(e)}>
                        <div className="row">
                            <div className="col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold">title</p>
                                    <input type="text" name="title" onChange={e => formHandle(e)} className="form-control" required />
                                </div>
                            </div>

                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold"> Large screen banner</p>
                                    <input type="file" name="bannerLg" onChange={e => fileHandle(e)} className="form-control" required />
                                    <div className="d-flex justify-content-end gap-2 pt-2">
                                        {/* {uploadLoading && progressValue && <progress className="flex-grow-1" value={progressValue} max="100" style={{ height: "5px" }} />} */}

                                        {/* {uploadStatus && <small className="fs-10 text-success">{uploadLoading ? `${progressValue} %` : 'success'} </small>} */}

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold"> Tablet screen banner</p>
                                    <input type="file" name="bannerMd" onChange={e => fileHandle(e)} className="form-control" required />
                                    <div className="d-flex justify-content-end gap-2 pt-2">
                                        {/* {uploadLoading && progressValue && <progress className="flex-grow-1" value={progressValue} max="100" style={{ height: "5px" }} />} */}

                                        {/* {uploadStatus && <small className="fs-10 text-success">{uploadLoading ? `${progressValue} %` : 'success'} </small>} */}

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12 mb-2">
                                <div className="form-group">
                                    <p className="mb-0 fw-bold"> Mobile screen banner</p>
                                    <input type="file" name="bannerSm" onChange={e => fileHandle(e)} className="form-control" required />
                                    <div className="d-flex justify-content-end gap-2 pt-2">
                                        {/* {uploadLoading && progressValue && <progress className="flex-grow-1" value={progressValue} max="100" style={{ height: "5px" }} />} */}

                                        {/* {uploadStatus && <small className="fs-10 text-success">{uploadLoading ? `${progressValue} %` : 'success'} </small>} */}

                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold"> Image Alt Tag</p>
                                <input type="text" name="altTag" onChange={e=>formHandle(e)} className="form-control" required />
                            </div>
                        </div>  
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">short Description</p> 
                                <textarea className="form-control" name="shortDescription" onChange={e=>formHandle(e)}   rows="3" required />
                            </div>
                        </div> 
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Descrption</p>
                                <div className="text-editor bg-white rounded">
                                <ReactQuill   theme="snow" value={descriptionValue} onChange={setDescriptionValue} placeholder={"Write something awesome..."}  />
                                </div>
                            </div>
                        </div>  */}
                            <div className="col-12 ">
                                <div className="form-group text-end">
                                    <button className="btn btn-primary " type="submit" disabled={(loading)} >
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

export default AddBanner
