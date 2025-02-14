import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useContext } from "react";
import { locationContext } from "../store/context/LocationContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { getDistance } from "geolib";
import { Shadow } from "react-native-shadow-2";
import { favoritesStorageHelper } from "../helpers/FavoriteStorageHelper";
import { favoritesContext } from "../store/context/FavoritesContext";

const MuseumCard = ({ props, navigation }) => {
  const { location, setLocation } = useContext(locationContext);

  const calculateDistance = (
    latitude,
    longitude,
    device_latitude,
    device_longitude
  ) => {
    return Math.floor(
      getDistance(
        { latitude: latitude, longitude: longitude },
        { latitude: device_latitude, longitude: device_longitude }
      ) / 1000
    );
  };

  const { favorites, setfavorites } = useContext(favoritesContext);

  const addToFavorites = (item) => {
    item.type = "Museum";
    //favorite control
    let favorite = favorites.find((q) => q.id == item.id);

    if (favorite) {
      let filteredFavorites = favorites.filter((q) => q.id != item.id);
      setfavorites([...filteredFavorites]);
      favoritesStorageHelper.set([...filteredFavorites]);
    } else {
      setfavorites([...favorites, item]);
      favoritesStorageHelper.set([...favorites, item]);
    }
  };

  const getStarIcon = (id) => {
    let favorite = favorites.find((q) => q.id == id);

    if (favorite)
      return (
        <MaterialCommunityIcons
          style={style.row.info.icon}
          name="bookmark"
          color={"#018CF1"}
          size={26}
        />
      );
    else
      return (
        <MaterialCommunityIcons
          name="bookmark-outline"
          color={"#F6F6F6"}
          size={26}
          style={style.row.info.icon}
        />
      );
  };

  return (
    <>
      <View style={style.body}>
        <View>
          <Pressable
            onPress={() =>
              navigation.navigate("Discoverdetail", {
                id: props.id,
              })
            }
          >
            <View style={style.container}>
              <View style={style.row}>
                <View
                  style={{ position: "absolute", top: 0, left: 0, zIndex: 999 }}
                >
                  <Text style={style.row.location}>Baku, Old City</Text>
                  <Text style={style.row.name}>{props.name}</Text>
                </View>
                <View style={style.animation}>

                  <Image
                    style={style.img}
                    source={{
                      uri: props.mainImage,
                    }}
                  />
                </View>
                <View style={style.row.info}>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={style.row.info.text}>
                      {" "}
                      {calculateDistance(
                        props.latitude,
                        props.longitude,
                        location && location.coords.latitude,
                        location && location.coords.longitude
                      )}
                      km
                    </Text>
                    <Text
                      style={{ color: "rgb(144, 82, 47)", marginHorizontal: 5 }}
                    >
                      Open soon
                    </Text>
                  </View>
                  <Pressable
                    style={style.row.info.icon}
                    onPress={() => addToFavorites(props)}
                  >
                    {getStarIcon(props.id)}
                  </Pressable>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default MuseumCard;

const style = StyleSheet.create({
  container: {
    backgroundColor: "#1C1C1C",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  body: {
    // paddingTop: 10,
    // flex:1
  },
  row: {
    location: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
      paddingHorizontal: 10,
      paddingVertical: 5,
      fontFamily: "System",
      fontStyle: "normal",
    },
    name: {
      color: "white",
      fontSize: 16,
      fontWeight: "500",
      paddingHorizontal: 10,
      fontFamily: "System",
      fontStyle: "normal",
    },
    info: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#202020",
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,

      paddingHorizontal: 12,

      text: {
        color: "#909090",
      },
      icon: {
        // color: 'white',
        marginVertical: 5,
      },
    },
  },
  img: {
    width: 350,
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  animation: {
    shadowColor: "#red",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,

    elevation: 20,
  },
});
