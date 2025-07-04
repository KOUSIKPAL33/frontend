import React from 'react'
import axios from 'axios';
import { toast } from 'react-toastify';
import baseurl from '../Url';

function Showaddress(props) {

  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("You are not logged in", {
        autoClose: 1500,
      });
      return;
    }

    try {
      const response = await axios.delete(`${baseurl}/address/delete`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { addressId: props.id },
      }
      );

      if (response.data.success) {
        toast.success("Address deleted successfully", {
          autoClose:1500,
        })
        props.onDelete(props.id);
      } else {
        toast.error("Failed to delete address", {
          autoClose:1500,
        });
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  return (
    <div className='d-flex justify-content-between  p-3 px-4 mb-2 bg-white'>
      <div>
        <p className='m-0'> 
          <input type="radio" name="selectedAddress" id="" checked={props.isSelected}
            onChange={() => props.onSelect(props.id)}
          
          /> 
          <b>{props.name}</b> {props.mobileno}</p>
        <p className='m-0 p-3 pb-0'>{props.location}</p>
      </div>
      <div className='d-flex flex-column gap-2' >
        <button type='button' className='btn btn-danger' onClick={handleDelete}>Delete </button>
      </div>

    </div>
  )
}

export default Showaddress
