// api/upload/route.ts
import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export const POST = async (req: Request) => {
  const data = await req.formData();
  const file = data.get('file');

  // Check if the file is valid
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
  }

  console.log('Received file:', file);
  console.log('File type:', file.type);
  console.log('File name:', file.name);
  console.log('File size:', file.size);

  const buffer = await file.arrayBuffer();
  try {
    const imageUrl = await uploadImage(Buffer.from(buffer), file.name);
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
};
