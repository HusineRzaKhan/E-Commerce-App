import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button, TextInput, Checkbox } from 'react-native-paper';
import client from '../api/client';

export default function CategoryScreen() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [ratingFilter, setRatingFilter] = useState(false);

  const load = async () => {
    try {
      const params = {};
      if (category) params.category = category;
      const resp = await client.get('/products', { params });
      let data = resp.data || [];
      if (minPrice) data = data.filter(p => p.price >= Number(minPrice));
      if (maxPrice) data = data.filter(p => p.price <= Number(maxPrice));
      // ratingFilter not implemented on backend; placeholder
      setProducts(data);
    } catch (err) { console.warn(err); }
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={{ flex:1, padding:12 }}>
      <TextInput label="Category" value={category} onChangeText={setCategory} />
      <TextInput label="Min Price" value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" />
      <TextInput label="Max Price" value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" />
      <View style={{ flexDirection:'row', alignItems:'center' }}>
        <Checkbox status={ratingFilter ? 'checked' : 'unchecked'} onPress={() => setRatingFilter(!ratingFilter)} />
        <Text>Has reviews &gt;= 4 (placeholder)</Text>
      </View>
      <Button mode="contained" onPress={load}>Apply Filters</Button>

      <FlatList
        data={products}
        keyExtractor={p => p._id}
        renderItem={({ item }) => (
          <View style={{ padding:8, borderWidth:1, borderColor:'#ddd', marginTop:8 }}>
            <Text>{item.name}</Text>
            <Text>${item.price}</Text>
          </View>
        )}
      />
    </View>
  );
}
