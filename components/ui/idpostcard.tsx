import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import type { Post } from "../../lib/api";

export default function Postcard_detail({ post }: { post: Post }) {
  return (
    <Link href={{ pathname: "/[id]", params: { id: post.id } }} asChild>
      <Pressable style={{ flex: 1, borderBottomWidth: 1, borderColor: "#eee", backgroundColor: "#fff", padding: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
          <Text style={{ fontWeight: "600" }}>{post.author.username}</Text>
          <Text style={{ color: "#666", fontSize: 12 }}>
            {new Date(post.created_at).toLocaleString()}
          </Text>
        </View>

        <Text style={{ fontSize: 16 }}>{post.title}</Text>

        {post.image_url && (
          <Image
            source={{ uri: post.image_url }}
            style={{ width: "100%", height: 220, marginTop: 15, borderRadius: 12 }}
          />
        )}
        <Text style={{ fontSize: 14, marginTop: 30 }}>{post.content}</Text>
      </Pressable>
    </Link>
  );
}