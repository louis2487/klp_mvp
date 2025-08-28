import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { Auth } from "../lib/api";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");

  const submit = async () => {
    try {
      await Auth.signUp(email, password, username);
      router.replace("/login");
    } catch (e: any) {
      Alert.alert("가입 실패", e?.response?.data?.detail ?? "잠시 후 다시 시도");
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <TextInput
        placeholder="name"
        value={username}
        onChangeText={setUserName}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, backgroundColor: "#fff" }}
      />
      <TextInput
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, backgroundColor: "#fff" }}
      />
      <TextInput
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, backgroundColor: "#fff",marginBottom: 15 }}
      />
      <Button title="회원가입" onPress={submit}  />
    </View>
  );
}