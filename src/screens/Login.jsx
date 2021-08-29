import React from "react";
import { Alert, View } from "react-native";
import { Layout, Spinner, Text } from "@ui-kitten/components";
import { BlockButton } from "../components/BlockButton";
import { AppLogotype } from "../components/AppLogotype";
import { Subtitle } from "../components/Subtitle";
import { Input } from "../components/Input";
import { useMutation } from "@apollo/client";
import { Mutations } from "../graphql/Mutations";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

export const LoginScreen = () => {
  const [login] = useMutation(Mutations.LOGIN);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [spinner, setSpinner] = React.useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    (async () => {
      setSpinner(true);
      let data = await SecureStore.getItemAsync("user-token");
      data = JSON.parse(data);
      if (data) {
        setSpinner(false);
      } else {
        navigation.replace("Logged");
      }
    })();
    return () => {
      setSpinner(false);
    };
  }, []);

  const loginFunc = async () => {
    setSpinner(true);
    try {
      const user = await login({
        variables: {
          email,
          password,
        },
      });
      if (user.data.Login.error) {
        setSpinner(false);
        Alert.alert("Error", user.data.Login);
      } else {
        setSpinner(false);
        await SecureStore.setItemAsync(
          "user-register-verify-stage",
          JSON.stringify(user.data.Login)
        );
        navigation.replace("Logged");
      }
    } catch (error) {
      Alert.alert("Error", "" + error);
      setSpinner(false);
    }
  };

  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
      }}
    >
      <AppLogotype />
      <Subtitle content="Iniciar sesion" />
      <Input
        placeholder="Correo"
        keyboardType="email-address"
        autoCompleteType="email"
        value={email}
        onChangeText={(txt) => setEmail(txt)}
      />
      <Input
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={(txt) => setPassword(txt)}
      />
      <BlockButton onPress={loginFunc}>Iniciar sesion</BlockButton>
      <BlockButton
        appearance="outline"
        size="small"
        onPress={async () => {
          navigation.replace("Register");
        }}
      >
        No estoy registrado.
      </BlockButton>
      {(() => {
        if (spinner) {
          return (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                top: 0,
                left: 0,
                right: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#313131",
              }}
            >
              <Spinner status="control" size="giant" />
            </View>
          );
        } else return <View />;
      })()}
    </Layout>
  );
};