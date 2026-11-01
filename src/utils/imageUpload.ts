/**
 * Client-side device image upload & optimization helper
 * Reads an image file from the user's device (phone gallery, camera, PC files),
 * resizes it to optimal avatar dimensions via HTML5 Canvas, and returns a lightweight Data URL.
 * This avoids any dependency on external image hosting URLs.
 */
export async function processImageFile(
  file: File,
  maxDimension = 280,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف المحدد ليس صورة صالحة (يرجى اختيار ملف صور JPG أو PNG أو WebP)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio while fitting within maxDimension
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const webpUrl = canvas.toDataURL('image/webp', quality);
          if (webpUrl.startsWith('data:image/webp')) {
            resolve(webpUrl);
            return;
          }
        } catch {
          // fallback to jpeg
        }

        const jpegUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegUrl);
      };
      img.onerror = () => reject(new Error('تعذر معالجة ملف الصورة'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('خطأ أثناء قراءة ملف الصورة من جهازك'));
    reader.readAsDataURL(file);
  });
}
