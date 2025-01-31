import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Page, PageSection, Text, TextContent, Title } from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { CheckCircleIcon } from '@patternfly/react-icons';
import {
  K8sResourceCommon,
  k8sList,
} from '@openshift-console/dynamic-plugin-sdk';
import { ApplicationModel, AppvaultModel } from '../Modals/TridentProtectModels';
import { formatDistanceToNow } from 'date-fns';


export default function AppvaultPage() {
  const { t } = useTranslation('plugin__console-plugin-template');

  const [apps, setApps] = React.useState([]);

  // k8sList(ApplicationModal);

  React.useEffect(() => {
    k8sList({model:AppvaultModel, requestInit: {}, queryParams: {}}).then((response) => {
       setApps(response);
    });
  });


  const columnNames = {
    name: 'Name',
    provider: 'Provider',
    state: 'State',
    age: 'Age',
  };
  



  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{('Appvault')}</title>
      </Helmet>

      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{('Appvaults')}</Title>
          <div style={{height:5}}>
            
            </div>
          <TextContent >
            <Text  style={{color:'lightblue'}} component="h6">{('View and manage all your appvault')}</Text>
          </TextContent>

          <div style={{height:20}}>
            
          </div>

   

        

          <Table  aria-label="Appvaults" variant={'compact'}>
            <Thead>
              <Tr>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem'}}>{columnNames.name}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem'}}>{columnNames.provider}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem'}}>{columnNames.state}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem'}}>{columnNames.age}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {apps.map((repo) => (
                <Tr height={30} key={repo.metadata.name}>
                  <Td dataLabel={columnNames.name}>{repo.metadata.name}</Td>
                  <Td dataLabel={columnNames.provider}>
                    {repo.spec.providerType}
                  </Td>
                  <Td dataLabel={columnNames.protectionStatus}>
                    {repo.status.state}
                  </Td>
                  <Td dataLabel={columnNames.age}>
                    {formatDistanceToNow(new Date(repo.metadata.creationTimestamp), { addSuffix: true })}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageSection>
      </Page>
    </>
  );
}
