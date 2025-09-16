import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

export function useToast() {
  const showToast = (message: string, type: ToastType = "success") => {
    Toast.show({
      type,
      text1: message,
      visibilityTime: 2000,
      position: "top",
      topOffset: 100,
    });
  };

  const clearToast = () => {
    Toast.hide();
  };

  return { showToast, clearToast };
}
