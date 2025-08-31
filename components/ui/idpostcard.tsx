import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import type { Post } from "../../lib/api";

const screenWidth = Dimensions.get("window").width;


export default function Postcard_detail({ post }: { post: Post }) {
  return (
    <Link href={{ pathname: "/[id]", params: { id: post.id } }} asChild>
      <Pressable style={{ flex: 1, borderBottomWidth: 1, borderColor: "#eee", backgroundColor: "#fff", padding: 12 }}>
        <View style={{ flexDirection: "row", marginBottom: 4, justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "600" }}>{post.author.username}</Text>
          <Text style={{ color: "#666", fontSize: 12 }}>{new Date(post.created_at).toLocaleString()}</Text>
        </View>

        <Text style={{ fontSize: 16 }}>{post.title}</Text>

        {post.image_url && (
          <DynamicImage uri={post.image_url} />
        )}

        <Text style={{ fontSize: 14, marginTop: 30, marginBottom: 30 }}>{post.content}</Text>
      </Pressable>
    </Link>
  );
}

function DynamicImage({ uri }: { uri: string }) {
  const [height, setHeight] = useState(200);

  useEffect(() => {
    Image.getSize(uri, (width, height) => {
      const scale = screenWidth / width;
      setHeight(height * scale);
    });
  }, [uri]);

  return (
    <Image
      source={{ uri }}
      style={{
        width: screenWidth,
        height,
        marginTop: 15,
        borderRadius: 12,
        resizeMode: "cover",
        alignSelf: "center"
      }}
    />
  );
}