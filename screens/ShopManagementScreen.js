import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Dimensions } from 'react-native';
import { storeData, getData } from '../utils/storageHelper';

export default function ManageShopsScreen() {
  const [shops, setShops] = useState([]);
  const [newShop, setNewShop] = useState('');
  
  // Load saved shops on component mount
  useEffect(() => {
    loadShops();
  }, []);
  
  const loadShops = async () => {
    const savedShops = (await getData('shops')) || []; // Retrieve 'shops' data
    setShops(savedShops);
  };
  
  const addShop = async () => {
    if (newShop.trim()) {
      const updatedShops = [...shops, { id: Date.now(), name: newShop }];
      setShops(updatedShops);
      await storeData('shops', updatedShops); // Save updated shops list
      setNewShop('');
    }
  };
  
  const deleteShop = async (id) => {
    const updatedShops = shops.filter((shop) => shop.id !== id);
    setShops(updatedShops);
    await storeData('shops', updatedShops); // Save after deletion
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Shops</Text>
      
      {/* Shop input and add button */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter Shop Name"
          value={newShop}
          onChangeText={setNewShop}
          style={styles.input}
        />
        <TouchableOpacity onPress={addShop} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Shop</Text>
        </TouchableOpacity>
      </View>
      
      {/* List of shops */}
      <FlatList
        data={shops}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.shopItem}>
            <Text style={styles.shopName}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteShop(item.id)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window'); // Get screen dimensions

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f4f4f4' 
  },
  title: { 
    fontSize: width > 400 ? 28 : 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    color: '#333' 
  },
  inputContainer: { 
    flexDirection: 'row', 
    marginBottom: 20 
  },
  input: { 
    flex: 1, 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 12, 
    borderRadius: 8, 
    fontSize: 16, 
    marginRight: 10,
    backgroundColor: '#fff'
  },
  addButton: { 
    backgroundColor: '#4CAF50', 
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  addButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  shopItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 12, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    marginBottom: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    elevation: 3
  },
  shopName: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  deleteText: { 
    color: 'red', 
    fontWeight: 'bold' 
  },
});
