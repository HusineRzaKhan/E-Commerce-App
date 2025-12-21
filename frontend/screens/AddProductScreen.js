import React, { useState, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import client from '../api/client';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';

export default function AddProductScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image_url, setImageUrl] = useState('');

  const submit = async () => {
    // validation
    if (!name.trim() || !price) { alert('Name and price are required'); return; }
    try {
      const resp = await client.post('/products', { name, description, price: Number(price), stock: Number(stock), image_url });
      alert('Product added');
      setName(''); setDescription(''); setPrice(''); setStock(''); setImageUrl('');
    } catch (err) { console.warn(err); alert(err.response?.data?.message || 'Add product failed'); }
  };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { alert('Permission required to pick images'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, base64: false });
    if (!res.cancelled) {
      setImageUrl(res.uri);
    }
  };

  return (
    <ScrollView style={{ flex:1, padding:12 }}>
      <TextInput label="Name" value={name} onChangeText={setName} />
      <TextInput label="Description" value={description} onChangeText={setDescription} multiline />
      <TextInput label="Image URL" value={image_url} onChangeText={setImageUrl} />
      <Button mode="outlined" onPress={pickImage} style={{ marginTop:8 }}>Pick Image</Button>
      {image_url ? <Text style={{ marginTop:8 }}>Preview: {image_url}</Text> : null}
      <TextInput label="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <TextInput label="Stock" value={stock} onChangeText={setStock} keyboardType="numeric" />
      <Button mode="contained" onPress={submit} style={{ marginTop:12 }}>Add Product</Button>
    </ScrollView>
  );
}
