import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export async function compressImageToTarget(
  uri: string,
  targetKB: number = 500
) {
  // first, open the context
  const imageContext = ImageManipulator.manipulate(uri);

  // apply a resize (optional but helps reduce size)
  const resizedContext = imageContext.resize({
    width: 1080, // pick a width that makes sense; adjust height implicitly
    // height: maybe omit or set null to preserve aspect ratio
  });

  // render (compute) so you get an ImageRef
  const imageRef = await resizedContext.renderAsync();

  // now save with options (compress, format)
  let quality = 1.0;
  let savedResult = await imageRef.saveAsync({
    compress: quality,
    format: "jpeg" as SaveFormat.JPEG,
  });

  // check size, and reduce quality if needed3333
  // you might have to loop, decreasing quality until size <= target
  // note: you’ll need to fetch the file to check its size

  // fetch blob to check size
  let blob = await fetch(savedResult.uri).then((r) => r.blob());
  let sizeKB = blob.size / 1024;

  while (sizeKB > targetKB && quality > 0.1) {
    quality -= 0.1;
    savedResult = await imageRef.saveAsync({
      compress: quality,
      format: "jpeg" as SaveFormat.JPEG,
    });
    blob = await fetch(savedResult.uri).then((r) => r.blob());
    sizeKB = blob.size / 1024;
  }

  return savedResult.uri; // compressed URI
}
