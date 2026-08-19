import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Image upload handling
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'gif', 'svg'];
    const isImage = file.type.startsWith('image/') || imageExtensions.includes(ext);

    if (isImage) {
      const dir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Generate a clean safe filename
      const safeExt = ext || 'jpg';
      const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${safeExt}`;
      const filepath = path.join(dir, filename);
      fs.writeFileSync(filepath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl });
    }

    // Video upload logic (backstage video / stories)
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'];
    if (!validVideoTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a valid image or video (MP4/WebM).' }, { status: 400 });
    }

    // Path setup: project_root/public/videos
    const dir = path.join(process.cwd(), 'public', 'videos');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const { searchParams } = new URL(req.url);
    const uploadType = searchParams.get('type');

    let filename = `backstage_${Date.now()}.mp4`;

    if (uploadType === 'story') {
      const safeExt = ext || 'mp4';
      filename = `story_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${safeExt}`;
    } else {
      // Proactively clean up old backstage videos to keep server disk usage optimal
      try {
        const files = fs.readdirSync(dir);
        for (const f of files) {
          if (f.startsWith('backstage_') && f.endsWith('.mp4')) {
            const oldFilePath = path.join(dir, f);
            fs.unlinkSync(oldFilePath);
          }
        }
      } catch (err) {
        console.error('Failed to prune old videos:', err);
      }
    }

    const filepath = path.join(dir, filename);
    fs.writeFileSync(filepath, buffer);

    const publicUrl = `/videos/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
