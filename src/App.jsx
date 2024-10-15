import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import EditModal from './components/EditModal';

//Axios customization
axios.defaults.baseURL = 'http://localhost:3000';

function App() {
const [todos, setPosts] = useState([]); 
const [todoText, setTodoText] = useState('');
const [showEditModal,setShowEditModal] = useState(false);
const [editItem, setEditItem] = useState({})

const inputRef = useRef();

//It runs the function when the component appears on the screen
  useEffect(() => {
    // Sending a GET request to our own API
   axios.get('/todo')
   // Assigning the received data to the state
   .then((res) => setPosts(res.data));
  }, []);

  //It runs when the submit button is clicked
  const handleSubmit = (e) => {
      e.preventDefault();
      //The object to be sent to the API is prepared
      const newTodo = {
        id: new Date().getTime,
        title: todoText,
        date: new Date().toLocaleString(),
        isDone: false,
      };
      //Sending the prepared object to the API
      axios.post('/todo', newTodo)
      .then(() => setPosts([...todos, newTodo]));

      //Clearing the input
      inputRef.current.value = '';
      //Focusing on the input
      inputRef.current.focus();

  };

  // It runs when the delete button is pressed
  const handleDelete = (id) => {
    axios.delete(`/todo/${id}`)
    // If it is deleted from the API, remove it from the state as well
    .then(() => {
      // Removing the todo to be deleted from the array
    const filtred =  todos.filter((todo) => todo.id !== id);
    setPosts(filtred);
    });
  };

   //It runs when the checkbox is clicked
  const handleEdit = (todo) => {
    // The updated version of the object to be sent has been prepared
    var updatedTodo = {...todo, isDone: !todo.isDone};

    //The updated version has been sent to the API
    axios.put(`/todo/${todo.id}`, updatedTodo)
    // Update the state if the API is updated
    .then(()=> {
      //Creating a copy
      const cloneTodos = [...todos];
      // Find the index of the element
      const index = cloneTodos.findIndex((item) => item.id === todo.id);
      cloneTodos.splice(index, 1, updatedTodo);

      //Assign the updated version to the state
      setPosts(cloneTodos);
    });
  };

  // It runs when the edit button is clicked
  const handleChange = (todo) => {
    setEditItem(todo);
    setShowEditModal(true);
  };
  const handleChangeConfirm = () => {
    // Update the API
    axios.put(`/todo/${editItem.id}`, editItem)
    .then(() => {
      const clone = [...todos];
      const index = clone.findIndex((item) => item.id === editItem.id);
      clone.splice(index, 1, editItem);
      setPosts(clone);
    });

    
    setShowEditModal(false);
  };

  return (
    <div className='container my-5'>
      <h2>Posts</h2>
      <form onSubmit={handleSubmit} className='d-flex'>
        <input  onChange={(e) => setTodoText(e.target.value) } ref={inputRef}type="text" className='form-control'/>
        <button className='btn btn-danger'>Submit</button>
      </form>
      <ul className='list-group mt-4'>
        {todos.map((todo) => (
        <li className='list-group-item d-flex justify-content-between align-items-center'>
          <span>
            <input onClick={() => handleEdit(todo)} checked={todo.isDone} type="checkbox" />
            {todo.isDone ? "tamamlandı" : "devam ediyor"}
            </span>
          <span>{todo.title}</span>
         <div className='btn-group'>
         <button onClick={()=> handleChange(todo)} className='btn btn-info'>Edit</button>
          <button onClick={()=> handleDelete(todo.id)} className='btn btn-primary'>Delete</button>
         </div>
        </li>
        ))}
      </ul>
{showEditModal && <EditModal setShowEditModal={setShowEditModal} editItem={editItem} setEditItem={setEditItem} handleChangeConfirm={handleChangeConfirm}/>}
    </div>
  )
}

export default App;
