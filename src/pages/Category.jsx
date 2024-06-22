import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';

import Swal from 'sweetalert2'
import axios from 'axios'
// @mui
import { Button, Container, Stack, Typography } from '@mui/material';

// components
import Iconify from '../components/iconify';
import { Url, awsFileUrl } from '../url/url';
import { categorydata } from '../redux/slice/category'
import { subcategorydata } from '../redux/slice/subcategory'
import 'bootstrap/dist/css/bootstrap.min.css';
import { characterdata } from '../redux/slice/character';
import { subcharacterdata } from '../redux/slice/subcharacter';
// import './ModalExample.css';

const Category = () => {
  const dispatch = useDispatch()
  const categoryalldata = useSelector(store => store.category.data)
  const subcategoryalldata = useSelector(store => store.subcategory.data)
  const characteralldata = useSelector(store => store.character.data)
  const subcharacteralldata = useSelector(store => store.subcharacter.data)
  const [activeModal, setActiveModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [pathValue, setPathValue] = useState({});
  const [fileErrMsg, setFileErrMsg] = useState("")

  const [uploadLoading, setUploadLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(false);


  const openModal = (modalName, path, data = null) => {
    setActiveModal(modalName);
    setPathValue(path)
    if (data && data !== null) {
      setFormValue(data)
    }
  }
  const closeModal = () => {
    setActiveModal(null);
    setFormValue({})
  };
  const isModalOpen = (modalName) => {
    return activeModal === modalName;
  };
  const formHandle = (e) => {
    const name = e.target.name
    const value = e.target.value
    const lowerValue = value.toLowerCase();
    setFormValue({ ...formValue, [name]: lowerValue })
  }
  const fileHandle = (e) => {
    setFileErrMsg('')
    const name = e.target.name
    const file = e.target.files[0]
    if (file.size < 100000) {
      setFormValue({ ...formValue, [name]: file })
    } else {
      setFileErrMsg('Please keep file size less than 100 kb')
    }
  }
  const deleteFunc = async (path) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want delete this subcategory",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`${Url}${path}`).then(() => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Item Delete Successfully',
            showConfirmButton: false,
            timer: 1000
          })
          dispatch(categorydata())
          dispatch(subcategorydata())
          dispatch(characterdata())
          dispatch(subcharacterdata())
        }).catch((error) => {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'something went wrong',
            showConfirmButton: false,
            timer: 1500
          })
        })

      }
    })
  }
  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await axios.post(`${Url}${pathValue}`, formValue).then((e) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Create Success',
          showConfirmButton: false,
          timer: 1500
        })
        setFormValue({})
        setPathValue('')
        setLoading(false)
        dispatch(categorydata())
        dispatch(subcategorydata())
        dispatch(characterdata())
        dispatch(subcharacterdata())
        closeModal()
      })
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
    setLoading(false)
  }
  const bannerUpdate = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      await axios.post(`${Url}${pathValue}`, formValue).then((e) => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Create Success',
          showConfirmButton: false,
          timer: 1500
        })
        setFormValue({})
        setPathValue('')
        setLoading(false)
        dispatch(categorydata())
        dispatch(subcategorydata())
        dispatch(characterdata())
        dispatch(subcharacterdata())
        closeModal()
      })
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
    setLoading(false)
  }
  const bannerFileHandle = async (e) => {
    const file = e.target.files[0]
    const name = e.target.name
    setUploadLoading(true)

    const targetApi = activeModal === "categoryBanner" ? 'category' : activeModal === "characterBanner" ? 'character' : undefined;
    console.log("targetApi", targetApi);
    setFileErrMsg('')

    try {
      if (file) {
        if (file.size < 1000000 && targetApi) {
          const response = await axios.post(`${Url}/api/createPresignedUrl/${targetApi}`, { fileName: file.name, fileType: file.type })
          if (response.status === 200) {
            const { preSignedUrl, key, fileType } = response?.data
            const responseFileSave = await axios.put(preSignedUrl, file, {
              onUploadProgress: (progressEvent) => {
                const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgressValue(progress)
              },
            })
            console.log("responseFileSave", responseFileSave);
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
        else {
          setFileErrMsg('Please keep file size less than 100 kb')
        }
      }

    } catch (error) {
      console.log(error);
      setUploadLoading(false)
    }
    setUploadLoading(false)
  }

  return (
    <>
      <Helmet>
        <title> Category </title>
      </Helmet>

      <Container className='mb-3 border-bottom pb-3 border-top pt-3'>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Category
          </Typography>
          <div className='d-flex align-items-center gap-3'>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => openModal('category', '/api/category/create')}> Add New Category </Button>
            {categoryalldata.length > 0 &&
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => openModal('subcategory', '/api/subcategory/create')}> Add New SubCategory</Button>}
          </div>

        </Stack>
        <div className="subcategory-wrap mb-4">
          <div className="d-flex ">
            {categoryalldata.length > 0 ? categoryalldata.map((categoryValue) => {
              return (
                <div key={categoryValue._id} className='border'>
                  <div className="border-bottom">

                    <div className="d-flex align-items-center justify-content-between bg-light gap-3 px-3 py-2">
                      <h5 className='text-primary text-capitalize mb-0'>{categoryValue.category}</h5>

                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm" onClick={() => openModal('categoryBanner', `/api/category/banner/${categoryValue._id}`)}> <i className="fa-regular fa-image text-success fa-lg" /></button>
                        {subcategoryalldata && subcategoryalldata.filter(data => data.category === categoryValue.category).length <= 0 ?
                          <button className='border-0 bg-transparent' onClick={() => deleteFunc(`/api/category/delete/${categoryValue._id}`)}><i className="fa-solid fa-trash text-danger fa-sm" /></button> : null}
                      </div>
                    </div>
                    {categoryValue.imageUrl &&
                      <div className='px-3 pb-2'>
                        <img src={categoryValue.imageUrl} alt="toynique" style={{ width: "250px" }} />
                      </div>}
                  </div>


                  <div>
                    {subcategoryalldata && subcategoryalldata.filter(data => data.category === categoryValue.category).map(subcategoryValue => {
                      return (
                        <div key={subcategoryValue._id} className='d-flex gap-4 justify-content-between py-2 align-items-center px-3 shadow-sm'>
                          <p className='mb-0 text-capitalize'>{subcategoryValue.subcategory}</p>
                          <div className="d-flex align-items-cente gap-2">
                            <button className='btn py-0 btn-sm btn-warning' onClick={() => openModal('subcategory', `/api/subcategory/update/${subcategoryValue._id}`, { category: subcategoryValue.category, subcategory: subcategoryValue.subcategory })}>edit</button>
                            <button className='btn py-0 btn-sm btn-danger' onClick={() => deleteFunc(`/api/subcategory/delete/${subcategoryValue._id}`)}>remove</button>
                          </div>

                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            }) : <div className='text-center w-100'>NO Category & Subcategory</div>}
          </div>
        </div>
      </Container>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Character & Subcharacter
          </Typography>
          <div className='d-flex align-items-center gap-3'>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => openModal('character', '/api/character/create')}> Add New character </Button>
            {characteralldata.length > 0 &&
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => openModal('subcharacter', '/api/subcharacter/create')}> Add New SubCharacter</Button>}
          </div>

        </Stack>
        <div className="subcategory-wrap mb-4">
          <div className="d-flex ">
            {characteralldata.length > 0 ? characteralldata.map((characterValue) => {
              return (
                <div key={characterValue._id} className='border'>
                  <div className="border-bottom">
                    <div className="d-flex align-items-center border-bottom justify-content-between bg-light gap-3 px-3 py-2">
                      <h5 className='text-primary text-capitalize mb-0'>{characterValue.character}</h5>
                      <div className="d-flex align-items-center gap-2">
                        <button className="edit btn  btn-sm" onClick={() => openModal('characterBanner', `/api/character/banner/${characterValue._id}`)}> <i className="fa-regular fa-image text-success fa-lg" /></button>

                        {subcharacteralldata && subcharacteralldata.filter(data => data.character === characterValue.character).length <= 0 ?
                          <button className='border-0 bg-transparent' onClick={() => deleteFunc(`/api/character/delete/${characterValue._id}`)}><i className="fa-solid fa-trash text-danger fa-sm" /></button> : null}
                      </div>
                    </div>
                    {true &&
                      <div className='px-3 pb-2'>
                        <img src={characterValue.imageUrl} alt="toynique" style={{ width: "250px" }} />
                      </div>
                    }
                  </div>
                  <div>

                    {subcharacteralldata && subcharacteralldata.filter(data => data.character === characterValue.character).map(subcharacterValue => {
                      return (
                        <div key={subcharacterValue._id} className='d-flex gap-4 justify-content-between py-2 align-items-center px-3 shadow-sm'>
                          <p className='mb-0 text-capitalize'>{subcharacterValue.subcharacter}</p>
                          <div className="d-flex align-items-cente gap-2">
                            <button className='btn py-0 btn-sm btn-warning' onClick={() => openModal('subcharacter', `/api/subcharacter/update/${subcharacterValue._id}`, { character: subcharacterValue.character, subcharacter: subcharacterValue.subcharacter })}>edit</button>
                            <button className='btn py-0 btn-sm btn-danger' onClick={() => deleteFunc(`/api/subcharacter/delete/${subcharacterValue._id}`)}>remove</button>
                          </div>

                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            }) : <div className='text-center h-100 w-100'>No Character & SubCharacter</div>}
          </div>
        </div>
      </Container>


      <CSSTransition
        in={isModalOpen('category')}
        timeout={300}
        classNames="modal-transition"
        unmountOnExit
      >
        <Modal show={isModalOpen('category')} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="" onSubmit={(e) => formSubmit(e)}>
              <div className="form-group mb-2">
                <p className='mb-1'>Category</p>
                <input type="text" name="category" value={formValue && formValue.category} className='form-control' onChange={e => formHandle(e)} placeholder='enter category name' />
              </div>
              <div className="form-group text-end ">
                <button className='btn btn-primary' type='submit' disabled={loading} >{!loading ? "Save" : "Saving..."}</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </CSSTransition>

      <CSSTransition
        in={isModalOpen('subcategory')}
        timeout={2000}
        classNames="modal-transition"
        unmountOnExit
      >
        <Modal show={isModalOpen('subcategory')} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Subcategory</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="" onSubmit={(e) => formSubmit(e)}>
              <div className="form-group mb-2">
                <p className='mb-1'>Subcateogry</p>
                <select name="category" id="" value={formValue && formValue.category} className='form-select' onChange={e => formHandle(e)} required>
                  <option value="">choose</option>
                  {categoryalldata && categoryalldata.map(categoryValue => {
                    return (
                      <option value={categoryValue.category} key={categoryValue._id}>{categoryValue.category}</option>
                    )
                  })}
                </select>
              </div>
              <div className="form-group mb-2">
                <p className='mb-1'>Category</p>
                <input type="text" name="subcategory" value={formValue && formValue.subcategory} className='form-control' onChange={e => formHandle(e)} placeholder='enter category name' required />
              </div>
              <div className="form-group text-end ">
                <button className='btn btn-primary' type='submit' disabled={loading} >{!loading ? "Save" : "Saving..."}</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </CSSTransition>

      <CSSTransition
        in={isModalOpen('character')}
        timeout={300}
        classNames="modal-transition"
        unmountOnExit
      >
        <Modal show={isModalOpen('character')} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Character</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="" onSubmit={(e) => formSubmit(e)}>
              <div className="form-group mb-2">
                <p className='mb-1'>character</p>
                <input type="text" name="character" value={formValue && formValue.character} className='form-control' onChange={e => formHandle(e)} placeholder='enter character name' />
              </div>
              <div className="form-group text-end ">
                <button className='btn btn-primary' type='submit' disabled={loading} >{!loading ? "Save" : "Saving..."}</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </CSSTransition>

      <CSSTransition
        in={isModalOpen('subcharacter')}
        timeout={2000}
        classNames="modal-transition"
        unmountOnExit
      >
        <Modal show={isModalOpen('subcharacter')} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Add Subcharacter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="" onSubmit={(e) => formSubmit(e)}>
              <div className="form-group mb-2">
                <p className='mb-1'>Subcateogry</p>
                <select name="character" id="" value={formValue && formValue.character} className='form-select' onChange={e => formHandle(e)} required>
                  <option value="">choose</option>
                  {characteralldata && characteralldata.map(characterValue => {
                    return (
                      <option value={characterValue.character} key={characterValue._id}>{characterValue.character}</option>
                    )
                  })}
                </select>
              </div>
              <div className="form-group mb-2">
                <p className='mb-1'>Category</p>
                <input type="text" name="subcharacter" value={formValue && formValue.subcharacter} className='form-control' onChange={e => formHandle(e)} placeholder='enter category name' required />
              </div>
              <div className="form-group text-end ">
                <button className='btn btn-primary' type='submit' disabled={loading} >{!loading ? "Save" : "Saving..."}</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </CSSTransition>


      <CSSTransition
        in={isModalOpen('categoryBanner')}
        timeout={2000}
        classNames="modal-transition"
        unmountOnExit
      >
        <Modal show={isModalOpen('categoryBanner')} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update category Banner Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="" onSubmit={(e) => bannerUpdate(e)}>
              <div className="form-group mb-3">
                <p className='mb-1'>Category Banner</p>
                <input type="file" accept="image/*" name='bannerImage' className='form-control' placeholder='Upload Banner Image' onChange={e => bannerFileHandle(e)} required />
                <small className='text-danger'>{fileErrMsg}</small>
                <div className="d-flex justify-content-end gap-2 pt-2">
                  {uploadLoading && progressValue && <progress className="flex-grow-1" value={progressValue} max="100" style={{ height: "5px" }} />}

                  {uploadStatus && <small className="fs-10 text-success">{uploadLoading ? `${progressValue} %` : 'success'} </small>}

                </div>
              </div>
              <div className="form-group text-end ">
                <button className='btn btn-primary' type='submit' disabled={fileErrMsg || loading || !formValue.bannerImage} >{!loading ? "Save" : "Saving..."}</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </CSSTransition>


      <CSSTransition
        in={isModalOpen('characterBanner')}
        timeout={2000}
        classNames="modal-transition"
        unmountOnExit
      >
        <Modal show={isModalOpen('characterBanner')} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Update Character Banner Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="" onSubmit={(e) => bannerUpdate(e)}>
              <div className="form-group mb-3">
                <p className='mb-1'>character Banner</p>
                <input type="file" accept="image/*" name='bannerImage' className='form-control' placeholder='Upload Banner Image' onChange={e => bannerFileHandle(e)} required />
                <small className='text-danger'>{fileErrMsg}</small>

                <div className="d-flex justify-content-end gap-2 pt-2">
                  {uploadLoading && progressValue && <progress className="flex-grow-1" value={progressValue} max="100" style={{ height: "5px" }} />}

                  {uploadStatus && <small className="fs-10 text-success">{uploadLoading ? `${progressValue} %` : 'success'} </small>}

                </div>
              </div>
              <div className="form-group text-end ">
                <button className='btn btn-primary' type='submit' disabled={fileErrMsg || loading || !formValue.bannerImage} >{!loading ? "Save" : "Saving..."}</button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      </CSSTransition>

      {/* <CSSTransition
        in={isModalOpen('categoryBanner')}
        timeout={2000}
        classNames="modal-transition"
        unmountOnExit
      >
        <Modal show={isModalOpen('categoryBanner')} onHide={closeModal} centered> 
          <Modal.Header closeButton>
            <Modal.Title>Add Subcharacter</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form action="" onSubmit={(e)=>bannerUpdate(e)}>
            <div className="form-group mb-2"> 
                <p className='mb-1'>Subcateogry</p>  
            </div>
            <div className="form-group mb-3"> 
                <p className='mb-1'>Category Banner</p> 
                <input type="file" accept="image/*" name='bannerImage' className='form-control' placeholder='Upload Banner Image' onChange={e=>fileHandle(e)}  required/>
                
                <small className='text-danger'>{fileErrMsg}</small>
            </div>
            <div className="form-group text-end "> 
                <button className='btn btn-primary' type='submit' disabled={fileErrMsg ||loading} >{!loading?"Save":"Saving..."}</button>
            </div>
            </form>
          </Modal.Body>
        </Modal> 
      </CSSTransition> */}

    </>
  );
}


export default Category
