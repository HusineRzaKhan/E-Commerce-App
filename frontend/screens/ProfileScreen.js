import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Avatar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const resp = await client.get('/orders');
      setOrders(resp.data);
    } catch (err) { console.warn(err); }
  };

  if (!user) return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}> 
      <Text>Please login or sign up to view your profile.</Text>
      <Button mode="contained" onPress={() => navigation.navigate('Login')}>Login / Register</Button>
    </View>
  );

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
        <Button mode="outlined" onPress={() => navigation.navigate('ProfileSettings')}>Edit Profile</Button>
        <Button mode="text" onPress={logout}>Logout</Button>
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
 
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Button, Avatar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  const loadOrders = async () => {
    try {
      const resp = await client.get('/orders');
      setOrders(resp.data);
    } catch (err) { console.warn(err); }
  };

  if (!user) return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}> 
      <Text>Please login or sign up to view your profile.</Text>
      <Button mode="contained" onPress={() => navigation.navigate('Login')}>Login / Register</Button>
    </View>
  );

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
        <Button mode="outlined" onPress={() => navigation.navigate('ProfileSettings')}>Edit Profile</Button>
        <Button mode="text" onPress={logout}>Logout</Button>
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
  );
}
