import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Searchbar, Card, Title, Paragraph, Text } from 'react-native-paper';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';

const localImage = (name) => {
  if (!name) return { uri: 'https://via.placeholder.com/200' };
  // map some known local asset names to static requires so bundler can include them
  try {
    if (name === 'TShirt.jpg' || name.toLowerCase().includes('tshirt')) return require('../assets/TShirt.jpg');
    if (name === 'Jeans.jpg' || name.toLowerCase().includes('jeans')) return require('../assets/Jeans.jpg');
    if (name === 'Headphones.jpg' || name.toLowerCase().includes('headphone')) return require('../assets/Headphones.jpg');
    if (name === 'Mug.jpg' || name.toLowerCase().includes('mug')) return require('../assets/Mug.jpg');
  } catch (e) {
    // fall through to placeholder
  }
  if (name.startsWith('local:')) {
    return { uri: 'https://via.placeholder.com/200' };
  }
  return { uri: name };
};

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [sellerInfo, setSellerInfo] = useState(null);

  const load = async (q) => {
    setLoading(true);
    try {
      const resp = await client.get('/products', { params: q });
      setProducts(resp.data);
    } catch (err) { console.warn(err); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    if (user && user.role === 'seller') {
      (async () => {
        try {
          const s = await client.get('/seller/dashboard');
          setSellerInfo(s.data);
        } catch (e) { console.warn(e); }
      })();
    }
  }, [user]);

  if (user && user.role === 'seller') {
    return (
      <View style={{ flex:1, padding:12 }}>
        <Text style={{ fontSize:18, marginBottom:8 }}>Seller Dashboard</Text>
        <Text>Total earnings: ${sellerInfo?.earnings?.toFixed(2) || 0}</Text>
        <Text>New orders: {sellerInfo?.newOrders || 0}</Text>
        <FlatList
          data={sellerInfo?.products || []}
          keyExtractor={p => p._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ marginTop:8 }} onPress={() => navigation.navigate('Product', { id: item._id })}>
              <Card>
                <Card.Cover source={localImage(item.image_url)} />
                <Card.Content>
                  <Title>{item.name}</Title>
                  <Paragraph>${item.price.toFixed(2)}</Paragraph>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 8 }}>
      <Searchbar placeholder="Search products" value={search} onChangeText={t => setSearch(t)} onIconPress={() => load({search})} />
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ flex: 1, margin: 6 }} onPress={() => navigation.navigate('Product', { id: item._id })}>
            <Card>
              <Card.Cover source={localImage(item.image_url)} />
              <Card.Content>
                <Title>{item.name}</Title>
                <Paragraph>${item.price.toFixed(2)}</Paragraph>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        refreshing={loading}
        onRefresh={() => load({search})}
      />
    </View>
  );
}
