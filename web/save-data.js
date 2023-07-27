import AWS from "aws-sdk";

const aws_access_key_id = "izJk6kXpBgfAdJc86Sfx";
const aws_secret_access_key = "1iwJ1QFaTq8zw4phhUNBMkIeuqwTYw6BkzJBjYzF";
const s3Bucket = "shopify-export";

const endpoint = new AWS.Endpoint("g1n2.sj.idrivee2-49.com");

const s3 = new AWS.S3({
    endpoint: endpoint,
    credentials: {
        accessKeyId: aws_access_key_id,
        secretAccessKey: aws_secret_access_key
    }
});

export const saveData = async (products, customers, shopName, date, ts) => {
    const objectData = { products, customers: (customers || {}) };
    const fileName = `${shopName}/${date}/shopify_export_${date}_${ts}.json`;

    try {
        s3.putObject({
            Bucket: s3Bucket,
            Key: fileName,
            Body: JSON.stringify(objectData),
        }, function (err, data) {
            if (err) {
                console.log("Error:", err);
            } else {
                console.log("Success:", data);
            }
        });
    } catch (error) {
        console.log(error);
    }
}