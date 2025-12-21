import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';

export default function CheckoutScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (route.params?.fromProduct) loadProduct(route.params.fromProduct);
    else loadCart();
  }, []);

  const loadProduct = async (productId) => {
    try {
      const resp = await client.get('/products/' + productId);
      setItems([{ product_id: resp.data._id, quantity: 1, price: resp.data.price }]);
      setTotal(resp.data.price);
    } catch (err) { console.warn(err); }
  };

  const loadCart = async () => {
    try {
      const resp = await client.get('/cart');
      const its = resp.data.map(i => ({ product_id: i.product_id._id, quantity: i.quantity, price: i.product_id.price }));
      setItems(its);
      setTotal(its.reduce((s, it) => s + (it.price * it.quantity), 0));
    } catch (err) { console.warn(err); }
  };

  const placeOrder = async () => {
    if (!user) return navigation.navigate('Login');
    if (!address || !address.trim()) { alert('Please enter shipping address'); return; }
    if (!items || items.length === 0) { alert('Your cart is empty'); return; }
    try {
      const resp = await client.post('/orders', { items, total_amount: total, shipping_address: address });
      navigation.navigate('OrderConfirmation');
    } catch (err) { console.warn(err); alert(err.response?.data?.message || 'Place order failed'); }
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <TextInput label="Full Name" value={name} onChangeText={setName} />
      <TextInput label="Address" value={address} onChangeText={setAddress} />
      <TextInput label="Phone" value={phone} onChangeText={setPhone} />
      <View style={{ marginTop: 12 }}>
        <Button mode="contained" onPress={placeOrder}>Place Order (Cash on Delivery)</Button>
      </View>
      <View style={{ marginTop:12 }}>
        <Text>Order total: ${total.toFixed(2)}</Text>
      </View>
    </View>
  );
}
