import React, { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileSettings({ navigation }) {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const save = async () => {
    try {
      const payload = { name, address, phone, avatar_url: avatarUrl };
      const res = await client.put('/auth/profile', payload);
      const updated = res.data;
      updateUser && updateUser(updated);
      alert('Profile updated');
    } catch (err) { console.warn(err); alert('Failed to update profile'); }
  };

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { alert('Permission required'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!res.cancelled) setAvatarUrl(res.uri);
  };

  return (
    <View style={{ flex:1, padding:12 }}>
      <Button mode="outlined" onPress={pickAvatar}>Pick Profile Image</Button>
      {avatarUrl ? <Text style={{ marginTop:8 }}>Preview: {avatarUrl}</Text> : null}
      <TextInput label="Name" value={name} onChangeText={setName} />
      <TextInput label="Address" value={address} onChangeText={setAddress} />
      <TextInput label="Phone" value={phone} onChangeText={setPhone} />
      <Button mode="contained" onPress={save} style={{ marginTop:12 }}>Save</Button>
    </View>
  );
}
