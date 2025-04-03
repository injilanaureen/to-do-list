
import axios from 'axios';
export const fetchListItems=async()=>{
    const response = await axios.get('fetchlist');
    return response.data
}
export const addListItems=async()=>{
    const response = await axios.post('addlist');
    console.log(response)
}
export const deleteListItems=async()=>{
    const response = await axios.post('deletelist');
    console.log(response)
}