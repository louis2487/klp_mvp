import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, Image, ScrollView, TextInput } from "react-native";
import { useSelector } from "react-redux";
import { Posts } from "../lib/api";
import { RootState } from "../store";

export default function PostWrite() {
  const token = useSelector((state: RootState) => state.auth.token);

  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState("");

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!res.canceled) setImageUri(res.assets[0].uri);
  };

  const submit = async () => {
    try {
      if (!token) {
        Alert.alert("로그인이 필요합니다");
        return;
      }

      let imageUrl: string | undefined;
      if (imageUri) {
        const b64 = await FileSystem.readAsStringAsync(imageUri, { encoding: "base64" });
        const upload = await fetch("https://api.smartgauge.co.kr/upload/base64", {
          method: "POST",
          headers: {

            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ filename: `img_${Date.now()}.jpg`, base64: b64 }),
        });
        const data = await upload.json();
        imageUrl = data.url;
      }
      await Posts.create({ title, content, image_url: imageUrl }, token);
      router.replace("/list");
    } catch (e: any) {
      Alert.alert("업로드 실패", e?.message ?? "잠시 후 다시 시도해주세요");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <TextInput
        placeholder="제목을 입력하세요"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, backgroundColor: "#fff" }}
      />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, borderRadius: 12 }} />}
      <TextInput
        placeholder="본문을 입력하세요"
        value={content}
        onChangeText={setContent}
        multiline
        style={{ minHeight: 120, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12, backgroundColor: "#fff", textAlignVertical: "top" }
        }
      />
      <Button title="이미지 선택" onPress={pickImage} />
      <Button title="게시" onPress={submit} />
    </ScrollView>
  );
}