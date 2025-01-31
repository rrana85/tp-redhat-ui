import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import {
  Page,
  PageSection,
  Text,
  TextContent,
  Title,
  Card,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { K8sResourceCommon, k8sList } from '@openshift-console/dynamic-plugin-sdk';
import { ApplicationModel, BackupModel, SnapshotModel } from '../Modals/TridentProtectModels';
import { formatDistanceToNow, set } from 'date-fns';
import exampleImage from '../../images/trident_logo.jpg';

export default function DashboardPage() {
  const { t } = useTranslation('plugin__console-plugin-template');

  const [apps, setApps] = React.useState([]);
  const [backups, setBackups] = React.useState([]);
  const [snapshots, setSnapshots] = React.useState([]);

  // k8sList(ApplicationModal);

  React.useEffect(() => {
    const interval = setInterval(() => {
      k8sList({ model: ApplicationModel, requestInit: {}, queryParams: {} }).then((response) => {
        // update status if apps and response are not same do deep comparison
        if (JSON.stringify(apps) !== JSON.stringify(response)) {
          setApps(response);
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      k8sList({ model: BackupModel, requestInit: {}, queryParams: {} }).then((response) => {
        // update status if apps and response are not same do deep comparison
        if (JSON.stringify(backups) !== JSON.stringify(response)) {
          setBackups(response);
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      k8sList({ model: SnapshotModel, requestInit: {}, queryParams: {} }).then((response) => {
        // update status if apps and response are not same do deep comparison
        if (JSON.stringify(snapshots) !== JSON.stringify(response)) {
          setSnapshots(response);
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const columnNames = {
    name: 'Name',
    includedNamespaces: 'Namespaces',
    protectionStatus: 'Protection Status',
    age: 'Age',
  };

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{'Dashboard'}</title>
      </Helmet>

      <Page>
        <PageSection variant="light">
          <img
            src={exampleImage}
            alt="An example image"
            style={{
              width: '100px',
              height: '100px',
            }}
          />
          <Title headingLevel="h1">{'Welcome to NetApp Trident Protect'}</Title>
          <Text>Protect and manage all your kubernetes workloads</Text>

          <div style={{ height: 30 }}></div>

          <Text style={{ fontSize: '1rem', fontWeight: 'bold', color: 'black' }}>
            {'RESOURCE SUMMARY'}
          </Text>

          <div style={{ height: 10 }}></div>

          <div style={{ display: 'flex' }}>
            <Card
              style={{
                padding: '40px',
                marginTop: 20,
                width: 500,
                border: '1px solid #ddd',
                borderRadius: '10px',
              }}
            >
              <Text style={{ textAlign: 'center' }}>APPLICATIONS</Text>

              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'green', fontSize: 80, textAlign: 'center' }}>
                    {apps.filter((vaule) => vaule.status.protectionState == 'Protected').length}
                  </Text>
                  <Text>Protected</Text>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'orange', fontSize: 80, textAlign: 'center' }}>
                    {apps.filter((vaule) => vaule.status.protectionState == 'Partial').length}
                  </Text>
                  <Text>Partaily Protected</Text>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'red', fontSize: 80, textAlign: 'center' }}>
                    {apps.filter((vaule) => vaule.status.protectionState == 'None').length}
                  </Text>
                  <Text>Unprotected</Text>
                </div>
              </div>
            </Card>

            <Card
              style={{
                padding: '40px',
                marginTop: 20,
                width: 500,
                marginLeft: 40,
                border: '1px solid #ddd',
                borderRadius: '10px',
              }}
            >
              <Text style={{ textAlign: 'center' }}>DATA PROTECTION</Text>
              <div style={{ height: 20 }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Text>Backups</Text>
                  <Text style={{ color: 'blue', fontSize: 80, textAlign: 'center' }}>
                    {backups.length}
                  </Text>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Text>Snapshots</Text>
                  <Text style={{ color: 'blue', fontSize: 80, textAlign: 'center' }}>
                    {snapshots.length}
                  </Text>
                </div>
              </div>
            </Card>
          </div>

          <div style={{ height: 30 }}></div>
          <Text style={{ fontSize: '1rem', fontWeight: 'bold', color: 'black' }}>
            {'GETTING  STARTED'}
          </Text>
          <div style={{ height: 20 }}></div>
          <a
            href="https://docs.netapp.com/us-en/trident/trident-protect/trident-protect-installation.html"
            target="_blank"
            rel="noreferrer"
          >
            <h3>Install and configure Trident protect</h3>
          </a>
          <a
            href="https://docs.netapp.com/us-en/trident/trident-protect/manage-authorization-access-control.html"
            target="_blank"
            rel="noreferrer"
          >
            <h3>Manage Trident protect</h3>
          </a>
          <a
            href="https://docs.netapp.com/us-en/trident/trident-protect/trident-protect-appvault-custom-resources.html"
            target="_blank"
            rel="noreferrer"
          >
            <h3>Manage and protect applications</h3>
          </a>
        </PageSection>
      </Page>
    </>
  );
}
