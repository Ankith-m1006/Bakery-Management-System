import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddItemsScreen() {
  const [items, setItems] = useState([]); // List of items
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Load items from AsyncStorage on component load
  useEffect(() => {
    const loadItems = async () => {
      const storedItems = await AsyncStorage.getItem('items');
      if (storedItems) setItems(JSON.parse(storedItems));
    };
    loadItems();
  }, []);

  // Save items to AsyncStorage
  const saveItems = async (updatedItems) => {
    await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    setItems(updatedItems);
  };

  // Add or Modify an Item
  const addOrModifyItem = () => {
    if (!itemName || !itemPrice) {
      alert('Please enter item name and price.');
      return;
    }

    if (editMode) {
      // Modify existing item
      const updatedItems = items.map((item) =>
        selectedItems.includes(item.id)
          ? { ...item, name: itemName, price: parseFloat(itemPrice) }
          : item
      );
      saveItems(updatedItems);
      setEditMode(false);
      setSelectedItems([]);
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        name: itemName,
        price: parseFloat(itemPrice),
      };
      saveItems([...items, newItem]);
    }

    setItemName('');
    setItemPrice('');
  };

  // Delete Selected Items
  const deleteItems = () => {
    const updatedItems = items.filter((item) => !selectedItems.includes(item.id));
    saveItems(updatedItems);
    setSelectedItems([]);
  };

  // Handle selection toggle
  const toggleSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add or Manage Items</Text>

      {/* Input Fields */}
      <TextInput
        placeholder="Item Name"
        value={itemName}
        onChangeText={setItemName}
        style={styles.input}
      />
      <TextInput
        placeholder="Item Price"
        value={itemPrice}
        onChangeText={setItemPrice}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Add or Modify Button */}
      <TouchableOpacity style={styles.button} onPress={addOrModifyItem}>
        <Text style={styles.buttonText}>{editMode ? 'Modify Item' : 'Add Item'}</Text>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteButton} onPress={deleteItems}>
        <Text style={styles.buttonText}>Delete Selected Items</Text>
      </TouchableOpacity>

      {/* Item List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            {/* Use TouchableOpacity to toggle selection */}
            <TouchableOpacity
              onPress={() => toggleSelection(item.id)}
              style={[
                styles.checkbox,
                selectedItems.includes(item.id) && styles.checkboxSelected,
              ]}
            >
              <Text style={styles.checkboxText}>
                {selectedItems.includes(item.id) ? '✓' : ' '}
              </Text>
            </TouchableOpacity>

            <Text style={styles.itemText}>
              {item.name} - ₹{item.price.toFixed(2)}
            </Text>

            <TouchableOpacity
              style={styles.modifyButton}
              onPress={() => {
                setItemName(item.name);
                setItemPrice(item.price.toString());
                setEditMode(true);
                setSelectedItems([item.id]);
              }}
            >
              <Text style={styles.modifyText}>Modify</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF5733',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#e7e7e7',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: { fontSize: 16, flex: 1, marginLeft: 10 },
  modifyButton: { marginLeft: 10 },
  modifyText: { color: '#1E90FF', fontWeight: 'bold' },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  checkboxSelected: {
    backgroundColor: '#4CAF50',
  },
  checkboxText: {
    fontSize: 16,
    color: '#fff',
  },
});
