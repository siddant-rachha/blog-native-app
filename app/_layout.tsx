// import DrawerWithListener from "@/components/DrawerWithListener";
// import { LoaderOverlay } from "@/components/LoadingOverlay";
// import { GlobalStateProvider } from "@/store/context/Providers/GlobalStateContext";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import Toast from "react-native-toast-message";

// export default function Layout() {
//   return (
//     <GlobalStateProvider>
//       <LoaderOverlay />
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <DrawerWithListener />
//       </GestureHandlerRootView>
//       <Toast />
//     </GlobalStateProvider>
//   );
// }

import {
  FirebaseAuthTypes,
  GoogleAuthProvider,
  getAuth,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useState } from "react";
import { Button, Text, View } from "react-native";

GoogleSignin.configure({
  webClientId:
    "323603367096-89ef4uui8jlvhv2f7lflio8klkmuimmp.apps.googleusercontent.com",
});

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const signInResult = await GoogleSignin.signIn();

  // Try the new style of google-sign in result, from v13+ of that module
  let idToken = signInResult.data?.idToken;
  if (!idToken) {
    // if you are using older versions of google-signin, try old style result
    idToken = (signInResult as any).idToken;
  }
  if (!idToken) {
    throw new Error("No ID token found");
  }

  // Create a Google credential with the token
  const googleCredential = GoogleAuthProvider.credential(
    signInResult?.data?.idToken
  );

  // Sign-in the user with the credential
  const res = await signInWithCredential(getAuth(), googleCredential);
  console.log("Firebase sign-in result:", res);
  return res;
}

export default function Layout() {
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  return (
    <>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Google Sign-In"
          onPress={() =>
            onGoogleButtonPress()
              .then(async (res) => {
                console.log("Signed in with Google!");

                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) throw new Error("User not signed in");

                const firebaseIdToken = await user.getIdToken(); // this is the token to use in Postman
                console.log(firebaseIdToken);
                setUser(user);
              })
              .catch((err) => console.error(err))
          }
        />
      </View>
      {!user && (
        <View>
          <Text>Firebase Id token not found</Text>
        </View>
      )}
      {user && (
        <View>
          <Text>Firebase Id token found</Text>
        </View>
      )}
    </>
  );
}
