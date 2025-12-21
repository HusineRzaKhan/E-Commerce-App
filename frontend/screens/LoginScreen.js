import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if (!email.trim() || !password) { alert('Please enter email and password'); return; }
    setLoading(true);
    try {
      const resp = await client.post('/auth/login', { email, password });
      await login(resp.data.token, resp.data.user);
      navigation.navigate('Home');
    } catch (err) { console.warn(err); alert(err.response?.data?.message || 'Login failed'); }
    setLoading(false);
  };

  return (
    <View style={{ flex:1, padding:12 }}>
      <TextInput label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput style={{ flex:1 }} label="Password" secureTextEntry={secure} value={password} onChangeText={setPassword} />
        <IconButton icon={secure ? 'eye' : 'eye-off'} onPress={() => setSecure(!secure)} />
      </View>
      <Button mode="contained" onPress={doLogin} loading={loading} style={{ marginTop:12 }}>Login</Button>
      <Button onPress={() => navigation.navigate('Register')} style={{ marginTop:8 }}>Create account</Button>
    </View>
  );
}
