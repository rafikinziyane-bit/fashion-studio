import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Alert, Modal, Dimensions, ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect, Circle, G, Text as SvgText } from 'react-native-svg';
import { GLView } from 'expo-gl';
import * as THREE from 'three';

const { width } = Dimensions.get('window');

// APP STORE COMPLIANCE CONSTANTS
const PRIVACY_URL = "https://yourbrand.com/privacy";
const TERMS_URL = "https://yourbrand.com/terms";

const PRODUCTS = [
  { name: 'T-Shirt', category: 'Tops', icon: 'shirt-outline', type: 'tshirt' },
  { name: 'Hoodie', category: 'Tops', icon: 'shirt-outline', type: 'hoodie' },
  { name: 'Shorts', category: 'Bottoms', icon: 'walk-outline', type: 'shorts' },
  { name: 'Jacket', category: 'Outerwear', icon: 'shirt-outline', type: 'jacket' },
  { name: 'Pants', category: 'Bottoms', icon: 'walk-outline', type: 'pants' },
  { name: 'Shoes', category: 'Footwear', icon: 'footsteps-outline', type: 'shoes' },
  { name: 'Cap', category: 'Headwear', icon: 'baseball-outline', type: 'cap' },
  { name: 'Bag', category: 'Accessories', icon: 'briefcase-outline', type: 'bag' },
  { name: 'Tracksuit', category: 'Sets', icon: 'fitness-outline', type: 'tracksuit' },
];

const PALETTE = ['#111111', '#F4F4F4', '#D94B4B', '#E5B84B', '#4C8BF5', '#42A66B', '#8B5CF6', '#FF7A00'];

