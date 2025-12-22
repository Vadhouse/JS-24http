import { useState, useEffect } from 'react';
import './EditTodoModal.css';

const EditTodoModal = ({ todo, onSave, onClose, isLoading, error }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    checked: false,
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title || '',
        description: todo.description || '',
        checked: todo.checked === 'true' || todo.checked === true,
      });
    }
  }, [todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave({
      ...formData,
      checked: formData.checked.toString(),
      id: todo.id,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  if (!todo) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h3>Редагувати todo</h3>
          <button
            className='close-button'
            onClick={onClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='edit-title'>Назва todo:</label>
            <input
              type='text'
              id='edit-title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className='form-group'>
            <label htmlFor='edit-description'>Опис todo:</label>
            <textarea
              id='edit-description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className='form-group checkbox-group'>
            <label htmlFor='edit-checked'>
              <input
                type='checkbox'
                id='edit-checked'
                name='checked'
                checked={formData.checked}
                onChange={handleChange}
                disabled={isLoading}
              />
              Виконана
            </label>
          </div>

          {error && (
            <div className='error-message'>
              Помилка: {error.message || 'Щось пішло не так'}
            </div>
          )}

          <div className='form-actions'>
            <button type='button' onClick={onClose} disabled={isLoading}>
              Скасувати
            </button>
            <button
              type='submit'
              disabled={isLoading || !formData.title.trim()}
            >
              {isLoading ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodoModal;
