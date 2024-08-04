import fs from "fs";
import path from "path";
import { readEnv } from "../config/readEnv.config";
import logger from "../config/logger.config";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class StorageService {
  private static instance: StorageService | null = null;
  private readonly s3Client: S3Client;
  private readonly s3Bucket = readEnv("S3_BUCKET") as string;
  private readonly s3Options: S3ClientConfig = {
    // endpoint: readEnv("S3_ENDPOINT") as string,
    forcePathStyle: false,
    region: "us-east-1",
    credentials: {
      accessKeyId: readEnv("S3_ACCESS_KEY") as string,
      secretAccessKey: readEnv("S3_SECRET_KEY") as string,
    },
  };

  constructor() {
    this.s3Client = new S3Client(this.s3Options);
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public async uploadFile(file: Express.Multer.File, name: string) {
    try {
      const params = {
        Bucket: this.s3Bucket,
        Key: name,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const response = await this.s3Client.send(new PutObjectCommand(params));

      if (response.$metadata.httpStatusCode !== 200) {
        throw new Error("Error uploading file to storage.");
      }

      logger.info(`File ${file.originalname} uploaded successfully.`);

      return true;
    } catch (err) {
      logger.error("Error uploading file to storage.", err);
      return false;
    }
  }

  public async getPreSignedUrl(key: string) {
    const fileExists = await this.getFile(key);

    if (!fileExists) return undefined;

    return await getSignedUrl(this.s3Client, new GetObjectCommand({ Bucket: this.s3Bucket, Key: key }), {
      expiresIn: 60 * 60 * 24,
    });
  }

  private async getFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.s3Bucket,
      Key: key,
    });

    try {
      const response = await this.s3Client.send(command);

      const value = response.Body?.toString();

      return value;
    } catch (err) {
      return null;
    }
  }

  public async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.s3Bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (err) {
      logger.error(err);
    }
  }
}
