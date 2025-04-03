
import axios from 'axios';
export const fetchListItems=async()=>{
    const response = await axios.get('fetchlist');
    return response.data
}
    export const addListItems = async (taskname, status) => {
        console.log(taskname,status)
        try {
            const response = await axios.post('addlist', {
                taskname: taskname,
                status: status
            });
            console.log(response)

            return response.data.task; // Return the new task
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    export const updateTaskStatus = async (taskId, status) => {
        // Update task status
        try {
            const res = await axios.put(`updatetask/${taskId}/status`, { status });
            return res.data;
        } catch (error) {
            console.error('Error updating task status:', error);
            throw error;
        }
    };
    
    export const deleteListItems = async (taskId) => {
        // Delete a task
        try {
            const res = await axios.delete(`deletetask/${taskId}`);
            return res.data;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    };