import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Button, Page, PageSection, Text, TextContent, Title } from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { K8sResourceCommon, k8sList } from '@openshift-console/dynamic-plugin-sdk';
import { ApplicationModel } from '../Modals/TridentProtectModels';
import { formatDistanceToNow } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import SelectedApp from './SelectedApp';
import { Nav, NavItem, NavList } from '@patternfly/react-core';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function ApplicationPage() {
  const { t } = useTranslation('plugin__console-plugin-template');

  const [apps, setApps] = React.useState([]);
  const [selectedApp, setSelectedApp] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const [colDefs, setColDefs] = React.useState([
    { field: 'Name' },
    { field: 'Namespaces' },
    { field: 'Protection Status' },
    { field: 'Age' },
  ]);

  // k8sList(ApplicationModal);

  const myTheme = themeQuartz.withParams({
    wrapperBorder: false,
    headerRowBorder: false,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      k8sList({ model: ApplicationModel, requestInit: {}, queryParams: {} }).then((response) => {
        // update status if apps and response are not same do deep comparison
        if (JSON.stringify(apps) !== JSON.stringify(response)) {
          setApps(response);
        }
        setLoading(false);
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

  const defaultColDef = React.useMemo(() => {
    return {
      resizable: false,
      sortable: true,
      filter: true,
      flex: 1,
    };
  }, []);

  const handleRowClick = (event) => {
    setSelectedApp(event.data.app);
  };

  if (selectedApp) {
    return (
      <SelectedApp
        app={selectedApp}
        onBack={() => {
          setSelectedApp(null);
        }}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{'Dashboard'}</title>
      </Helmet>

      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{'Applications'}</Title>
          <div style={{ height: 5 }}></div>
          <TextContent>
            <Text style={{ color: 'lightblue' }} component="h6">
              {'View and manage all your running apps'}
            </Text>
          </TextContent>

          <div style={{ height: 20 }}></div>

          <div style={{ height: '70vh' }}>
            <AgGridReact
              loading={loading}
              theme={myTheme}
              gridOptions={{ defaultColDef: { sortable: true, filter: true } }}
              rowData={apps.map((repo) => {
                return {
                  Name: repo.metadata.name,
                  Namespaces: repo.spec.includedNamespaces.map((ns) => ns.namespace).join(', '),
                  'Protection Status': repo.status.protectionState,
                  Age: formatDistanceToNow(new Date(repo.metadata.creationTimestamp), {
                    addSuffix: true,
                  }),
                  app: repo,
                };
              })}
              defaultColDef={defaultColDef}
              columnDefs={colDefs}
              onRowClicked={handleRowClick}
            />
          </div>
        </PageSection>
      </Page>
    </>
  );
}
