// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config(); // Load environment variables

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload an image
export const uploadImage = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
    try {
      const stream = new Readable();
      stream.push(fileBuffer);
      stream.push(null);
  
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: fileName, resource_type: 'image' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
  
        stream.pipe(uploadStream);
      });
  
      return (uploadResult as any).secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };