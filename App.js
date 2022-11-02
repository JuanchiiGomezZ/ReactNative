import { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Switch,
  ActivityIndicator,
  Linking,
  StatusBar,
  Modal,
  TouchableHighlight,
  Animated,
  Easing,
} from "react-native";
import pokemons from "./utils/pokemon";
import { WebView } from "react-native-webview";

export default function App() {
  const [searchTyped, setSearchTyped] = useState("");
  const [search, setSearch] = useState("");
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [showWebView, setShowWebView] = useState(false);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const timingAnimation = (easing) => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 90,
      duration: 900,
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

  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  const pressToSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSearch(searchTyped);
      setIsLoading(false);
    }, 2000);
  };

  const handlePressToLink = () => {
    Linking.openURL(selectedImage);
    setShowModal(false);
  };

  const renderModal = () => {
    return (
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalBody}>
            <Text style={styles.ask}>¿Desea abrir la imagen?</Text>
            <View style={styles.response}>
              <Text
                style={styles.close}
                onPress={() => {
                  setShowModal(false);
                }}
              >
                Cancelar
              </Text>
              <Text style={styles.open} onPress={handlePressToLink}>
                Abrir
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderWebView = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWebView}
        onRequestClose={() => {
          setShowWebView(!showWebView);
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
              setShowWebView(!showWebView);
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

  return (
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor="red"
        barStyle="light-content"
      />
      <View style={styles.head}>
        <TouchableOpacity onPress={() => timingAnimation(Easing.back(10))}>
          <Animated.Image
            source={{
              uri: "https://camo.githubusercontent.com/b2f6bf5b685abd652ad6b57ff7cbdf5a6a046be913ebd52dc7a566d65b90aad5/68747470733a2f2f696d616765732e77696b6964657863646e2e6e65742f6d7775706c6f6164732f657373736277696b692f372f37372f6c61746573742f32303131313032383138313534302f546974756c6f556e69766572736f506f6b2543332541396d6f6e2e706e67",
            }}
            style={[styles.logo, animatedStyleTiming]}
          />
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          <Text>Desactivar busqueda</Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>
        <View style={styles.searcherContainer}>
          <TextInput
            editable={!isSwitchOn}
            style={[styles.searcherInput, isSwitchOn ? styles.inputDisabled : null]}
            placeholder="Ingresa el nombre del pokemon"
            onChangeText={(e) => setSearchTyped(e)}
          />
          <TouchableOpacity>
            <Text
              style={styles.searchLogo}
              onPress={pressToSearch}
              disabled={isSwitchOn}
            >
              🔎
            </Text>
          </TouchableOpacity>
        </View>
        {renderModal()}
        {renderWebView()}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f2c105" />
        </View>
      ) : (
        <>
          <View style={styles.pokemonContainer}>
            <FlatList
              data={pokemons.filter((pokemon) =>
                pokemon.name.includes(search.toLocaleLowerCase())
              )}
              renderItem={({ item }) => {
                return (
                  <SafeAreaView>
                    <View style={styles.pokemonCard} key={item.name}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedImage(item.url);
                          setShowWebView(true);
                        }}
                      >
                        <Image
                          source={{ uri: item.url }}
                          style={styles.pokemonImage}
                        />
                      </TouchableOpacity>
                      <View style={styles.nameCard}>
                        <View>
                          <Text style={styles.pokemonName}>
                            {item.name[0].toUpperCase() + item.name.slice(1)}
                          </Text>
                        </View>
                          <Text
                            onPress={() => {
                              setShowModal(true);
                              setSelectedImage(item.url);
                            }}
                            style={styles.btnModal}
                          >
                            Imagen
                          </Text>
                      </View>
                    </View>
                  </SafeAreaView>
                );
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  head: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: 256,
    marginVertical: 10,
  },
  searcherContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searcherInput: {
    width: 270,
    height: 50,
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  inputDisabled:{
    backgroundColor:'gray'
  },
  searchLogo: {
    backgroundColor: "#cccc",
    fontSize: 25,
    padding: 7,
    borderRadius: 30,
    marginLeft: 5,
  },
  pokemonContainer: {
    marginTop: 30,
  },
  pokemonCard: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(64, 64, 64, 0.22)",
    paddingBottom: 5,
  },
  pokemonImage: {
    backgroundColor: "yellow",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "black",
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: "800",
    marginLeft: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    backgroundColor: "white",
    width: 350,
    height: 170,
    borderRadius: 40,
  },
  ask: {
    textAlign: "center",
    fontSize: 25,
    marginTop: 30,
  },
  response: {
    flexDirection: "row",
    marginTop: 25,
    justifyContent: "center",
  },
  close: {
    padding: 15,
    backgroundColor: "#1e90ff",
    fontSize: 20,
    borderRadius: 15,
    width: 120,
    marginRight: 10,
  },
  open: {
    padding: 15,
    backgroundColor: "#1e90ff",
    fontSize: 20,
    borderRadius: 15,
    width: 120,
    textAlign: "center",
    marginLeft: 10,
  },
  webViewContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#222",
  },
  btnModal: {
    backgroundColor: "#1e90ff",
    padding:7,
    fontSize:18,
    color:"white",
  },
});
