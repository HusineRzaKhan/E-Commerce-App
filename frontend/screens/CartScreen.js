import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';

export default function CartScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => { if (user) load(); }, [user]);

  const load = async () => {
    try {
      const resp = await client.get('/cart');
      setItems(resp.data);
    } catch (err) { console.warn(err); }
  };

  if (!user) return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Please login to see your cart.</Text>
      <Button mode="contained" onPress={() => navigation.navigate('Login')}>Login</Button>
    </View>
  );

  return (
    <View style={{ flex:1, padding:12 }}>
      <FlatList
        data={items}
        keyExtractor={i => i._id}
        renderItem={({ item }) => (
          <Card style={{ marginBottom:8 }}>
            <Card.Title title={item.product_id.name} subtitle={`Qty: ${item.quantity}`} />
            <Card.Content>
              <Text>${item.product_id.price}</Text>
            </Card.Content>
          </Card>
        )}
      />
      <Button mode="contained" onPress={() => navigation.navigate('Checkout')}>Proceed to Checkout</Button>
    </View>
  );
}
