import { Auth } from "@/lib/api";
import { setToken } from "@/store/authSlice";
import { Link, router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Button, Pressable, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";

export default function LoginScreen() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = useCallback(async () => {
    try {
      const res = await Auth.logIn(username, password);
      if (!res?.token) throw new Error("NO_TOKEN");
      dispatch(setToken({ token: res.token, username }));
      router.replace("/list");
    } catch (e: any) {
      Alert.alert("로그인 실패", e?.response?.data?.detail ?? "아이디 또는 비밀번호를 확인하세요");
    }
  }, [username, password, dispatch]);

  return (
    <View style={{ padding: 20, gap: 16 }}>
      <TextInput placeholder="username" autoCapitalize="none" value={username} onChangeText={setUsername}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, backgroundColor: "#fff" }} />
      <TextInput placeholder="password" secureTextEntry value={password} onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, backgroundColor: "#fff" }} />
      <Button title="로그인" onPress={submit} />

      <Link href="/signup" asChild>
        <Pressable><Text style={{ color: "blue", textAlign: "center", paddingVertical: 10 }}>아이디가 없다면 등록해주세요</Text></Pressable>
      </Link>
    </View>
  );
}
