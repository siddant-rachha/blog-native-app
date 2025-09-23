import { useGlobalState } from "@/store/context/useGlobalState";
import { configureGoogleSignIn } from "@/utils/google-auth/signInWithGoogle";
import { secureTokenManager } from "@/utils/secure-token-manager/secureTokenManager";
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import { useEffect } from "react";

export default function FirebaseGoogleAuthHandler() {
  const {
    actions: { setUser },
  } = useGlobalState();
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  // Handle user state changes
  function handleAuthStateChanged(firebaseUser: FirebaseAuthTypes.User | null) {
    if (firebaseUser) {
      setUser({
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });
      firebaseUser.getIdToken().then((token) => {
        if (token) secureTokenManager.setToken(token);
      });
    } else {
      setUser(null);
      secureTokenManager.setToken(null);
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  return null;
}
