import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const oldFilePath = formData.get('oldFilePath') as string | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
      });
    }

    if (oldFilePath) {
      const relativePath = oldFilePath.replace(/^\/+/, ''); // uploads/xxx.png
      const oldFullPath = path.join(process.cwd(), 'public', relativePath);
      try {
        await unlink(oldFullPath);
      } catch (error) {
        console.warn(
          `Old file not found or could not be deleted: ${oldFullPath}`,
          error
        );
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    await writeFile(filePath, buffer);

    // 公開URL
    const fileUrl = `/uploads/${fileName}`;

    return new Response(JSON.stringify({ url: fileUrl }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
    });
  }
};
