import { useGlobalState } from "@/store/context/useGlobalState";
import { RoutesKey } from "@/types/commonTypes";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text } from "react-native";

export default function Post() {
  const { id, postComingFromParam } = useLocalSearchParams();
  const {
    actions: { setPostComingFrom },
  } = useGlobalState();

  useEffect(() => {
    setPostComingFrom(postComingFromParam as RoutesKey);
  }, [postComingFromParam]);

  return (
    <>
      <Text>Welcome to Post : {id}</Text>
      <Text>Coming from : {postComingFromParam}</Text>
    </>
  );
}
