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
import { BackupModel, SnapshotModel } from '../Modals/TridentProtectModels';
import { formatDistanceToNow } from 'date-fns';


export default function DataProtectionPage() {
  const { t } = useTranslation('plugin__console-plugin-template');

  const [backups, setBackups] = React.useState([]);
  const [snaps, setSnapshots] = React.useState([]);

  React.useEffect(() => {
    k8sList({model:BackupModel, requestInit: {}, queryParams: {}}).then((response) => {
       setBackups(response);
    });
  });

  const backupColumnNames = {
    namespace: 'Namespace',
    name: 'Name',
    app: 'Application',
    reclaimpol: 'Reclaim Policy',
    state: 'State',
    error: 'Error',
    age: 'Age',
  };

  React.useEffect(() => {
    k8sList({model:SnapshotModel, requestInit: {}, queryParams: {}}).then((response) => {
       setSnapshots(response);
    });
  });

  const snapColumnNames = {
    namespace: 'Namespace',
    name: 'Name',
    app: 'Application',
    reclaimpol: 'Reclaim Policy',
    state: 'State',
    error: 'Error',
    age: 'Age',
  };
  
  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{('Backup')}</title>
      </Helmet>

      <Page>
        <PageSection variant="light">
          <Title headingLevel="h1">{('Backups')}</Title>
          <div style={{height:5}}>
            
            </div>
          <TextContent >
            <Text  style={{color:'lightblue'}} component="h6">{('View and manage all your backups')}</Text>
          </TextContent>

          <div style={{height:20}}>
            
          </div>

          <Table  aria-label="Backups" variant={'compact'}>
            <Thead>
              <Tr>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem',}}>{backupColumnNames.namespace}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem',}}>{backupColumnNames.name}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem',}}>{backupColumnNames.app}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem',}}>{backupColumnNames.reclaimpol}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem', }}>{backupColumnNames.state}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem', }}>{backupColumnNames.error}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem', }}>{backupColumnNames.age}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {backups.map((repo) => (
                <Tr height={30} key={repo.metadata.namespace}>
                  <Td dataLabel={backupColumnNames.namespace}>
                    {repo.metadata.namespace}
                  </Td>
                  <Td dataLabel={backupColumnNames.name}>
                    {repo.metadata.name}
                  </Td>
                  <Td dataLabel={backupColumnNames.app}>
                    {repo.spec.applicationRef}
                  </Td>
                  <Td dataLabel={backupColumnNames.reclaimpol}>
                    {repo.spec.reclaimPolicy}
                  </Td>
                  <Td dataLabel={backupColumnNames.state}>
                    {repo.status.state}
                  </Td>
                  <Td dataLabel={backupColumnNames.error}>
                    {repo.status.error}
                  </Td>
                  <Td dataLabel={backupColumnNames.age}>
                    {/* {formatDistanceToNow(new Date(repo.metadata.creationTimestamp), { addSuffix: true })} */}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageSection>
        <PageSection variant="light">
          <Title headingLevel="h1">{('Snapshots')}</Title>
          <div style={{height:5}}>
          </div>
          <TextContent >
            <Text  style={{color:'lightblue'}} component="h6">{('View and manage all your snapshots')}</Text>
          </TextContent>

          <div style={{height:20}}>
          </div>

          <Table  aria-label="Snapshots" variant={'compact'}>
            <Thead>
              <Tr>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem',}}>{snapColumnNames.namespace}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem', maxWidth:'50px' }}>{snapColumnNames.name}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem',}}>{snapColumnNames.app}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem', }}>{snapColumnNames.reclaimpol}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem',}}>{snapColumnNames.state}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem',}}>{snapColumnNames.error}</Th>
                <Th style={{fontWeight:'bold', fontSize:'1.25rem',}}>{snapColumnNames.age}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {snaps.map((repo) => (
                <Tr height={30} key={repo.metadata.namespace}>
                  <Td dataLabel={snapColumnNames.namespace}>
                    {repo.metadata.namespace}
                  </Td>
                  <Td dataLabel={snapColumnNames.name}>
                    {repo.metadata.name}
                  </Td>
                  <Td dataLabel={snapColumnNames.app}>
                    {repo.spec.applicationRef}
                  </Td>
                  <Td dataLabel={snapColumnNames.reclaimpol}>
                    {repo.spec.reclaimPolicy}
                  </Td>
                  <Td dataLabel={snapColumnNames.state}>
                    {repo.status.state}
                  </Td>
                  <Td dataLabel={snapColumnNames.error}>
                    "" 
                  </Td>
                  <Td dataLabel={snapColumnNames.age}>
                    {/* {formatDistanceToNow(new Date(repo.metadata.creationTimestamp), { addSuffix: true })} */}
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
