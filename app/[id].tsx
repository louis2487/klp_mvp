import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Comment from "../components/ui/comment";
import IdPostCard from "../components/ui/idpostcard";
import { Posts, type Post } from "../lib/api";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        const numericId = parseInt(id, 10);
        if (!isNaN(numericId)) {
          setPost(await Posts.get(numericId));
        }
      }
    })();
  }, [id]);

  if (!post) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
      enableOnAndroid={true}
      extraScrollHeight={20} 
    >
    <View style={{ flex: 1 }}>
      <IdPostCard post={post} />
      <Comment postId={post.id} />
    </View>
    </KeyboardAwareScrollView>
  );
}