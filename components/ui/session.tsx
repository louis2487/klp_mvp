import type { RootState } from "@/store";
import { clearToken } from "@/store/authSlice";
import { useRouter } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function SessionPill() {
    const dispatch = useDispatch();
    const username = useSelector((s: RootState) => s.auth.username);
    const router = useRouter();

    const onPress = () => {
        if (!username) return;
        Alert.alert("로그아웃", "정말 로그아웃할까요?", [
            { text: "취소", style: "cancel" },
            { text: "로그아웃",
              style: "destructive",
              onPress: () => { dispatch(clearToken());
                router.replace("/login");
               }
            }])
    }
    return (
        <Pressable onPress={onPress} hitSlop={10} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View
                    style={{
                        width: 8, height: 8, borderRadius: 4,
                        backgroundColor: username ? "#10b981" : "#9ca3af",
                    }}
                />
                <Text style={{ fontWeight: "600" }}>{username ?? "Guest"}</Text>
            </View>
        </Pressable>
    );
}
