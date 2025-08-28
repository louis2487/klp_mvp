import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import type { Post } from "../../lib/api";

export default function Postcard({ post }: { post: Post }) {
  return (
        <Link href={{ pathname: "/[id]", params: { id: post.id } }} asChild>
          <Pressable style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}>
            <View style={{ flexDirection: "row" }}>
              {post.image_url && (
                <Image
                  source={{ uri: post.image_url }}
                  style={{ width: 80, height: 80, borderRadius: 8, marginRight: 12 }}
                />
              )}
    
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }} numberOfLines={1}>
                  {post.title}
                </Text>
                <Text style={{ color: "#666", fontSize: 12, marginTop: 6}}>
                  {post.author.username} · {new Date(post.created_at).toLocaleString()}
                </Text>
              </View>
            </View>
          </Pressable>
        </Link>
      );
}