import { User, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchListItems, addListItems, deleteListItems, updateTaskStatus } from '@/lib/api'; 

export default function Welcome() {
    const [allTasks, setAlltasks] = useState([]);  
    const [allTaskwithoutCompleted, setAllTaskwithoutCompleted] = useState([]);  
    const [addTask, setAddTask] = useState({ taskname: "", status: "pending" });
    const [errorMessage, setErrorMessage] = useState("");
    const [showAll, SetShowAll] = useState(false);  

    const validatetaskInput = (e) => {
        const enteredtask = e.target.value.trim().toLowerCase();
        setAddTask({ ...addTask, taskname: enteredtask });

        const checkDuplicate = allTasks.some(task => task.taskname.trim().toLowerCase() === enteredtask);
        if (checkDuplicate) {
            setErrorMessage('Task already exists');
        } else {
            setErrorMessage('');
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (errorMessage) {
            alert('Task is available, enter a new task');
            return;
        }
        if (!addTask.taskname) {
            alert('Task name cannot be empty');
            return;
        }
        try {
            const newTask = await addListItems(addTask.taskname, addTask.status);
            if (newTask) {
                setAlltasks([...allTasks, newTask]);
                setAllTaskwithoutCompleted(prev => [...prev, newTask]);
                setAddTask({ taskname: "", status: "pending" });
            }
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    const handleStartTask = async (taskId) => {
        try {
            const updatedTask = await updateTaskStatus(taskId, 'in-progress');
            setAlltasks(prevTasks => prevTasks.map(task => 
                task.id === taskId ? { ...task, status: 'in-progress' } : task
            ));
            setAllTaskwithoutCompleted(prevTasks => prevTasks.map(task => 
                task.id === taskId ? { ...task, status: 'in-progress' } : task
            ));
        } catch (error) {
            console.error('Failed to start task:', error);
        }
    };

    const handleMarkAsCompleted = async (taskId) => {
        try {
            const updatedTask = await updateTaskStatus(taskId, 'completed');
            setAlltasks(prevTasks => prevTasks.map(task => 
                task.id === taskId ? { ...task, status: 'completed' } : task
            ));
           
            setAllTaskwithoutCompleted(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Failed to mark task as completed:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteListItems(taskId);
                setAlltasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
                setAllTaskwithoutCompleted(prevTasks => prevTasks.filter(task => task.id !== taskId));
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
        }
    };

    const handleShowAll = () => {
        SetShowAll(prevStatus => !prevStatus); 
    };

    useEffect(() => {
        async function getAllList() {
            const listItems = await fetchListItems();
            setAlltasks(listItems.all_tasks);
            setAllTaskwithoutCompleted([...listItems.pending_tasks, ...listItems.in_progress_tasks]);
        }
        getAllList();
    }, []);

    return (
        <div className='max-w-200 border-2 p-3 flex flex-col mx-auto my-20'>
            <div className='flex gap-2'>
                <input type="checkbox" name='showall' checked={showAll} onChange={handleShowAll} />
                <h3>Show All Tasks</h3>
            </div>

            <div className="flex items-center w-full mt-4">
                <span className="border-2 border-gray-100 p-2">
                    <User className='size-6 text-gray-200' />
                </span>
                <form onSubmit={handleAddTask}>
                    <input type="text"
                        onChange={validatetaskInput}
                        value={addTask.taskname}
                        placeholder='Enter Task'
                        className='p-2 border-2'
                        name='taskname'
                    />
                    <button type='submit' className='bg-violet-600 p-2'>Add</button>
                </form>
                {errorMessage && <p className="text-red-300">{errorMessage}</p>}
            </div>

            <div>
                <table className='m-2 border-2 w-full'>
                    <thead className='w-6'>
                        <tr>
                            <th className='w-6'>#</th>
                            <th className='w-6'>ID</th>
                            <th className='w-6'>Task Name</th>
                            <th className='w-6'>Status</th>
                            <th className='w-6'>Created At</th>
                            <th className='w-6'>Action</th>
                            <th className='w-6'>User</th>
                            <th className='w-6'>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(showAll ? allTasks : allTaskwithoutCompleted).length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center text-gray-500">No Pending or In Progress Tasks</td>
                            </tr>
                        ) : (
                            (showAll ? allTasks : allTaskwithoutCompleted).map((task, index) => (
                                <tr key={task.id || index}>
                                    <td className='w-6'>
                                        <input 
                                            type="checkbox" 
                                            checked={task.status === 'completed'} 
                                            onChange={() => handleMarkAsCompleted(task.id)} 
                                        />
                                    </td>
                                    <td className='w-6'>{task.id}</td>
                                    <td className='w-6'>{task.taskname}</td>
                                    <td className={`w-6 font-semibold 
                                        ${task.status === 'pending' ? 'text-yellow-500' : 
                                        task.status === 'in-progress' ? 'text-blue-500' : 
                                        'text-green-500'}`}>
                                        {task.status}
                                    </td>
                                    <td className='w-6'>{new Date(task.created_at).toLocaleString()}</td>
                                    <td className='w-6'>
    <button 
        className={`p-2 rounded-full 
            ${task.status === 'pending' 
                ? 'bg-green-500 hover:bg-green-700' 
                : task.status === 'in-progress'
                    ? 'bg-blue-500 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
            }`}
        disabled={task.status === 'completed'} 
        onClick={() => handleStartTask(task.id)}
    >
        {task.status === 'pending' ? 'Start Task' : 
            task.status === 'in-progress' ? 'Task in Progress' : 'Completed'
        }
    </button>
</td>

                                    <td className='w-6'>{task.user || <User />}</td>
                                    <td className='w-6'>
                                        <Trash2 onClick={() => handleDeleteTask(task.id)} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
