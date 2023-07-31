# Shopify App (JelliStudio Add-on)
Jellibeans / Shopify App for Data Integration

# development
In development mode, you can run this project following format.
```
npm run dev
```
env variables
```
S3_ACCESS_KEY_ID= // your s3 bucket access key id
S3_SECRET_ACCESS_KEY= // your s3 bucket secret access key
S3_ENDPOINT= // your s3 bucket endpoint
S3_BUCKET= // your s3 bucket name
SCOPES= // your shopify app access scrop eg."write_products,read_products"
SHOPIFY_API_KEY= // your shopify app api key
SHOPIFY_API_SECRET= // your shopify app api secret
```

# deployment
You can deploy the Shopify App on any server of your choice, such as GCP, Azure, or Heroku. This project is fully configured with Docker containers, making deployment easy and efficient. You need to set more follow two env variables to dev env when you deploy. 
```
// dev env variables
...
HOST= // your server host 
PORT= // your server port
```
Make sure to set these environment variables in a secure way and to keep them confidential.