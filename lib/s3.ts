import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from 'fs'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


const uploadFileToS3 = async (filePath, bucketName, key) => {
  const fileStream = fs.createReadStream(filePath)

  const uploadParams = {
    Bucket: bucketName,
    Key: key,
    Body: fileStream
  }

  try {
    const res = await s3Client.send(new PutObjectCommand(uploadParams))
    console.log(`File uploaded successfully. ${res}`)
  } catch (error) {
    console.error('Error uploading file: ', error)
  }
}