import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3030/';

export const getTodosList = async () => {
  const todos = await axios.get('todos');
  return todos.data;
};

export const getTodoById = async (id) => {
  const todo = await axios.get(`todos/${id}`);
  return todo.data;
};

export const addTodo = async (payload) => {
  const todos = await axios.post('todos', payload);
  return todos.data;
};

export const updateTodo = async ({ id, ...payload }) => {
  const todo = await axios.put(`todos/${id}`, payload);
  return todo.data;
};

export const deleteTodo = async (id) => {
  await axios.delete(`todos/${id}`);
  return id;
};
