import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "@/lib/s3";

function getBucket(bucketType: string | null) {
  const publicBucket = process.env.NEXT_PUBLIC_AWS_S3_PUBLIC_BUCKET;
  const privateBucket = process.env.AWS_S3_PRIVATE_BUCKET;
  return bucketType === "private" ? privateBucket : publicBucket;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const bucketType = searchParams.get("bucketType") || "public";

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const bucket = getBucket(bucketType);
    if (!bucket) {
      return NextResponse.json({ error: `S3 ${bucketType} bucket not configured` }, { status: 500 });
    }

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: filename,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return NextResponse.json({ url: signedUrl });
  } catch (error: any) {
    console.error("S3 GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { filename, contentType, bucketType = "public" } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const bucket = getBucket(bucketType);
    if (!bucket) {
      return NextResponse.json({ error: `S3 ${bucketType} bucket not configured` }, { status: 500 });
    }

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    return NextResponse.json({ 
      url: signedUrl, 
      publicUrl: bucketType === "private" 
        ? `s3-private://${filename}` // Internal marker for private content
        : `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
    });
  } catch (error: any) {
    console.error("S3 POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    const bucketType = searchParams.get("bucketType") || "public";

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const bucket = getBucket(bucketType);
    if (!bucket) {
      return NextResponse.json({ error: `S3 ${bucketType} bucket not configured` }, { status: 500 });
    }

    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: filename,
    });
    
    await s3.send(command);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("S3 DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
