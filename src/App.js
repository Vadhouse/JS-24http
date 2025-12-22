import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import './App.css';
import Loader from './components/Loader/Loader';
import AddTodoForm from './components/Forms/AddTodoForm';
import EditTodoModal from './components/Forms/EditTodoModal';
import {
  getTodosList,
  getTodoById,
  addTodo,
  updateTodo,
  deleteTodo,
} from './api/api';

function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const queryClient = useQueryClient();

  // GET всіх todos
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['todoList'],
    queryFn: getTodosList,
  });

  // GET конкретної todo для редагування
  const {
    data: editingTodo,
    isLoading: isLoadingTodo,
    isError: isErrorTodo,
    error: errorTodo,
  } = useQuery({
    queryKey: ['todo', editingTodoId],
    queryFn: () => getTodoById(editingTodoId),
    enabled: !!editingTodoId,
  });

  // POST - додавання todo
  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList'] });
      setShowAddForm(false);
    },
  });

  // PUT - оновлення todo
  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList'] });
      queryClient.invalidateQueries({ queryKey: ['todo', editingTodoId] });
      setEditingTodoId(null);
    },
  });

  // DELETE - видалення todo
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todoList'] });
    },
  });

  const handleAddTodo = async (payload) => {
    try {
      await addMutation.mutateAsync(payload);
    } catch (error) {
      console.error('Помилка при додаванні todo:', error);
    }
  };

  const handleEditTodo = (id) => {
    setEditingTodoId(id);
  };

  const handleSaveTodo = async (payload) => {
    try {
      await updateMutation.mutateAsync(payload);
    } catch (error) {
      console.error('Помилка при збереженні todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цю todo?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Помилка при видаленні todo:', error);
        alert(
          'Помилка при видаленні todo: ' +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const handleCloseEditModal = () => {
    setEditingTodoId(null);
  };

  return (
    <div className='App'>
      <header>
        <h1>Todos</h1>
      </header>
      <main>
        {isLoading ? (
          <Loader loading={isLoading} />
        ) : isError ? (
          <div className='error-container'>
            <h2>Помилка завантаження</h2>
            <p>{error?.message || 'Не вдалося завантажити список todo'}</p>
          </div>
        ) : (
          <>
            {showAddForm ? (
              <AddTodoForm
                onAdd={handleAddTodo}
                onCancel={() => setShowAddForm(false)}
                isLoading={addMutation.isPending}
              />
            ) : (
              <button
                className='add-button'
                onClick={() => setShowAddForm(true)}
                disabled={isLoading}
              >
                Додати todo
              </button>
            )}

            {addMutation.isError && (
              <div className='error-message'>
                Помилка при додаванні:{' '}
                {addMutation.error?.response?.data?.message ||
                  addMutation.error?.message ||
                  'Невідома помилка'}
              </div>
            )}

            <ul className='todo-list'>
              {data?.length === 0 ? (
                <li className='no-todos'>Немає todo</li>
              ) : (
                data?.map((todo) => (
                  <li key={todo.id} className='todo-item'>
                    <div className='todo-content'>
                      <div className='todo-header'>
                        <h3
                          className={todo.checked === 'true' ? 'completed' : ''}
                        >
                          {todo.title}
                        </h3>
                        <span className='todo-date'>{todo.creationDate}</span>
                      </div>
                      <p className='todo-description'>{todo.description}</p>
                      <span
                        className={`todo-status ${
                          todo.checked === 'true' ? 'checked' : 'unchecked'
                        }`}
                      >
                        {todo.checked === 'true' ? 'Виконана' : 'Не виконана'}
                      </span>
                    </div>
                    <div className='todo-actions'>
                      <button
                        className='edit-button'
                        onClick={() => handleEditTodo(todo.id)}
                        disabled={
                          deleteMutation.isPending || updateMutation.isPending
                        }
                      >
                        Редагувати
                      </button>
                      <button
                        className='delete-button'
                        onClick={() => handleDeleteTodo(todo.id)}
                        disabled={
                          deleteMutation.isPending || updateMutation.isPending
                        }
                      >
                        {deleteMutation.isPending ? 'Видалення...' : 'Видалити'}
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </>
        )}

        {/* Модальне вікно для редагування */}
        {editingTodoId && (
          <>
            {isLoadingTodo ? (
              <div className='modal-overlay'>
                <div className='modal-content'>
                  <Loader loading={isLoadingTodo} size={50} />
                </div>
              </div>
            ) : (
              <EditTodoModal
                todo={editingTodo}
                onSave={handleSaveTodo}
                onClose={handleCloseEditModal}
                isLoading={updateMutation.isPending}
                error={isErrorTodo ? errorTodo : updateMutation.error}
              />
            )}
          </>
        )}

        {/* Глобальні індикатори завантаження */}
        {(deleteMutation.isPending || updateMutation.isPending) && (
          <div className='loading-overlay'>
            <Loader loading={true} size={50} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
