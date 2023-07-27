// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";
import cron from "node-cron";
import { saveData } from "./save-data.js";
import { Session } from '@shopify/shopify-api';
import moment from "moment";
import { loadAllSessions } from "./load-session.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  async (req, res, next) => {
    try {
      const callbackResponse = await shopify.api.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });

      const session = callbackResponse.session.toObject();
      shopify.config.sessionStorage.storeSession(new Session(session))
    } catch (error) {
      console.error(error);

    }
    next({req, res, next});
  },
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

const fetchAndSaveData = async () => {
  try {
    const currentDate = moment().format('YYYYMMDD');
    const currentTimestamp = moment().valueOf();
    const sessions = await loadAllSessions();
    if (sessions.length) {
      for (let i = 0; i < sessions.length; i += 1) {
        const session = sessions[i];
        if (session) {
          let products = [];
          let pageInfo = null;
          while (true) {
            const response = await shopify.api.rest.Product.all({
              session,
              limit: 250,
              page_info: pageInfo
            });
            products = products.concat(response.data);
            pageInfo = response.pageInfo?.nextPage?.query?.page_info;
            if (response.data.length < 250 || !pageInfo) {
              break;
            }
          }

          let customers = [];
          let customerPageInfo = null;
          try {
            while (true) {
              const response = await shopify.api.rest.Customer.all({
                session,
                limit: 250,
                page_info: customerPageInfo
              });
              customers = customers.concat(response.data);
              customerPageInfo = response.pageInfo?.nextPage?.query?.page_info;
              if (response.data.length < 250 || !customerPageInfo) {
                break;
              }
            }

          } catch (e) {
            console.log("Don't have customer data access!")
          }

          saveData(products, customers, session.shop, currentDate, currentTimestamp);
        }
      }
    }
    console.log("ENDED SAVING DATA");
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const testingSession = async () => {
  const sessions = await loadAllSessions();
  console.log(sessions);
}

const startInerval = () => {
  // cron.schedule('0 */8 * * *', fetchAndSaveData, {
  //   timezone: 'UTC'
  // });
  cron.schedule('*/10 * * * * *', testingSession, {
    timezone: 'UTC'
  });
  cron.schedule('0 * * * *', fetchAndSaveData, {
    timezone: 'UTC'
  });
}

app.get("/products/save", async (_req, res) => {
  fetchAndSaveData();
  res.status(200).send({ success: true });
})

app.get("/api/products/save", async (_req, res) => {
  const session = res.locals.shopify.session;
  shopify.config.sessionStorage.storeSession(new Session(session));
  res.status(200).send({ success: true });
})

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
