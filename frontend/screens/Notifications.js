import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { List, Divider, ActivityIndicator, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';

export default function Notifications() {
  const { refreshNotifications } = useContext(AuthContext);
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const resp = await client.get('/notifications');
      setItems(resp.data);
      await refreshNotifications();
    } catch (err) { console.warn(err); setItems([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading || items === null) return <ActivityIndicator style={{ marginTop:20 }} />;
  if (!items.length) return <View style={{ padding:16 }}><Text>No notifications</Text></View>;

  return (
    <FlatList
      data={items}
      keyExtractor={(i)=>i._id}
      renderItem={({item})=> (
        <View>
          <List.Item
            title={item.message}
            description={new Date(item.created_at).toLocaleString()}
            left={props => <List.Icon {...props} icon={item.read ? 'bell-outline' : 'bell'} />}
          />
          <Divider />
        </View>
      )}
    />
  );
}
