import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Text,
  SafeAreaView,
  Button,
  Switch,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Linking,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Animated,
  Easing,
} from "react-native";
import pokemonList from "./src/PokemonList";
import { WebView } from "react-native-webview";
const App = () => {
  const [search, setSearch] = useState("");
  const [enable, setEnable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pokemons, setPokemons] = useState(pokemonList);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleImage, setModalVisibleImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const handleSearchChange = (text) => {
    setSearch(text);
  };
  const handleSearch = async () => {
    if (search === "") {
      setPokemons(pokemonList);
    }
    setLoading(true);
    const filter = pokemonList.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setTimeout(() => {
      setLoading(false);
      setPokemons(filter);
    }, 2000);
  };
  const handleSwitchChange = () => setEnable(!enable);
  const handleOpenImage = (url) => {
    setSelectedImage(url);
    setModalVisible(true);
  };
  const handleOpenImageModal = (url) => {
    setSelectedImage(url);
    setModalVisibleImage(true);
  };
  const MessageChange = () => {
    if (enable) {
      return <Text style={styles.texto}>Activar Busqueda</Text>;
    } else {
      return <Text style={styles.texto}>Desactivar Busqueda</Text>;
    }
  };
  //animaciones Animated Easing
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const timingAnimation = (easing) => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 250,
      duration: 2000,
      useNativeDriver: true,
      easing,
    }).start();
    setTimeout(() => {
      animatedValue.setValue(0);
    }, 2000);
  };
  const animatedStyleTiming = {
    transform: [{ translateX: animatedValue }],
  };
  /////////////////////////
  const renderWebview = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleImage}
        onRequestClose={() => {
          setModalVisibleImage(!modalVisibleImage);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableHighlight
            onPress={() => {
              setModalVisibleImage(!modalVisibleImage);
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                color: "white",
                textAlign: "right",
              }}
            >
              X
            </Text>
          </TouchableHighlight>
          <WebView
            style={{ width: 300, marginVertical: 100 }}
            source={{ uri: selectedImage }}
          />
        </View>
      </Modal>
    );
  };
  const renderItem = ({ item }) => {
    return (
      <View style={styles.pokemonItem}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => handleOpenImageModal(item.url)}>
            <Image source={{ uri: item.url }} style={styles.pokemonImage} />
          </TouchableOpacity>
          <Text style={styles.pokemonName}>{item.name}</Text>
        </View>
        <Button title="Ver imagen" onPress={() => handleOpenImage(item.url)} />
      </View>
    );
  };
  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Si aceptas vamos a abrir tu navegador para mostrarte la imagen,
            estas seguro?
          </Text>
          <Button
            title="Abrir imagen"
            onPress={() => {
              Linking.openURL(selectedImage);
              setModalVisible(!modalVisible);
            }}
          />
          <Button
            title="Cerrar Modal"
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          />
        </View>
      </View>
    </Modal>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        animated={true}
        backgroundColor="red"
        barStyle="light-content"
      />
      {renderModal()}
      {renderWebview()}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => timingAnimation(Easing.elastic(2))}>
          <Animated.Image
            source={require("./src/images/pokeapi_256.png")}
            style={[styles.image, animatedStyleTiming]}
          />
        </TouchableOpacity>
        <View>
          {/* <Text  >{messageChange()}</Text> */}
          <MessageChange />
          <Switch onChange={handleSwitchChange} value={enable} />
        </View>
      </View>
      <FlatList
        style={{ flex: 1 }}
        data={pokemons}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleSearch} />
        }
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.row}>
          <TextInput
            style={[styles.input, enable && styles.inputDisabled]}
            onChangeText={handleSearchChange}
            value={search}
            placeholder="Ingresa el nombre del pokemon"
            editable={!enable}
          />
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Button title="Buscar" onPress={handleSearch} disabled={enable} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeArea: { flexGrow: 1, marginHorizontal: 20 },
  header: { alignItems: "center" },
  contentContainerStyle: {
    paddingVertical: 20,
    marginHorizontal: 20,
    alignItems: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginVertical: 20,
    flex: 1,
  },
  image: {
    marginVertical: 10,
  },
  pokemonListContainer: {
    flex: 1,
  },
  pokemonImage: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#C71E1E",
    backgroundColor: "yellow",
  },
  pokemonItem: {
    flexDirection: "row",
    flex: 1,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pokemonName: {
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 16,
    marginLeft: 10,
    textTransform: "capitalize",
  },
  error: {
    textAlign: "center",
    fontSize: 16,
  },
  nombre: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  fadingContainer: {},
  inputDisabled: {
    backgroundColor: "#ccc",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pokemonImageModal: {
    width: 200,
    height: 200,
  },
  texto: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#1071A8",
  },
});
export default App;