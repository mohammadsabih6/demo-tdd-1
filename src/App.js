import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import './App.css';
import { act } from '@testing-library/react';
import TodoItem from './components/TodoItem';

function App() {

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState('');
  const [saving, setSaving] = useState(false);
  const [edit, setEditData] = useState();
  const [date, setNewdate] = useState('');
  function onChange(e) {
    const value = e.target.value;
    setNewTodo(value);
  }
  function handleDate(e) {
    const value = e.target.value;
    setNewdate(value);
  }
  function removeTodo(id) {
    setTodos(todos.filter(t => t.id !== id));
  }

  function updateTodo(id) {
      setLoading(true);
    const newList = todos.map((todoItem) => {
      if (todoItem.id === id) {
        const updatedItem = { ...todoItem, completed: !todoItem.completed };
        return updatedItem;
      }
      return todoItem;
    });
    setTodos(newList);
    setLoading(false);
  }
  function handleEdit(i) {
    const data = todos[i];
    setNewTodo(data.newTodo);
    setNewdate(data.date);
    setEditData(i);
  }
  function handleUpdate(e){
    e.preventDefault();
    const updatedTodo = {
      ...todos[edit],
      title: newTodo,
      date: date
    };
    const newList = todos.map((todoItem, index) => {
      if (index === edit) {
        return updatedTodo;
      }
      return todoItem;
    });
    setTodos(newList);
    setNewTodo('');
    setNewdate('');
  }

  function addTodo(e) {
    e.preventDefault();
    const value = {
      userId: 3,
      id: Math.floor(Math.random() * 10000) + 1,
      title: newTodo,
      date: date,
      completed: false,
    };
  
    setSaving(true);
    fetch(process.env.REACT_APP_API_URL, {
      method: 'POST',
      body: JSON.stringify(value),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const newList = todos.concat({ ...result, id: value.id });
        newList.sort((a, b) => a.title.localeCompare(b.title));
        setTodos(newList);
        setSaving(false);
      });
  }
  
  useEffect(() => {
    async function fetchData() {
      const result = await fetch(process.env.REACT_APP_API_URL).then((response) =>
        response.json()
      );
      const sortedResult = result.sort((a, b) => a.title.localeCompare(b.title));
      act(() => {
        setTodos(sortedResult.slice(0, 5));
        setLoading(false);
      });
    }
    fetchData();
  }, []);
  return (
  <div className="App">
    <h1 className="header">My todo list</h1>
    {loading ? (
      'Loading'
    ) : (
      <TodoList todos={todos} handeleEdit={handleEdit} removeHandler={removeTodo} updateTodo={updateTodo} />
    )}

    <div className="add-todo-form">
      {saving ? (
        'Saving'
      ) : (
        <form onSubmit={addTodo}>
          <input type="text" onChange={onChange} />
          <input type="date"  onChange={handleDate}/>
          <button type="submit">Add new todo</button>
          <button type="update" onClick={handleUpdate}>Update</button>
        </form>
      )}
    </div>
  </div>
);

}

export default App;