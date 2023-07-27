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

s3.getObject({ Bucket: s3Bucket, Key: "app-testing-website.myshopify.com.json" }, function (err, data) {
    if (!err) {
        const buff = Buffer.from(data.Body);
        const jsonString = buff.toString("utf8");
        const jsonObject = JSON.parse(jsonString);
        console.log(jsonObject.products)
    } else {
        console.log("GetObject Error:", err);
    }
})