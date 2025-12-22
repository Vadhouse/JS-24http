import { useState } from 'react';
import './AddTodoForm.css';

const AddTodoForm = ({ onAdd, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    checked: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload = {
      title: formData.title,
      description: formData.description,
      checked: formData.checked.toString(),
      creationDate: new Date().toLocaleDateString('uk-UA'),
    };

    onAdd(payload);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <form className='add-todo-form' onSubmit={handleSubmit}>
      <h3>Додати нову todo</h3>

      <div className='form-group'>
        <label htmlFor='title'>Назва todo:</label>
        <input
          type='text'
          id='title'
          name='title'
          value={formData.title}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='description'>Опис todo:</label>
        <textarea
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className='form-group checkbox-group'>
        <label htmlFor='checked'>
          <input
            type='checkbox'
            id='checked'
            name='checked'
            checked={formData.checked}
            onChange={handleChange}
            disabled={isLoading}
          />
          Виконана
        </label>
      </div>

      <div className='form-actions'>
        <button type='button' onClick={onCancel} disabled={isLoading}>
          Скасувати
        </button>
        <button type='submit' disabled={isLoading || !formData.title.trim()}>
          {isLoading ? 'Додавання...' : 'Додати'}
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;
