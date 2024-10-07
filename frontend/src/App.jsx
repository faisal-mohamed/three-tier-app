import React, { useEffect, useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Fetch items from API
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/items`)
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  // Add new item
  const addItem = () => {
    fetch(`${import.meta.env.VITE_API_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    })
      .then(res => res.json())
      .then(item => setItems([...items, item]));
  };

  const handleDelete = (item) => {
      console.log("id: ", item.id);

      fetch(`${import.meta.env.VITE_API_URL}/items/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      })

      setItems(prevItems => prevItems.filter(i => i.id !== item.id));
      
  }

  return (
    <div>
      <h1>CRUD App</h1>
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button onClick={addItem}>Add Item</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - {item.description}
            <button onClick={() => handleDelete(item)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
