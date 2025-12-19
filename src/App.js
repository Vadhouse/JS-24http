import './App.css';
import Loader from './components/Loader/Loader';
import { useFetch } from './hooks/useFetch';
import axios from 'axios';
import { useEffect, useState } from 'react';

axios.defaults.baseURL = 'http://localhost:3030/';

function App() {
  const [data, setData] = useState([]);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const { data: todos, isLoading, error } = useFetch('todos');

  useEffect(() => {
    setData(todos);
  }, [todos]);

  const addTodo = async () => {
    setIsPostLoading(true);
    const payload = {
      title: 'todo 3',
      description: 'lorem ipsum dolor sit amet, consectetur adip',
      checked: 'false',
      creationDate: 'дата створення',
    };
    const response = await axios.post('todos', payload);
    setData((prev) => [...prev, response.data]);
    setIsPostLoading(false);
  };

  console.log(todos);

  if (error) {
    return <div>something went wrong {error}</div>;
  }

  const deleteTodo = async (id) => {
    await axios.delete(`todos/${id}`);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const editTodo = async (id) => {
    const payload = {
      title: 'todo 4',
      description: 'lorem ipsum dolor sit amet, consectetur adip',
      checked: 'false',
      creationDate: 'дата створення',
    };
    const response = await axios.put(`todos/${id}`, payload);
    setData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return response.data;
        }
        return item;
      })
    );
  };

  return (
    <div>
      <header>
        <h1>Todos</h1>
      </header>
      <main>
        <ul>
          {isLoading ? (
            <Loader loading={isLoading} />
          ) : (
            data?.map((todo) => (
              <li key={todo.id} style={{ display: 'flex', gap: '10px' }}>
                <p>
                  {todo.title} {todo.creationDate}
                </p>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                <button onClick={() => editTodo(todo.id)}>зберегти</button>
              </li>
            ))
          )}
        </ul>
        <button disabled={isPostLoading} onClick={addTodo}>
          {isPostLoading ? 'loading...' : 'додати'}
        </button>
      </main>
    </div>
  );
}

export default App;
