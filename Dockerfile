FROM node:18-alpine

ARG SHOPIFY_API_KEY
ARG SHOPIFY_API_SECRET
ARG SHOPIFY_JELLISTUDIO_ADDON_WEB_PIXEL_ID
ARG PORT
ARG HOST
ARG SCOPES

ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY \
    SHOPIFY_API_SECRET=$SHOPIFY_API_SECRET \
    SHOPIFY_JELLISTUDIO_ADDON_WEB_PIXEL_ID=$SHOPIFY_JELLISTUDIO_ADDON_WEB_PIXEL_ID \
    PORT=$PORT \
    HOST=$HOST \
    SCOPES=$SCOPES

EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
