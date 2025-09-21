import { postsApi } from "@/api/services/postsApi";
import { useToast } from "@/hooks/useToast";
import { useGlobalState } from "@/store/context/useGlobalState";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const MIN_SEARCH_LENGTH = 3;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SearchResults() {
  const {
    selectors: { searchInput },
  } = useGlobalState();
  const { showToast } = useToast();
  const {
    selectors: { searchResultsInfo },
    actions: { setSearchResultsInfo },
  } = useGlobalState();
  const router = useRouter();

  const [keyboardActive, setKeyboardActive] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardActive(true)
    );
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardActive(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // states for search feature ------
  const [resultsView, setResultsView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiFail, setApiFail] = useState(false);
  // ----------------------------------------

  // Step 1: Handle search input change ------

  useLayoutEffect(() => {
    setLoading(true);
    setResultsView(false);
    setApiFail(false);
    setSearchResultsInfo({ searchResults: [] });
  }, [searchInput]);
  // ----------------------------------------

  // Step 2: wait for searchInput to change and fire API with debounce only ------
  useEffect(() => {
    // debounced API call
    const handler = setTimeout(() => {
      // if search input is less than 3 characters, do not call API
      if (searchInput.length < MIN_SEARCH_LENGTH) return;
      searchApi();
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);
  // ----------------------------------------

  // Step 3: set resultsView true when Api is successfull------
  // set loading false finally ------
  const searchApi = async () => {
    try {
      const res = await postsApi.searchPosts(searchInput);
      setSearchResultsInfo({ searchResults: res.posts });
      setResultsView(true);
    } catch (error) {
      console.error("Error during API call:", error);
      showToast("Something went wrong while searching", "error");
      setApiFail(true);
      setSearchResultsInfo({ searchResults: [] });
    } finally {
      setLoading(false);
    }
  };
  // ----------------------------------------
  useEffect(() => {
    if (
      searchInput.length >= MIN_SEARCH_LENGTH &&
      searchResultsInfo.isSearchFocus
    ) {
      setResultsView(true);
    }
  }, [searchResultsInfo.isSearchFocus]);

  useEffect(() => {
    if (searchResultsInfo.hide) {
      setResultsView(false);
      setLoading(false);
    }
  }, [resultsView, searchResultsInfo.hide]);

  return (
    // {/* dont show entire block when searchInput is less than min */}

    <View
      style={{
        flex: 1,
        zIndex: 1000,
        position: "absolute",
        alignItems: "center",
        left: 0,
        right: 0,
        bottom: 0,
        top: (searchResultsInfo.headerEndPosition || 100) + 8,
        display: searchInput.length >= MIN_SEARCH_LENGTH ? "flex" : "none",
      }}
    >
      <TouchableOpacity
        style={{
          ...styles.searchOverLay,
          // show overlay only when loading is true or resultsView is true
          display: loading || resultsView ? "flex" : "none",
        }}
        onPress={() => {
          if (keyboardActive) {
            Keyboard.dismiss();
          } else {
            setResultsView(false);
            setLoading(false);
            setSearchResultsInfo({ isSearchFocus: false });
          }
        }}
      />

      {loading && (
        <View
          style={{
            ...styles.searchResults,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}

      {!apiFail && resultsView && (
        <>
          <ScrollView
            style={{
              ...styles.searchResults,
              maxHeight: windowHeight * 0.25,
            }}
            contentContainerStyle={{
              paddingBottom: 12,
              alignItems: "center",
            }}
          >
            {searchResultsInfo.searchResults.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={{
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                  paddingVertical: 6,
                  gap: 8,
                }}
                onPress={() => router.push(`/post/${post.id}`)}
              >
                <View style={{ justifyContent: "center" }}>
                  <Image
                    source={
                      post.imageUrl
                        ? {
                            uri: post.imageUrl,
                          }
                        : require("../assets/images/no-img.png")
                    }
                    style={{
                      borderRadius: 8,
                      display: "flex",
                      height: 40,
                      aspectRatio: 9 / 6,
                    }}
                    contentFit="contain"
                    transition={1000}
                  />
                </View>
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={{ fontWeight: "bold", color: "#007BFF" }}>
                    {post.title}
                  </Text>
                  <Text numberOfLines={2} ellipsizeMode="tail">
                    {post.desc}...
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {searchResultsInfo.searchResults.length === 0 && (
            <Text style={{ zIndex: 1001, marginTop: 4 }}>
              No results found for{" "}
              <Text style={{ fontWeight: "bold" }}>{searchInput}</Text>
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchOverLay: {
    position: "absolute",
    top: 0,
    left: -windowWidth / 2,
    right: 0,
    bottom: 0,
    height: windowHeight * 2,
    width: windowWidth * 2,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 99,
    opacity: 0.5,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
  },
  searchResults: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 5,
    width: windowWidth - 24,
  },
});
