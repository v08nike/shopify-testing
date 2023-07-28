import {
  Card,
  Page,
  Layout,
  TextContainer,
  Stack,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";

import { useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";

export default function HomePage() {
  const { t } = useTranslation();
  const fetch = useAuthenticatedFetch();

  useEffect(() => {
    fetch("/api/saveSession");
  }, [fetch])

  return (
    <Page narrowWidth>
      <TitleBar title={t("HomePage.title")} primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Text as="h2" variant="headingMd">
                    {t("HomePage.heading")}
                  </Text>
                  <h1>Welcome to JelliStudio Add-on shopify app!</h1>
                </TextContainer>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
