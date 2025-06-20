'use server';

import cloudinary from '@/lib/cloudinary';

type CloudinaryUploadResult = {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  etag: string;
  original_filename: string;
  [key: string]: any;
};


export async function uploadImage(selectedFile:File,type:string) {
let folderName: string | undefined = undefined;
const file = selectedFile as File | undefined;

if (type === "donorProfile") {
  folderName = 'blood_bank_management/donorProfile';
}else if (type=== "bloodBankProfile"){
  folderName = 'blood_bank_management/bloodBankProfile';
}
if (!file || !folderName) {
  return { success: false, error: 'No file provided or invalid type' };
}

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    return { success: true, data: result };
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return { success: false, error: 'Upload failed' };
  }
}