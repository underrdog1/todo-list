import './App.css';
import { useState, useEffect } from 'react';
import { Task } from './Task';
import '@fontsource/winky-sans';

function App() {

  const [todoList, setTodoList] = useState(() => {
    const savedTodoList = localStorage.getItem('todoList');
    const timestamp = localStorage.getItem('timestamp');
    const resetEnabled = localStorage.getItem('resetEnabled') === 'true';

    if (savedTodoList && timestamp && resetEnabled) {
      const lastUpdated = new Date(parseInt(timestamp));
      const now = new Date();
      const hoursDifference = (now - lastUpdated) / (1000 * 60 * 60); 

      // If 24 hours have passed, reset the tasks
      if (hoursDifference >= 24) {
        localStorage.setItem('timestamp', Date.now().toString()); // Update timestamp
        return JSON.parse(savedTodoList).map(task => ({
          ...task,
          completed: false, // Reset the task status
        }));
      }
    }
    return savedTodoList ? JSON.parse(savedTodoList) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [resetEnabled, setResetEnabled] = useState(localStorage.getItem('resetEnabled') === 'true');
  const [resetNotification, setResetNotification] = useState(false); // Notification state

  useEffect(() => {
    if (resetNotification) {
      setTimeout(() => {
        setResetNotification(false); // Hide notification after 3 seconds
      }, 3000);
    }
  }, [resetNotification]);

  const handleChange = (event) => {
    setNewTask(event.target.value);
  };

  const addTask = () => {
    if (!newTask) return;
    const task = {
      id: todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1,
      taskName: newTask,
      completed: false,
    };
    const updatedTodoList = [...todoList, task];
    setTodoList(updatedTodoList);
    localStorage.setItem('todoList', JSON.stringify(updatedTodoList));
    localStorage.setItem('timestamp', Date.now().toString()); 

    setNewTask('');
  };

  const deleteTask = (id) => {
    const updatedTodoList = todoList.filter((task) => task.id !== id);
    setTodoList(updatedTodoList);
    localStorage.setItem('todoList', JSON.stringify(updatedTodoList));
    localStorage.setItem('timestamp', Date.now().toString()); 
  };

  const completeTask = (id) => {
    const updatedTodoList = todoList.map((task) => {
      if (task.id === id) {
        return { ...task, completed: true };
      }
      return task;
    });
    setTodoList(updatedTodoList);
    localStorage.setItem('todoList', JSON.stringify(updatedTodoList));
    localStorage.setItem('timestamp', Date.now().toString());
  };

  const handleResetToggle = () => {
    const newResetEnabled = !resetEnabled;
    setResetEnabled(newResetEnabled);
    localStorage.setItem('resetEnabled', newResetEnabled.toString());

    
    if (!newResetEnabled) {
      localStorage.removeItem('timestamp');
    }
  };

  useEffect(() => {
    if (resetEnabled) {
      const timestamp = localStorage.getItem('timestamp');
      const lastUpdated = new Date(parseInt(timestamp));
      const now = new Date();
      const hoursDifference = (now - lastUpdated) / (1000 * 60 * 60);

    
      if (hoursDifference >= 24) {
        setResetNotification(true); 
        localStorage.setItem('timestamp', Date.now().toString()); 
        const resetTasks = todoList.map(task => ({
          ...task,
          completed: false, 
        }));
        setTodoList(resetTasks);
        localStorage.setItem('todoList', JSON.stringify(resetTasks)); 
      }
    }
  }, [resetEnabled, todoList]);

  return (
    <div className="App">
      <h1>To-do List</h1>
      
      {resetNotification && <div className="notification">Tasks have been reset due to 24-hour interval!</div>}

      <div className="settings">
        <label>
          Enable 24-hour task reset:
          <input
            type="checkbox"
            checked={resetEnabled}
            onChange={handleResetToggle}
          />
        </label>
      </div>

      <div className="addTask-container">
        <input
        value={newTask} 
        onChange={handleChange} 
        />
        <button className="addTask-btn" onClick={addTask}>Add Task</button>
      </div>

      <div className="list"></div>
      {todoList.map((task) => (
        <Task
          key={task.id}
          taskName={task.taskName}
          id={task.id}
          completed={task.completed}
          deleteTask={deleteTask}
          completeTask={completeTask}
        />
      ))}
    </div>
  );
}

export default App;