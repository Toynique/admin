import React, { useState }  from "react"
import axios from "axios";
import Swal from 'sweetalert2';
import { useDispatch , useSelector } from 'react-redux'; 
import { Helmet } from 'react-helmet-async';
import { Container  } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import 'react-quill/dist/quill.snow.css'; 
import "../App.css"
import { Url } from "../url/url" ;
import { categorydata } from '../redux/slice/category'
import { subcategorydata } from '../redux/slice/subcategory'



 
 

const AddCategory = () => { 
    const categoryalldata = useSelector(store => store.category.data)
    const [formValue, setFormValue] = useState({});
    const [fileValue, setFileValue] = useState({})
    const [statusValue, setStatusValue] = useState("1");
    const [subCategoryData, setSubCategoryData] = useState({});
    const [catLoading, setCatLoading] = useState(false)
    const [subCatLoading, setSubCatLoading] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const filehandle = (e)=>{
        const file = e.target.files[0]
        const name = e.target.name
        setFileValue({...fileValue, [name]:file})
    }
    const formhandle = (e)=>{
        const name = e.target.name
        const value = e.target.value 
        const lowervalue = value.toLowerCase()
        setFormValue({...formValue, [name]:lowervalue})
    }
    const submit = async (e)=>{
        e.preventDefault();
        setCatLoading(true)
        const data = {...formValue} 
        const formData = new FormData()
        formData.append("category", data.category)  
        try {
            await axios.post(`${Url}/category`, formData).then((e)=>{
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Accout Create Success',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  setFormValue({})
                  setCatLoading(false)
                  dispatch(categorydata())
                  navigate("/dashboard/category")
            })
        } catch (error) {
            setCatLoading(false)
            console.log(error);
        }
        setCatLoading(false)
    }
    const subcategoryformhandle = (e)=>{
        const name = e.target.name
        const value = e.target.value 
        const lowervalue = value.toLowerCase()
        setSubCategoryData({...subCategoryData, [name]:lowervalue})
    }
    const subCategorySubmit = async (e)=>{
        e.preventDefault();
        setSubCatLoading(true)
        const data = {...subCategoryData, "status" : statusValue} 
        try {
            const {category, subcategory, status} = data
            if(category && subcategory && status){
            await axios.post(`${Url}/subcategory`, data).then((e)=>{
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Accout Create Success',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  setSubCatLoading(false)
                  dispatch(subcategorydata())
                  navigate("/dashboard/category")
            })
            }
            else{
                setSubCatLoading(false)
                Swal.fire('All fields are required')
            }
        } catch (error) {
            setSubCatLoading(false)
            console.log(error);
            console.log("subcategory not create");
        }
    }
    


  return (
    <>
    <Helmet>
        <title> Add Category </title>
    </Helmet>
 

        <Container className="mb-5 card px-3 py-4">
            <div className="mb-4 text-primary">
                <h2 className="text-capitalize">Add new Category</h2>
            </div>
            <div className="">
                <form action="">
                    <div className="row align-items-end">
                        
                        <div className="col-lg-4 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Image</p>
                                <input type="file" name="categoryimage" onChange={e=>filehandle(e)} className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Category Name</p>
                                <input type="text" name="category" value={formValue.category} onChange={e=>formhandle(e)} className="form-control" />
                            </div>
                        </div>
                        <div className="col-lg-4 col-12 mb-2 ">
                            <button className="btn btn-primary" disabled={catLoading} onClick={e=>submit(e)}>{catLoading? "saving..." : "Save"}</button>
                        </div>
                    </div>
                </form>
            </div>
        </Container>
        <Container className="mb-5 card px-3 py-4">
            <div className="mb-4 text-primary">
                <h2 className="text-capitalize">Add new Sub Category</h2>
            </div>
            <div className="">
                <form action="">
                    <div className="row align-items-end">
                        
                        <div className="col-lg-3 col-md-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Choose Category</p>
                                <select name="category" id="" className="form-select" onChange={e => subcategoryformhandle(e)}>
                                    <option disabled selected>Select</option>
                                    {categoryalldata.map((value, i)=>{
                                        return(
                                            <option value={value.category} key={i}>{value.category}</option>
                                        )
                                        })
                                    } 
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Sub Category Name</p>
                                <input type="text" className="form-control" name="subcategory" onChange={e => subcategoryformhandle(e)} />
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 mb-2">
                            <div className="form-group">
                                <p className="mb-0 fw-bold">Status</p>
                                <select name="status" id="" onChange={ e=>setStatusValue(e.target.value)} className="form-select">
                                    <option  defaultValue value={1}>Active</option> 
                                    <option   value={0}>Inactive</option> 
                                </select>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 mb-2 ">
                            <button className="btn btn-primary" disabled={subCatLoading} onClick={ e => subCategorySubmit(e)}>
                            {subCatLoading? "saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Container>
    </>
  )
}

export default AddCategory
