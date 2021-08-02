import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import { RegisterScreen } from "./src/screens/Register";
import { default as theme } from "./theme.json";
import { StatusBar } from "react-native";
import { LoginScreen } from "./src/screens/Login";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: "http://192.168.250.5:4000/graphql",
  cache: new InMemoryCache(),
});

export default () => (
  <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
    <StatusBar backgroundColor="#EFEFEF" barStyle="dark-content" />
    <ApolloProvider client={client}>
      <RegisterScreen />
    </ApolloProvider>
  </ApplicationProvider>
);
