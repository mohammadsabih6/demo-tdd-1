import React from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, removeHandler, updateTodo,handleEdit }) => (
    <div>
      {todos.map((t, i) => (
        <TodoItem key={i} todo={t} handleEdit={handleEdit} removeHandler={removeHandler} updateTodo={updateTodo} />
      ))}
    </div>
  );

export default TodoList;
