import React, { useEffect, useState }  from "react"
import { Helmet } from 'react-helmet-async';
import { Container  } from "@mui/material";
import ReactQuill from 'react-quill';
import axios from "axios";
import Swal from 'sweetalert2'; 
import { useNavigate, useParams } from "react-router-dom";
import {  useDispatch } from "react-redux"; 

import { Url, awsFileUrl } from "../url/url";
import 'react-quill/dist/quill.snow.css'; 
import "../App.css" 
import { blogdata } from "../redux/slice/blog";
 
 

const EditBlog = () => {  
    const navigate = useNavigate()
    const dispatch = useDispatch() 
    const [descriptionValue, setDescriptionValue] = useState(''); 
    const [loading, setLoading] = useState(false) 
    const {blogId} = useParams()

    const [formValue, setFormValue] = useState({});
    const [fileValue, setFileValue] = useState({}); 
    const [newImage, setNewImage] = useState(); 
    const [selectedImage, setSelectedImage] = useState(null);


    const [uploadLoading, setUploadLoading] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(false);


    const formHandle = (e)=>{
        const name = e.target.name
        const value = e.target.value 

        setFormValue({...formValue, [name]:value})
    } 

    // const handleImageChange = (event) => {
    //     const file = event.target.files[0]; 
    //     if (file) {
    //         setNewImage(file)
    //       const reader = new FileReader(); 
    //       reader.onload = (e) => {
    //         setSelectedImage(e.target.result);
    //       }; 
    //       reader.readAsDataURL(file);
    //     }
    //   };

      const fileHandle = async (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        setUploadLoading(true)
        try {
            if (file) {
                const response = await axios.post(`${Url}/api/createPresignedUrl/blogs`, { fileName: file.name, fileType: file.type })
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

    const submit = async(e)=>{
        e.preventDefault() 
        setLoading(true) 
        const {  title, image} = {...formValue}  
        if( descriptionValue && image ){  
            try { 
                const slug = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-'); 
                await axios.post(`${Url}/blog/update/${blogId}`, {...formValue, slug, "description": descriptionValue}).then((data)=>{ 
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Successfully Post',
                        showConfirmButton: false,
                        timer: 1500
                      }) 
                    setLoading(false)
                    dispatch(blogdata())
                    navigate("/dashboard/blog")
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
            Swal.fire('All fields are required')  
        }

    }

    const getDataFunc = async()=>{
        const response = await axios.get(`${Url}/blog/find/${blogId}`)
        setFormValue(response.data)
        setDescriptionValue(response.data.description) 
    }

    useEffect(()=>{
        getDataFunc()
    }, [])
    
  return (
    <>
    <Helmet>
        <title> Dashboard: Blog </title>
    </Helmet>
 

        <Container>
            <div className="mb-4 text-primary">
                <h2 className="text-capitalize">Update Blog</h2>
            </div>
            <div className="p-3 bg-light rounded shadow border">
                <form action="">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">title</p>
                                <input type="text" name="title" value={formValue && formValue.title} onChange={e=>formHandle(e)}  className="form-control" required/>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold"> Image</p> 
                                {/* <input type="file" name="image" onChange={e=>handleImageChange(e)} className="form-control" /> */}
                                <input type="file" name="image" onChange={e=>fileHandle(e)} className="form-control" required />
                                <div className="d-flex justify-content-end gap-2 pt-2">
                                        {uploadLoading && progressValue && <progress className="flex-grow-1" value={progressValue} max="100" style={{ height: "5px" }} />}

                                        {uploadStatus && <small className="fs-10 text-success">{uploadLoading ? `${progressValue} %` : 'success'} </small>}

                                    </div>
                            </div> 
                            <div className="mt-3 align-items-start">
                                <img src={`${formValue.image}`} alt="hel" className="w-100px me-3 rounded border p-1 bg-white h-auto d-inline-block" />
                                {/* {newImage && <img src={selectedImage} alt={selectedImage} className="w-100px me-3 rounded border p-1 bg-white d-inline-block" /> } */}
                            </div> 
                        </div> 
                        <div className="col-lg-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold"> Image Alt Tag</p>
                                <input type="text" name="altTag" value={formValue && formValue.altTag} onChange={e=>formHandle(e)} className="form-control" required />
                            </div>
                        </div>  
                        <div className="col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">short Description</p> 
                                <textarea className="form-control" name="shortDescription" value={formValue && formValue.shortDescription} onChange={e=>formHandle(e)}   rows="3" required />
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
                        <div className="col-12 ">
                            <div className="form-group text-end">
                                <button className="btn btn-primary " type="submit" disabled={(loading)} onClick={e=>submit(e)} >
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

export default EditBlog
