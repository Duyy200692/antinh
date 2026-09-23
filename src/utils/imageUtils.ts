import { storage } from '../lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

/**
 * Creates an ultra-fast local preview URL from an uploaded file
 */
export function getLocalImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Fast client-side image compression & conversion to WEBP using HTML5 Canvas.
 * Optimized for mobile & web dishes: max 720px width/height and quality 0.75.
 * Keeps output small (~25KB - 60KB), speeding up both preview and Firestore saves.
 */
export async function compressImageToWebp(
  file: File,
  maxDimension = 720,
  quality = 0.75
): Promise<{ webpDataUrl: string; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    // Fast path using createImageBitmap if supported in browser
    if (typeof createImageBitmap === 'function') {
      createImageBitmap(file)
        .then((bitmap) => {
          let width = bitmap.width;
          let height = bitmap.height;

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            bitmap.close();
            throw new Error('Canvas 2D context not available');
          }

          ctx.drawImage(bitmap, 0, 0, width, height);
          bitmap.close();

          let webpDataUrl = canvas.toDataURL('image/webp', quality);
          // Fallback if browser doesn't output webp (e.g. older iOS Safari)
          if (!webpDataUrl.startsWith('data:image/webp')) {
            webpDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          const base64Length = webpDataUrl.split(',')[1]?.length || 0;
          const compressedSize = Math.round((base64Length * 3) / 4);

          resolve({
            webpDataUrl,
            originalSize: file.size,
            compressedSize,
          });
        })
        .catch(() => {
          // Fallback to FileReader + Image if createImageBitmap fails
          fallbackCanvasCompression(file, maxDimension, quality)
            .then(resolve)
            .catch(reject);
        });
    } else {
      fallbackCanvasCompression(file, maxDimension, quality)
        .then(resolve)
        .catch(reject);
    }
  });
}

function fallbackCanvasCompression(
  file: File,
  maxDimension: number,
  quality: number
): Promise<{ webpDataUrl: string; originalSize: number; compressedSize: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2d context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        let webpDataUrl = canvas.toDataURL('image/webp', quality);
        if (!webpDataUrl.startsWith('data:image/webp')) {
          webpDataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const base64Length = webpDataUrl.split(',')[1]?.length || 0;
        const compressedSize = Math.round((base64Length * 3) / 4);

        resolve({
          webpDataUrl,
          originalSize: file.size,
          compressedSize,
        });
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

/**
 * Uploads a WebP data URL to Firebase Storage with a strict 2.5s timeout.
 * If Storage is disabled, hangs, or rules block it, it immediately falls back
 * to the compressed WebP data URL without keeping the user waiting!
 */
export async function uploadWebpImageToFirebase(
  webpDataUrl: string,
  folder = 'menu_dishes'
): Promise<string> {
  // If storage isn't initialized or valid, return immediately
  if (!storage) {
    return webpDataUrl;
  }

  const uploadPromise = (async () => {
    const filename = `${folder}/dish_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
    const storageRef = ref(storage, filename);
    await uploadString(storageRef, webpDataUrl, 'data_url');
    return await getDownloadURL(storageRef);
  })();

  const timeoutPromise = new Promise<string>((_, reject) =>
    setTimeout(() => reject(new Error('Firebase Storage upload timeout')), 2500)
  );

  try {
    return await Promise.race([uploadPromise, timeoutPromise]);
  } catch (err) {
    console.warn(
      'Firebase Storage upload bypassed or timed out: instantly using optimized .webp format',
      err
    );
    // Instant fallback to lightweight webp
    return webpDataUrl;
  }
}

