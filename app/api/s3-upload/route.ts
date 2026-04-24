import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";

export async function POST(request: Request) {
  try {
    const { filename, contentType, action = "upload" } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const bucket = process.env.NEXT_PUBLIC_AWS_S3_PUBLIC_BUCKET;
    if (!bucket) {
      return NextResponse.json({ error: "S3 bucket not configured" }, { status: 500 });
    }

    if (action === "upload") {
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: filename,
        ContentType: contentType,
      });

      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return NextResponse.json({ 
        url: signedUrl, 
        publicUrl: `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
      });
    }

    if (action === "delete") {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: filename,
      });
      await s3.send(command);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("S3 Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
