import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';

export default function ProductScreen({ route, navigation }) {
  const { id } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const resp = await client.get('/products/' + id);
        setProduct(resp.data);
      } catch (err) { console.warn(err); }
      setLoading(false);
    };
    load();
  }, [id]);

  const addToCart = async () => {
    try {
      const user = require('../context/AuthContext').AuthContext;
      await client.post('/cart', { product_id: id, quantity: 1 });
      alert('Added to cart');
    } catch (err) {
      console.warn(err);
      alert('Add to cart failed. Please login.');
    }
  };

  const buyNow = async () => {
    // redirect to checkout flow
    navigation.navigate('Checkout', { fromProduct: id });
  };

  const { user } = React.useContext(AuthContext);
  if (!product) return null;
  return (
    <ScrollView style={{ flex: 1 }}>
      <Card>
        <Card.Cover source={{ uri: product.image_url }} />
        <Card.Content>
          <Title>{product.name}</Title>
          <Paragraph>{product.description}</Paragraph>
          <Paragraph style={{ marginTop: 8 }}>${product.price.toFixed(2)}</Paragraph>
        </Card.Content>
        <Card.Actions>
          {user && user.role === 'seller' ? (
            <Button disabled>Seller cannot buy</Button>
          ) : (
            <>
              <Button mode="contained" onPress={buyNow}>Buy</Button>
              <Button mode="outlined" onPress={addToCart}>Add to Cart</Button>
            </>
          )}
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}
