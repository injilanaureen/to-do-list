
import { User,Trash2  } from 'lucide-react';
import {useState,useEffect} from 'react';
import {fetchListItems,addListItems,deleteListItems} from '@/lib/api';

export default function Welcome() {

    const [allTasks,setAlltasks]=useState([]);
    const [addTask, setAddTask] = useState({ taskname: "", status: "pending" });
    const [errorMessage, setErrorMessage] = useState(""); 


   const validatetaskInput=(e)=>{
     const enteredtask= e.target.value.trim().toLowerCase();
    
     setAddTask({...addTask,taskname:enteredtask});

     const checkDuplicate = allTasks.some(task=>task.taskname.trim().toLowerCase()===enteredtask);

     if(checkDuplicate){
        setErrorMessage('Task already exist');
     }
     else
     {
        setErrorMessage('');
     }
     }
   

    const handleAddTask=(e)=>{
        e.preventDefault()
        if(errorMessage){
            alert('Task is available,enter new task');
        }
        else if(!addTask.taskname){
            alert('task name cannot be empty');
        }else{
alert('task submitted')}
    }

     useEffect(()=>{
        async function getAllList()
        {
         const listItems= await fetchListItems();
         setAlltasks(listItems.all_tasks)
         }
        getAllList();
        },[]);

    return (
        <div className='max-w-200 border-2 p-3 flex flex-col mx-auto my-20'>
            
           <div className='flex gap-2'>
            <input type="checkbox" name='showall'/>
            <h3>Show All Tasks</h3>
           </div>

           {/** Add Task Form **/}
             <div className="flex items-center w-full mt-4"> 
                <span className="border-2 border-gray-100 p-2">
                    <User className='size-6 text-gray-200'/>
                </span>
                <form onSubmit={handleAddTask}>
                <input type="text"
                 onChange={validatetaskInput} 
                //  value={addTask.taskname}
                 placeholder='Enter Task'
                 className='p-2 border-2'/>
                <button type='submit' className='bg-violet-600 p-2'>Add</button>
                </form>
                {errorMessage && <p className="text-red-300">{errorMessage}</p>}
           </div>

           {/** Show All Task **/}

           <div>
            <div className='flex w-full'></div>
            <table className='m-2 border-2 w-full'>
                <thead className='w-6'>
                    <th className='w-6'>#</th>
                    <th className='w-6'>id</th>
                    <th className='w-6'>Task Name</th>
                    <th className='w-6'>Status</th>
                    <th className='w-6'>Created At</th> 
                    <th className='w-6'>Action</th> 
                    <th className='w-6'>User</th>
                    <th className='w-6'>Delete</th>
                </thead>
                <tbody className='w-6'>
                    {allTasks.map((task,index)=>(
                        <tr key={task.id || index}>
                    <td className='w-6'><input type='checkbox'/></td>
                    <td className='w-6'>{task.id}</td>
                    <td className='w-6'>{task.taskname}</td>
                    <td className='w-6'>{task.status}</td>
                    <td className='w-6'>{new Date(task.created_at).toLocaleString()}</td>
                    <td className={`w-6`}>
      <button className={`p-2 rounded-full ${task.status === 'pending' 
      ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
      }`}
      disabled={task.status !== 'pending'}
      >
      {task.status === 'pending' ? 'Start Task' : 'Task in Progress'}
  </button>
</td>
                    <td className='w-6'>{task.user || <User/>}</td>
                    <td className='w-6'><Trash2/></td>
                        </tr>
                    ))}
                    </tbody>
            </table>

           </div>
               
        </div>
    );
}
