import React, { useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const products = [
  ['T-Shirt', 'shirt-outline'],
  ['Hoodie', 'shirt-outline'],
  ['Shorts', 'walk-outline'],
  ['Jacket', 'shirt-outline'],
  ['Pants', 'walk-outline'],
  ['Shoes', 'footsteps-outline'],
  ['Cap', 'baseball-outline'],
  ['Bag', 'briefcase-outline'],
  ['Socks', 'footsteps-outline'],
  ['Tracksuit', 'shirt-outline'],
];

const palette = [
  '#111111',
  '#F5F5F5',
  '#D94B4B',
  '#E7B84B',
  '#4C8BF5',
  '#4CAF7A',
  '#8B5CF6',
];

export default function App() {
  const [screen, setScreen] = useState('home');

  const [product, setProduct] = useState('T-Shirt');
  const [colour, setColour] = useState('#111111');

  const [brand, setBrand] = useState('MY BRAND');
  const [graphic, setGraphic] = useState('YOUR DESIGN');

  const [designs, setDesigns] = useState([]);

  const openEditor = (name = 'T-Shirt') => {
    setProduct(name);
    setScreen('editor');
  };

  const saveDesign = () => {
    const newDesign = {
      id: Date.now(),
      product,
      colour,
      brand,
      graphic,
    };

    setDesigns([newDesign, ...designs]);

    Alert.alert(
      'Design saved',
      'Your design is now in My Designs.'
    );
  };

  if (screen === 'editor') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.topbar}>
          <TouchableOpacity onPress={() => setScreen('home')}>
            <Ionicons name="arrow-back" size={25} />
          </TouchableOpacity>

          <Text style={styles.topTitle}>
            Design {product}
          </Text>

          <TouchableOpacity onPress={saveDesign}>
            <Ionicons name="bookmark-outline" size={25} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.page}>

          {/* PRODUCT PREVIEW */}

          <View style={styles.preview}>
            <Text style={styles.previewBrand}>
              {brand || 'MY BRAND'}
            </Text>

            <View
              style={[
                styles.garment,
                { backgroundColor: colour },
              ]}
            >
              <View
                style={[
                  styles.sleeve,
                  styles.leftSleeve,
                  { backgroundColor: colour },
                ]}
              />

              <View
                style={[
                  styles.sleeve,
                  styles.rightSleeve,
                  { backgroundColor: colour },
                ]}
              />

              <Text
                style={[
                  styles.garmentText,
                  {
                    color:
                      colour === '#F5F5F5'
                        ? '#111'
                        : '#FFF',
                  },
                ]}
              >
                {graphic || 'YOUR DESIGN'}
              </Text>
            </View>

            <Text style={styles.hint}>
              Live design preview
            </Text>
          </View>

          {/* COLOURS */}

          <Text style={styles.sectionTitle}>
            Product colour
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {palette.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setColour(c)}
                style={[
                  styles.color,
                  { backgroundColor: c },
                  colour === c && styles.selectedColor,
                ]}
              />
            ))}
          </ScrollView>

          {/* BRAND NAME */}

          <Text style={styles.sectionTitle}>
            Brand name
          </Text>

          <TextInput
            style={styles.input}
            value={brand}
            onChangeText={setBrand}
            placeholder="Your brand name"
          />

          {/* GRAPHIC TEXT */}

          <Text style={styles.sectionTitle}>
            Front graphic or text
          </Text>

          <TextInput
            style={styles.input}
            value={graphic}
            onChangeText={setGraphic}
            placeholder="Add text or graphic name"
          />

          {/* TOOLS */}

          <View style={styles.toolGrid}>

            <TouchableOpacity
              style={styles.tool}
              onPress={() =>
                Alert.alert(
                  'Add logo',
                  'Logo upload will be added in the next version.'
                )
              }
            >
              <Ionicons name="image-outline" size={23} />
              <Text style={styles.toolText}>
                Add logo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tool}
              onPress={() =>
                Alert.alert(
                  'Upload image',
                  'Image upload will be added in the next version.'
                )
              }
            >
              <Ionicons
                name="cloud-upload-outline"
                size={23}
              />
              <Text style={styles.toolText}>
                Upload image
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tool}
              onPress={() =>
                Alert.alert(
                  'Patterns',
                  'Pattern tools will be added in the next version.'
                )
              }
            >
              <Ionicons name="grid-outline" size={23} />
              <Text style={styles.toolText}>
                Patterns
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tool}
              onPress={() =>
                Alert.alert(
                  '3D preview',
                  'Realistic 3D preview will be added in the next version.'
                )
              }
            >
              <Ionicons name="cube-outline" size={23} />
              <Text style={styles.toolText}>
                3D preview
              </Text>
            </TouchableOpacity>

          </View>

          {/* SAVE */}

          <TouchableOpacity
            style={styles.primary}
            onPress={saveDesign}
          >
            <Text style={styles.primaryText}>
              Save design
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    );
  }

  if (screen === 'designs') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        <View style={styles.topbar}>
          <TouchableOpacity
            onPress={() => setScreen('home')}
          >
            <Ionicons name="arrow-back" size={25} />
          </TouchableOpacity>

          <Text style={styles.topTitle}>
            My Designs
          </Text>

          <View style={{ width: 25 }} />
        </View>

        <ScrollView contentContainerStyle={styles.page}>

          {designs.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons
                name="layers-outline"
                size={55}
              />

              <Text style={styles.emptyTitle}>
                No designs yet
              </Text>

              <Text style={styles.sub}>
                Create your first product and it will appear here.
              </Text>

              <TouchableOpacity
                style={styles.primary}
                onPress={() => openEditor()}
              >
                <Text style={styles.primaryText}>
                  Create a design
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            designs.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.designCard}
                onPress={() => {
                  setProduct(item.product);
                  setColour(item.colour);
                  setBrand(item.brand);
                  setGraphic(item.graphic);
                  setScreen('editor');
                }}
              >
                <View
                  style={[
                    styles.miniGarment,
                    { backgroundColor: item.colour },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        item.colour === '#F5F5F5'
                          ? '#111'
                          : '#FFF',
                      fontWeight: '900',
                    }}
                  >
                    {item.graphic}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>
                    {item.product}
                  </Text>

                  <Text style={styles.sub}>
                    {item.brand}
                  </Text>

                  <Text style={styles.cardLink}>
                    Tap to edit
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={22}
                />
              </TouchableOpacity>
            ))
          )}

        </ScrollView>

        <BottomNav
          setScreen={setScreen}
          openEditor={openEditor}
          active="designs"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.page}>

        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>
              WELCOME TO
            </Text>

            <Text style={styles.logo}>
              BRAND STUDIO
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setScreen('designs')}
          >
            <Ionicons
              name="bookmark"
              size={25}
            />
          </TouchableOpacity>
        </View>

        {/* HERO */}

        <Text style={styles.hero}>
          Design your next{'\n'}collection.
        </Text>

        <Text style={styles.sub}>
          Create clothing, accessories and complete outfits
          for your brand.
        </Text>

        <TouchableOpacity
          style={styles.primary}
          onPress={() => openEditor()}
        >
          <Text style={styles.primaryText}>
            Start designing
          </Text>

          <Ionicons
            name="arrow-forward"
            color="#FFF"
            size={20}
          />
        </TouchableOpacity>

        {/* PRODUCTS */}

        <Text style={styles.sectionTitle}>
          Choose a product
        </Text>

        <View style={styles.grid}>
          {products.map(([name, icon]) => (
            <TouchableOpacity
              key={name}
              style={styles.product}
              onPress={() => openEditor(name)}
            >
              <Ionicons name={icon} size={30} />

              <Text style={styles.productText}>
                {name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BRAND */}

        <Text style={styles.sectionTitle}>
          Your brand
        </Text>

        <View style={styles.brandCard}>
          <Text style={styles.brandCardTitle}>
            {brand}
          </Text>

          <Text style={styles.sub}>
            Keep your colours, logos and product ideas
            together.
          </Text>
        </View>

      </ScrollView>

      <BottomNav
        setScreen={setScreen}
        openEditor={openEditor}
        active="home"
      />
    </SafeAreaView>
  );
}

function BottomNav({
  setScreen,
  openEditor,
  active,
}) {
  return (
    <View style={styles.nav}>

      <TouchableOpacity
        onPress={() => setScreen('home')}
      >
        <Ionicons
          name={
            active === 'home'
              ? 'home'
              : 'home-outline'
          }
          size={23}
        />

        <Text>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openEditor()}
      >
        <Ionicons
          name="add-circle"
          size={30}
        />

        <Text>Create</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setScreen('designs')}
      >
        <Ionicons
          name={
            active === 'designs'
              ? 'bookmark'
              : 'bookmark-outline'
          }
          size={23}
        />

        <Text>My Designs</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F4',
  },

  page: {
    padding: 22,
    paddingBottom: 100,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    color: '#777',
  },

  logo: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },

  hero: {
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 44,
    marginTop: 45,
  },

  sub: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginTop: 8,
  },

  primary: {
    backgroundColor: '#111',
    padding: 17,
    borderRadius: 14,
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    alignItems: 'center',
  },

  primaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  product: {
    width: '22%',
    minWidth: 75,
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  productText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },

  brandCard: {
    backgroundColor: '#E9E2D5',
    padding: 20,
    borderRadius: 18,
  },

  brandCardTitle: {
    fontSize: 25,
    fontWeight: '900',
  },

  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#EEE',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  topbar: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  preview: {
    backgroundColor: '#E9E2D5',
    borderRadius: 22,
    height: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },

  previewBrand: {
    position: 'absolute',
    top: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },

  garment: {
    width: 210,
    height: 230,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  sleeve: {
    position: 'absolute',
    top: 18,
    width: 55,
    height: 110,
    borderRadius: 20,
  },

  leftSleeve: {
    left: -35,
    transform: [{ rotate: '25deg' }],
  },

  rightSleeve: {
    right: -35,
    transform: [{ rotate: '-25deg' }],
  },

  garmentText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },

  hint: {
    position: 'absolute',
    bottom: 15,
    color: '#777',
    fontSize: 12,
  },

  color: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  selectedColor: {
    borderColor: '#111',
    borderWidth: 4,
  },

  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },

  toolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 25,
  },

  tool: {
    backgroundColor: '#FFF',
    padding: 13,
    borderRadius: 12,
    alignItems: 'center',
    width: '47%',
    gap: 5,
  },

  toolText: {
    fontSize: 12,
    fontWeight: '700',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 70,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 15,
  },

  designCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  miniGarment: {
    width: 90,
    height: 90,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },

  cardLink: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
});
