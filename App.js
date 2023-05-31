// app.js
// import React from "react";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
// import { View } from "react-native";
// import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
// console.log(SCREEN_WIDTH);
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  // const [location, setLocation] = useState();
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  // const ask = async () => {
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    // console.log(granted);
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    // console.log(location[0].city);
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    // console.log(json.daily);
    setDays(json.daily);
  };
  useEffect(() => {
    // ask();
    getWeather();
  }, []);

  return (

    //<View style={styles.container}> 
      // <Text>Hellooooo!</Text> 
      //  <StatusBar style="auto" />  
      //  <Text style={styles.text}>Hello</Text> 
      //  <StatusBar style="dark" />  

    // <View style={{ flex: 1, flexDirection: "row" }}>
    //   <View style={{ flex: 1, backgroundColor: "tomato" }}></View>
    //   <View style={{ flex: 1, backgroundColor: "teal" }}></View>
    //   <View style={{ flex: 1, backgroundColor: "orange" }}></View>
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        {/* <Text style={styles.cityName}>Seoul</Text> */}
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {/* <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>

        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>Sunny</Text>
        </View> */}
         {days.length === 0 ? (
          // <View style={styles.day}>
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              {/* <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text> */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={68}
                  color="white"
                />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              <Text style={styles.date}>
                {new Date(day.dt * 1000).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 58,
    fontWeight: "500",
    color: "white",
  },
  weather: {
    // flex: 3,
  },
  day: {
    // flex: 1,
    width: SCREEN_WIDTH,
    // alignItems: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    // fontSize: 178,
    fontSize: 100,
    color: "white",
  },
  description: {
    // marginTop: -30,
    // fontSize: 60,
    marginTop: -10,
    fontSize: 30,
    color: "white",
    fontWeight: "500",
  },
  tinyText: {
    // fontSize: 20,
    marginTop: -5,
    fontSize: 25,
    color: "white",
    fontWeight: "500",
  },
  date: {
    marginTop: 0,
    fontSize: 25,
    color: "white",
    fontWeight: "500",
  },
});