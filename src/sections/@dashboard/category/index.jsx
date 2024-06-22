import * as React from 'react';

export default function CategoryList() {
  return (
    <>
    <section className='table-responsive'>
        <table className='table table-striped table-bordered text-center table-hover align-top'>
            <thead className='table-primary'>
                <tr className='align-top'>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>SubCategory</th>
                    <th>Remaining Product</th>
                    <th>Rating</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr className='text-center'>
                    <td  className=''>
                        <img src="/image/dooicon2.jpg" alt="" className='img-fluid mx-auto' style={{width : "70px"}}/>
                    </td>
                    <td className=''>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur optio delectus eligendi.</td>
                    <td  className=''>Category</td>
                    <td  className=''>SubCategory</td>
                    <td  className=''>12/36</td>
                    <td  className=''>4.5 </td>
                    <td  className=''>
                    <i className="fa-solid fa-pen-to-square text-primary mb-2 fa-lg " /> <br />
                    <i className="fa-solid fa-trash text-danger fa-lg"  />
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
    </>
  );
}