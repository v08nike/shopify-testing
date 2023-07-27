FROM node:18-alpine

ENV SHOPIFY_API_KEY=30aa0bddb5d31710cfb8d523d32c8dac
ENV SHOPIFY_API_SECRET=4a95b07883b6297b2eb992e0a255ad81
ENV SHOPIFY_JELLISTUDIO_ADDON_WEB_PIXEL_ID=30fd9d96-31cc-4a94-a383-bcdf575ad0fc
ENV PORT=8081
ENV HOST=https://shopify-testing-d4bl.onrender.com
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]
