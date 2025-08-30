import { Comments, type Comment } from "@/lib/api";
import type { RootState } from "@/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Button, FlatList, Keyboard, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";

type Props = { postId: number };

export default function Comment({ postId }: Props) {
  const token = useSelector((s: RootState) => s.auth.token);
  const username = useSelector((s: RootState) => s.auth.username);
  const [text, setText] = useState("");
  const [items, setItems] = useState<Comment[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);


  const canSend = useMemo(() => !!token && text.trim().length > 0, [token, text]);

  const fetchMore = async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await Comments.list(postId, cursor, 20);
      setItems(prev => [...prev, ...res.items]);
      setCursor(res.next_cursor);
      setHasMore(!!res.next_cursor);
    } catch (e: any) {
      Alert.alert("댓글 불러오기 실패", e?.message ?? "네트워크 오류");
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    setItems([]);
    setCursor(undefined);
    setHasMore(true);
    fetchMore();
  }, [postId]);

  const onSubmit = async () => {
    if (!token) return Alert.alert("로그인이 필요합니다.");
    const value = text.trim();
    if (!value) return;

    const temp: Comment = {
      id: -Date.now(),
      post_id: postId,
      user_id: -1,
      username: username ?? "나",
      content: value,
      created_at: new Date().toISOString(),
    };

    setItems(prev => [temp, ...prev]);
    setText("");
    Keyboard.dismiss();

    try {
      const saved = await Comments.create(postId, value, token);
      setItems(prev => {
        const idx = prev.findIndex(i => i.id === temp.id);
        if (idx === -1) return prev;
        const next = prev.slice();
        next[idx] = saved;
        return next;
      });
    } catch (e: any) {
      setItems(prev => prev.filter(i => i.id !== temp.id));
      Alert.alert("댓글 전송 실패", e?.message ?? "네트워크 오류");
    }
  };

  const renderItem = ({ item }: { item: Comment }) => (
    <View style={{ paddingVertical: 8, borderBottomWidth: 0.5, borderColor: "#ddd" }}>
      <Text style={{ fontWeight: "600" }}>{item.username}</Text>
      <Text style={{ marginTop: 4 }}>{item.content}</Text>
      <Text style={{ marginTop: 4, color: "#666", fontSize: 12 }}>
        {new Date(item.created_at).toLocaleString()}
      </Text>
    </View>
  );

  return (
      <View style={{ gap: 12, padding: 10}}>
        <FlatList
          data={items}
          inverted
          keyExtractor={(it) => String(it.id)}
          renderItem={renderItem}
          onEndReachedThreshold={0.3}
          onEndReached={() => fetchMore()}
          ListFooterComponent={
            loading ? <Text style={{ textAlign: "center", padding: 12, borderColor: "black", backgroundColor: "white" }}>불러오는 중…</Text> : null
          }
           keyboardShouldPersistTaps="handled"
        />
        <View
         
          style={{ flexDirection: "row", gap: 8, padding: 8, backgroundColor: "white", borderTopWidth: 1, borderColor: "#eee" }}
        >
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={token ? "위 포스트에 대한 의견이나 생각이 있나요?" : "로그인 후 작성 가능"}
              editable={!!token}
              style={{ flex: 1, borderWidth: 1, borderRadius: 8, padding: 8, borderColor: "black", backgroundColor: "white", minHeight:40 }}
            />
            <Button title="등록" onPress={onSubmit} disabled={!canSend} />
          </View>
        </View>
      </View>
  );
}
