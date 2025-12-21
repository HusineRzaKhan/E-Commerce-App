import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, RadioButton, Text, IconButton } from 'react-native-paper';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const doRegister = async () => {
    // validation
    if (!name.trim() || !email.trim() || !password) { alert('Please fill all fields'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { alert('Invalid email'); return; }
    if (password.length < 6) { alert('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const resp = await client.post('/auth/register', { name, email, password, role });
      await login(resp.data.token, resp.data.user);
      navigation.navigate('Home');
    } catch (err) { console.warn(err); alert(err.response?.data?.message || 'Register failed'); }
    setLoading(false);
  };

  return (
    <View style={{ flex:1, padding:12 }}>
      <TextInput label="Name" value={name} onChangeText={setName} />
      <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput style={{ flex:1 }} label="Password" secureTextEntry={secure} value={password} onChangeText={setPassword} />
        <IconButton icon={secure ? 'eye' : 'eye-off'} onPress={() => setSecure(!secure)} />
      </View>
      <Text style={{ marginTop:8 }}>Account Type</Text>
      <RadioButton.Group onValueChange={v => setRole(v)} value={role}>
        <RadioButton.Item label="Buyer" value="buyer" />
        <RadioButton.Item label="Seller" value="seller" />
      </RadioButton.Group>
      <Button mode="contained" onPress={doRegister} loading={loading} style={{ marginTop:12 }}>Sign Up</Button>
    </View>
  );
}
