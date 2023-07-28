import AWS from "aws-sdk";

const aws_access_key_id = "izJk6kXpBgfAdJc86Sfx";
const aws_secret_access_key = "1iwJ1QFaTq8zw4phhUNBMkIeuqwTYw6BkzJBjYzF";
const s3Bucket = "shopify-export";

const endpoint = new AWS.Endpoint("g1n2.sj.idrivee2-49.com");

const SESSION_FILE_NAME = "sessions.json";

const s3 = new AWS.S3({
    endpoint: endpoint,
    credentials: {
        accessKeyId: aws_access_key_id,
        secretAccessKey: aws_secret_access_key,
    },
});

export const loadAllSessions = async () => {
    try {
        const result = await s3.getObject({
          Bucket: s3Bucket,
          Key: SESSION_FILE_NAME,
        }).promise();
        if (result.Body) {
          const buff = Buffer.from(result.Body);
          const jsonString = buff.toString("utf8");
          const jsonObject = JSON.parse(jsonString);
      
          return jsonObject;
        }
        return [];
      } catch (error) {
        console.log(error);
        return [];
      }
};

export const saveSession = async (session) => {
    let sessions = await loadAllSessions();

    const index = sessions.findIndex(
        (item) => item.id === session.id
    );
    console.log(index);
    if (index < 0) {
        sessions.push(session);
    } else {
        sessions[index] = session;
    }

    try {
        s3.putObject({
            Bucket: s3Bucket,
            Key: SESSION_FILE_NAME,
            Body: JSON.stringify(sessions),
        }, function (err, data) {
            if (err) {
                console.log("Session Save Error:", err);
            } else {
                console.log("Session Save Success:", data);
            }
        });

    } catch (error) {
        console.log(error);
    }
};
