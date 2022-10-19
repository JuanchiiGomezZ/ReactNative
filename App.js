import { useState } from "react";
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
} from "react-native";

import pokemons from "./utils/pokemon";

export default function App() {
  const [searchTyped, setSearchTyped] = useState("");
  const [search, setSearch] = useState("");
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Image
          source={{
            uri: "https://camo.githubusercontent.com/b2f6bf5b685abd652ad6b57ff7cbdf5a6a046be913ebd52dc7a566d65b90aad5/68747470733a2f2f696d616765732e77696b6964657863646e2e6e65742f6d7775706c6f6164732f657373736277696b692f372f37372f6c61746573742f32303131313032383138313534302f546974756c6f556e69766572736f506f6b2543332541396d6f6e2e706e67",
          }}
          style={styles.logo}
        />
        <View style={styles.switchContainer}>
          <Text>Desactivar busqueda</Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View>

        <View style={styles.searcherContainer}>
          <TextInput
            editable={!isSwitchOn}
            style={styles.searcherInput}
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
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f2c105" />
        </View>
      ) : (
        <View style={styles.pokemonContainer}>
          <FlatList
            data={pokemons.filter((pokemon) =>
              pokemon.name.includes(search.toLocaleLowerCase())
            )}
            renderItem={({ item }) => {
              return (
                <SafeAreaView>
                  <View style={styles.pokemonCard} key={item.name}>
                    <Image
                      source={{ uri: item.url }}
                      style={styles.pokemonImage}
                    />
                    <Text style={styles.pokemonName}>
                      {item.name[0].toUpperCase() + item.name.slice(1)}
                    </Text>
                  </View>
                </SafeAreaView>
              );
            }}
          />
        </View>
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
    marginVertical:10,
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
});
