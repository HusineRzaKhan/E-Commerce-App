import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Avatar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [sellerInfo, setSellerInfo] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'seller') loadSeller();
      else loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const resp = await client.get('/orders');
      setOrders(resp.data);
    } catch (err) { console.warn(err); }
  };

  const loadSeller = async () => {
    try {
      const resp = await client.get('/seller/dashboard');
      setSellerInfo(resp.data);
    } catch (err) { console.warn(err); }
  };

  if (!user) return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}> 
      <Text>Please login or sign up to view your profile.</Text>
      <Button mode="contained" onPress={() => navigation.navigate('Login')}>Login / Register</Button>
    </View>
  );

  if (user.role === 'seller') {
    return (
      <View style={{ flex:1, padding:12 }}>
        <Text style={{ fontSize:18, marginBottom:8 }}>Seller: {user.name}</Text>
        <Text>Total earnings: ${sellerInfo?.earnings?.toFixed(2) || 0}</Text>
        <Text>New orders: {sellerInfo?.newOrders || 0}</Text>
        <Text style={{ marginTop:12 }}>Products:</Text>
        {sellerInfo?.products?.map(p => (
          <View key={p._id} style={{ padding:8, borderWidth:1, borderColor:'#ddd', marginTop:8 }}>
            <Text>{p.name}</Text>
            <Text>${p.price}</Text>
          </View>
        ))}

        <View style={{ marginTop:12 }}>
          <Button mode="outlined" onPress={() => navigation.getParent ? navigation.getParent().navigate('ProfileSettings') : navigation.navigate('ProfileSettings')}>Edit Profile</Button>
          <Button mode="text" onPress={() => { logout(); if (navigation.getParent) navigation.getParent().navigate('Home'); else navigation.navigate('Home'); }}>Logout</Button>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex:1, padding:12 }}>
      <View style={{ flexDirection:'row', alignItems:'center' }}>
        {user.avatar_url ? <Avatar.Image size={64} source={{ uri: user.avatar_url }} /> : <Avatar.Text size={64} label={user.name[0]} />}
        <View style={{ marginLeft:12 }}>
          <Text style={{ fontSize:18 }}>{user.name}</Text>
          <Text>{user.email}</Text>
          <Text>Role: {user.role}</Text>
        </View>
      </View>
      <View style={{ marginTop:12 }}>
        <Button mode="outlined" onPress={() => navigation.getParent ? navigation.getParent().navigate('ProfileSettings') : navigation.navigate('ProfileSettings')}>Edit Profile</Button>
        <Button mode="text" onPress={() => { logout(); if (navigation.getParent) navigation.getParent().navigate('Home'); else navigation.navigate('Home'); }}>Logout</Button>
      </View>

      <View style={{ marginTop:20 }}>
        <Text style={{ fontSize:16, marginBottom:8 }}>Order History</Text>
        {orders.length === 0 ? <Text>No orders yet.</Text> : orders.map(o => (
          <View key={o._id} style={{ padding:8, borderWidth:1, borderColor:'#ddd', marginBottom:8 }}>
            <Text>Order: {o._id}</Text>
            <Text>Total: ${o.total_amount}</Text>
            <Text>Status: {o.status}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
