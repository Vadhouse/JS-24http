import { useMutation, useQuery } from '@tanstack/react-query';
import './App.css';
import Loader from './components/Loader/Loader';
// import { useFetch } from './hooks/useFetch';
import axios from 'axios';
// import { useEffect, useState } from 'react';
import { getTodosList, addTodo } from './api/api';

axios.defaults.baseURL = 'http://localhost:3030/';

function App() {
  const { data, isFetching, refetch } = useQuery({
    queryKey: ['todoList'],
    queryFn: getTodosList,
  });

  const { mutateAsync } = useMutation({
    mutationFn: (payload) => addTodo(payload),
  });

  const addNewTodo = async () => {
    const payload = {
      title: 'todo 3',
      description: 'lorem ipsum dolor sit amet, consectetur adip',
      checked: 'false',
      creationDate: 'дата створення',
    };
    try {
      await mutateAsync(payload);
      await refetch();
    } catch (error) {}
  };

  return (
    <div>
      <header>
        <h1>Todos</h1>
      </header>
      <main>
        <ul>
          {isFetching ? (
            <Loader loading={isFetching} />
          ) : (
            data?.map((todo) => (
              <li key={todo.id} style={{ display: 'flex', gap: '10px' }}>
                <p>
                  {todo.title} {todo.creationDate}
                </p>
                <button>Delete</button>
                <button>зберегти</button>
              </li>
            ))
          )}
        </ul>
        <button onClick={addNewTodo}>{'додати'}</button>
      </main>
    </div>
  );
}

export default App;
