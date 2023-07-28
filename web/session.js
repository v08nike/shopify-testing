import AWS from "aws-sdk";

const aws_access_key_id = process.env.S3_ACCESS_KEY_ID;
const aws_secret_access_key = process.env.S3_SECRET_ACCESS_KEY;
const s3Bucket = process.env.S3_BUCKET;

const endpoint = new AWS.Endpoint(process.env.S3_ENDPOINT);

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
    const result = await s3
      .getObject({
        Bucket: s3Bucket,
        Key: SESSION_FILE_NAME,
      })
      .promise();
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

  const index = sessions.findIndex((item) => item.id === session.id);
  if (index < 0) {
    sessions.push(session);
  } else {
    sessions[index] = session;
  }

  try {
    s3.putObject(
      {
        Bucket: s3Bucket,
        Key: SESSION_FILE_NAME,
        Body: JSON.stringify(sessions),
      },
      function (err, data) {
        if (err) {
          console.log("Session Save Error:", err);
        } else {
          console.log("Session Save Success:", data);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
