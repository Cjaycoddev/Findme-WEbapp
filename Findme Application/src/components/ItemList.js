import React, { useState, useEffect } from 'react';
import { fetchItems, createItem } from '../apiService';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const getItems = async () => {
            try {
                const response = await fetchItems();
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        getItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newItem = { name, description };
            await createItem(newItem);
            setItems([...items, newItem]);
            setName('');
            setDescription('');
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    return (
        <div>
            <h1>Items</h1>
            <ul>
                {items.map(item => (
                    <li key={item.id}>{item.name}: {item.description}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item name"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Item description"
                />
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
};

export default ItemList;
