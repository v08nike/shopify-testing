FROM node:18-alpine

ARG SHOPIFY_API_KEY
ARG SHOPIFY_API_SECRET
ARG PORT
ARG HOST
ARG SCOPES
ARG S3_ACCESS_KEY_ID
ARG S3_SECRET_ACCESS_KEY
ARG S3_ENDPOINT
ARG S3_BUCKET

ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY \
    SHOPIFY_API_SECRET=$SHOPIFY_API_SECRET \
    PORT=$PORT \
    SCOPES=$SCOPES \
    S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID \
    S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY \
    S3_ENDPOINT=$S3_ENDPOINT \
    S3_BUCKET=$S3_BUCKET

EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install


WORKDIR /app/frontend
RUN npm install 
RUN REACT_APP_SHOPIFY_API_KEY=$SHOPIFY_API_KEY HOST=$HOST npm run build

WORKDIR /app
CMD ["npm", "run", "serve"]
