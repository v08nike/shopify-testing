import AWS from "aws-sdk";
import 'dotenv/config';

const aws_access_key_id = process.env.S3_ACCESS_KEY_ID;
const aws_secret_access_key = process.env.S3_SECRET_ACCESS_KEY;
const s3Bucket = process.env.S3_BUCKET;

const endpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);

const s3 = new AWS.S3({
  endpoint: endpoint,
  credentials: {
    accessKeyId: aws_access_key_id,
    secretAccessKey: aws_secret_access_key,
  },
});

export const saveData = async (products, customers, shopName, date, ts) => {
  const objectData = { products, customers: customers || {} };
  const fileName = `${shopName}/${date}/shopify_export_${date}_${ts}.json`;

  try {
    const result = await s3
      .putObject({
        Bucket: s3Bucket,
        Key: fileName,
        Body: JSON.stringify(objectData),
      })
      .promise();

    console.log(result);
  } catch (error) {
    console.log(error);
  }
};
