import * as React from 'react';
import {
  Alert,
  AlertGroup,
  Card,
  CardBody,
  CardTitle,
  Hint,
  HintBody,
  HintTitle,
  Page,
  PageSection,
  Stack,
  StackItem,
  Title,
} from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { usePrometheusPoll, PrometheusEndpoint } from '@openshift-console/dynamic-plugin-sdk';

export const ExamplePage: React.FC<{ title: string }> = ({ title }) => {
  const { t } = useTranslation('plugin__console-demo-plugin');

  const [result, loaded, error] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    query: 'sum(http_requests_total)',
  });

  return (
    <Page
      additionalGroupedContent={
        <PageSection variant="light">
          <Title headingLevel="h1" data-test="title">{title}</Title>
        </PageSection>
      }
      groupProps={{ stickyOnBreakpoint: { 'default': 'top' }}}
    >
      <PageSection>
        <Stack hasGutter>
          <AlertGroup>
            <Alert title={t('Example info alert')} variant="info" isInline data-test="alert-info" />
            <Alert title={t('Example warning alert')} variant="warning" isInline data-test="alert-warning" />
          </AlertGroup>
          <Hint data-test="hint">
            <HintTitle>{t('Example hint')}</HintTitle>
            <HintBody>{t('This page shows an example gallery view with cards')}</HintBody>
          </Hint>
            <div style={{ display: 'flex', gap: '20px' }}>
                  <Card>
                    <CardTitle>{t('Applications discovered and protected')}</CardTitle>
                    <CardBody data-test="Apps-utility-fetch">
                    </CardBody>
                  </Card>
                  <Card>
                    <CardTitle>{t('Backups and Snapshots')}</CardTitle>
                    <CardBody data-test="Apps-utility-fetch">
                    </CardBody>
                  </Card>
            </div>
          <StackItem>
            {error && (
              <Alert variant="warning" data-testid="prometheus-error" title={t('Prometheus error')}>
                {error}
              </Alert>
            )}
            {!loaded && (
              <Alert
                variant="info"
                data-testid="prometheus-loading"
                title={t('Prometheus loading')}
              >
                {t('Prometheus loading')}
              </Alert>
            )}
            {!error && loaded && (
              <Alert data-testid="prometheus-data" title={t('Prometheus data')}>
                {JSON.stringify(result.data)}
              </Alert>
            )}
          </StackItem>
        </Stack>
      </PageSection>
    </Page>
  );
};

export default ExamplePage;