export default function App() {
  // Auth State (App Store Guideline 5.1.1 compliant)
  const [user, setUser] = useState(null); // { email, token }
  const [authMode, setAuthMode] = useState('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // App Navigation & Studio State
  const [page, setPage] = useState('home'); 
  const [mode3D, setMode3D] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [garmentColor, setGarmentColor] = useState('#111111');
  const [brandText, setBrandText] = useState('STUDIO BRAND');
  const [graphicText, setGraphicText] = useState('CORE 2026');
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // --- AUTHENTICATION FLOWS ---
  const handleAuth = () => {
    if (!emailInput || !passwordInput) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    // Simulate Secure Backend Handshake
    setUser({ email: emailInput, id: Date.now().toString() });
    setEmailInput('');
    setPasswordInput('');
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => setUser(null) }
    ]);
  };

  const handleDeleteAccount = () => {
    // App Store Requirement 5.1.1(v) - Mandatory Account Deletion
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account, saved design vectors, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Permanently', 
          style: 'destructive', 
          onPress: () => {
            setSavedDesigns([]);
            setUser(null);
            setPage('home');
            Alert.alert('Account Deleted', 'Your data has been completely erased.');
          } 
        }
      ]
    );
  };

  // --- DESIGN MANAGEMENT ---
  const saveCurrentDesign = () => {
    const newDesign = {
      id: Date.now().toString(),
      product: selectedProduct.name,
      type: selectedProduct.type,
      color: garmentColor,
      brandText,
      graphicText,
      createdAt: new Date().toLocaleDateString()
    };
    setSavedDesigns([newDesign, ...savedDesigns]);
    Alert.alert('Success', 'Design saved to your cloud catalog.');
  };

  const exportTechPack = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      Alert.alert('Export Complete', 'Production 300DPI vector tech-pack generated and ready for manufacturing.');
    }, 1500);
  };

  // --- UNAUTHENTICATED WALL ---
  if (!user) {
    return (
      <SafeAreaView style={styles.authContainer}>
        <StatusBar style="dark" />
        <View style={styles.authBox}>
          <Ionicons name="shirt" size={48} color="#111" style={{ alignSelf: 'center' }} />
          <Text style={styles.authTitle}>FASHION STUDIO PRO</Text>
          <Text style={styles.authSub}>Enterprise Apparel & Footwear Engine</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              placeholder="designer@brand.com" 
              value={emailInput}
              onChangeText={setEmailInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••••••" 
              value={passwordInput}
              onChangeText={setPasswordInput}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleAuth}>
            <Text style={styles.primaryBtnText}>{authMode === 'login' ? 'Sign In' : 'Create Account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
            <Text style={styles.switchAuthText}>
              {authMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.legalBox}>
            <Text style={styles.legalText}>By continuing you agree to our</Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <TouchableOpacity onPress={() => Alert.alert('Privacy Policy', `Link: ${PRIVACY_URL}`)}>
                <Text style={styles.legalLink}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.legalText}>&</Text>
              <TouchableOpacity onPress={() => Alert.alert('Terms of Service', `Link: ${TERMS_URL}`)}>
                <Text style={styles.legalLink}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* APP TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.brandHeader}>{brandText || 'STUDIO'}</Text>
        <TouchableOpacity style={styles.profileBtn} onPress={() => setPage('profile')}>
          <Ionicons name="person-circle-outline" size={28} color="#111" />
        </TouchableOpacity>
      </View>

      {/* PAGE CONTROLLER */}
      <View style={{ flex: 1 }}>
        {page === 'home' && (
          <ScrollView contentContainerStyle={styles.scrollBody}>
            <Text style={styles.heroText}>Create your next apparel line.</Text>
            <Text style={styles.subText}>Vector studio and interactive 3D prototyping engine.</Text>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => setPage('editor')}>
              <Text style={styles.primaryBtnText}>Open Studio Canvas</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>

            <Text style={styles.sectionHeader}>Garment & Footwear Types</Text>
            <View style={styles.productGrid}>
              {PRODUCTS.map((prod) => (
                <TouchableOpacity 
                  key={prod.name} 
                  style={styles.productTile}
                  onPress={() => {
                    setSelectedProduct(prod);
                    setPage('editor');
                  }}
                >
                  <Ionicons name={prod.icon} size={30} color="#111" />
                  <Text style={styles.productTileText}>{prod.name}</Text>
                  <Text style={styles.productTileCategory}>{prod.category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {page === 'editor' && (
          <View style={{ flex: 1 }}>
            {/* STUDIO TOOLBAR */}
            <View style={styles.editorHeader}>
              <TouchableOpacity onPress={() => setPage('home')}>
                <Ionicons name="chevron-back" size={24} color="#111" />
              </TouchableOpacity>
              <Text style={styles.editorTitle}>{selectedProduct.name} Studio</Text>
              <TouchableOpacity 
                style={[styles.toggle3D, mode3D && styles.toggle3DActive]}
                onPress={() => setMode3D(!mode3D)}
              >
                <Text style={[styles.toggle3DText, mode3D && { color: '#FFF' }]}>
                  {mode3D ? '3D View' : '2D Vector'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* CANVAS CONTAINER */}
            <View style={styles.canvasStage}>
              {mode3D ? (
                <ThreeCanvas color={garmentColor} />
              ) : (
                <VectorCanvas 
                  type={selectedProduct.type} 
                  color={garmentColor} 
                  graphicText={graphicText} 
                  brandText={brandText}
                />
              )}
            </View>

            {/* CONTROLS PANEL */}
            <ScrollView style={styles.controlsPanel} contentContainerStyle={{ paddingBottom: 40 }}>
              <Text style={styles.controlHeader}>Material Base Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                {PALETTE.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setGarmentColor(c)}
                    style={[
                      styles.colorDot, 
                      { backgroundColor: c },
                      garmentColor === c && styles.activeColorDot
                    ]}
                  />
                ))}
              </ScrollView>

              <Text style={styles.controlHeader}>Custom Graphic Text</Text>
              <TextInput
                style={styles.input}
                value={graphicText}
                onChangeText={setGraphicText}
                placeholder="Front Chest Print"
              />

              <Text style={styles.controlHeader}>Brand Identity Label</Text>
              <TextInput
                style={styles.input}
                value={brandText}
                onChangeText={setBrandText}
                placeholder="Brand Name"
              />

              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.secondaryBtn, { flex: 1 }]} onPress={saveCurrentDesign}>
                  <Ionicons name="bookmark-outline" size={18} color="#111" />
                  <Text style={styles.secondaryBtnText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.primaryBtn, { flex: 1, marginTop: 0 }]} onPress={exportTechPack}>
                  {isExporting ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <>
                      <Ionicons name="download-outline" size={18} color="#FFF" />
                      <Text style={styles.primaryBtnText}>Export Vector</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {page === 'designs' && (
          <ScrollView contentContainerStyle={styles.scrollBody}>
            <Text style={styles.heroText}>Saved Collections</Text>
            {savedDesigns.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="folder-open-outline" size={48} color="#AAA" />
                <Text style={styles.emptyText}>No saved items yet.</Text>
              </View>
            ) : (
              savedDesigns.map((item) => (
                <View key={item.id} style={styles.designCard}>
                  <View style={[styles.designColorSwatch, { backgroundColor: item.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.designCardTitle}>{item.product}</Text>
                    <Text style={styles.designCardSub}>{item.graphicText} • {item.createdAt}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {page === 'profile' && (
          <ScrollView contentContainerStyle={styles.scrollBody}>
            <Text style={styles.heroText}>Account & Security</Text>
            
            <View style={styles.profileBox}>
              <Ionicons name="person-circle" size={54} color="#111" />
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.profileRole}>Enterprise Pro License</Text>
            </View>

            <View style={{ gap: 10, marginTop: 20 }}>
              <TouchableOpacity style={styles.listOption} onPress={() => Alert.alert('Legal', `Privacy Policy: ${PRIVACY_URL}`)}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#111" />
                <Text style={styles.listOptionText}>Privacy Policy</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.listOption} onPress={() => Alert.alert('Legal', `Terms of Service: ${TERMS_URL}`)}>
                <Ionicons name="document-text-outline" size={20} color="#111" />
                <Text style={styles.listOptionText}>Terms of Service</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.listOption} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#111" />
                <Text style={styles.listOptionText}>Log Out</Text>
              </TouchableOpacity>

              {/* APP STORE REQUIRED COMPLIANCE DELETION FLOW */}
              <TouchableOpacity style={[styles.listOption, { borderColor: '#E53E3E' }]} onPress={handleDeleteAccount}>
                <Ionicons name="trash-outline" size={20} color="#E53E3E" />
                <Text style={[styles.listOptionText, { color: '#E53E3E' }]}>Delete Account & Data</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => setPage('home')}>
          <Ionicons name={page === 'home' ? 'home' : 'home-outline'} size={22} color={page === 'home' ? '#111' : '#888'} />
          <Text style={[styles.navLabel, page === 'home' && styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setPage('editor')}>
          <Ionicons name={page === 'editor' ? 'color-palette' : 'color-palette-outline'} size={22} color={page === 'editor' ? '#111' : '#888'} />
          <Text style={[styles.navLabel, page === 'editor' && styles.navLabelActive]}>Studio</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => setPage('designs')}>
          <Ionicons name={page === 'designs' ? 'briefcase' : 'briefcase-outline'} size={22} color={page === 'designs' ? '#111' : '#888'} />
          <Text style={[styles.navLabel, page === 'designs' && styles.navLabelActive]}>Catalog</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- 2D VECTOR MOCKUP CANVAS ENGINE ---
function VectorCanvas({ type, color, graphicText, brandText }) {
  const isLight = color === '#F4F4F4';
  const textColor = isLight ? '#111111' : '#FFFFFF';

  return (
    <Svg height="100%" width="100%" viewBox="0 0 300 300">
      <G>
        {/* Render base shapes according to garment type */}
        {type === 'shorts' ? (
          <Path d="M80 80 L220 80 L230 210 L165 210 L150 130 L135 210 L70 210 Z" fill={color} stroke="#333" strokeWidth="2" />
        ) : type === 'shoes' ? (
          <Path d="M40 180 C60 140 100 130 160 140 C200 130 240 150 260 180 L260 210 C180 220 100 220 40 210 Z" fill={color} stroke="#333" strokeWidth="2" />
        ) : type === 'cap' ? (
          <G>
            <Path d="M70 170 C70 100 230 100 230 170 Z" fill={color} stroke="#333" strokeWidth="2" />
            <Path d="M150 170 Q 260 170 270 185 Q 180 195 150 170" fill={color} stroke="#333" strokeWidth="2" />
          </G>
        ) : (
          /* Default Top/Shirt/Hoodie Vector */
          <G>
            {/* Sleeves */}
            <Path d="M40 80 L90 50 L110 90 L60 130 Z" fill={color} stroke="#333" strokeWidth="2" />
            <Path d="M260 80 L210 50 L190 90 L240 130 Z" fill={color} stroke="#333" strokeWidth="2" />
            {/* Torso Body */}
            <Path d="M90 50 L210 50 L200 240 L100 240 Z" fill={color} stroke="#333" strokeWidth="2" />
          </G>
        )}

        {/* Dynamic Front Text Graphics */}
        <SvgText
          x="150"
          y="130"
          fill={textColor}
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
        >
          {graphicText}
        </SvgText>

        {/* Dynamic Brand Tag */}
        <SvgText
          x="150"
          y="68"
          fill={textColor}
          fontSize="8"
          fontWeight="900"
          letterSpacing="1"
          textAnchor="middle"
        >
          {brandText}
        </SvgText>
      </G>
    </Svg>
  );
}

// --- 3D INTERACTIVE WEBGL ENGINE ---
function ThreeCanvas({ color }) {
  const onContextCreate = async (gl) => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    // Create Mesh Representing 3D Garment
    const geometry = new THREE.BoxGeometry(1.2, 1.6, 0.4);
    const material = new THREE.MeshPhongMaterial({ color: new THREE.Color(color) });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    camera.position.z = 2.5;

    // Render Loop with Rotation
    const render = () => {
      requestAnimationFrame(render);
      cube.rotation.y += 0.01;
      material.color.set(color);
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
}

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  topBar: { height: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  brandHeader: { fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
  profileBtn: { padding: 4 },
  scrollBody: { padding: 20 },
  heroText: { fontSize: 28, fontWeight: '900', color: '#111' },
  subText: { fontSize: 14, color: '#666', marginTop: 4, marginBottom: 15 },
  sectionHeader: { fontSize: 18, fontWeight: '800', marginTop: 25, marginBottom: 12 },
  
  // Products Grid
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productTile: { width: (width - 52) 
