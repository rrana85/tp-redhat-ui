import React from 'react';
import Helmet from 'react-helmet';
import {
  Button,
  Page,
  PageSection,
  Text,
  TextContent,
  Title,
  Nav,
  NavList,
  NavItem,
} from '@patternfly/react-core';
import { ArrowLeftIcon } from '@patternfly/react-icons';
import Backups from './Backups';

export default function SelectedApp({ app, onBack }) {
  const [activeItem, setActiveItem] = React.useState('backups');

  const sections = ['backups', 'snapshots', 'exechooks', 'schedule'];

  const onSelect = () => {};

  var getPage = () => {
    switch (activeItem) {
      case 'backups':
        return <Backups appName={app.metadata.name} namespace={app.metadata.namespace} />;
      case 'snapshots':
        return <Backups appName={app.metadata.name} namespace={app.metadata.namespace} />;
      case 'exechooks':
        return <Backups appName={app.metadata.name} namespace={app.metadata.namespace} />;
      case 'schedule':
        return <Backups appName={app.metadata.name} namespace={app.metadata.namespace} />;
    }
  };

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{'Dashboard'}</title>
      </Helmet>

      <Page>
        <PageSection variant="light">
          <Button onClick={onBack} variant="stateful" icon={<ArrowLeftIcon />} state="read" />
          <div style={{ height: 20 }} />
          <Title headingLevel="h1" size="lg">
            {app.metadata.name}
          </Title>
          <Text>{app.metadata.uid}</Text>
          <div style={{ height: 30 }} />
          <Nav variant="horizontal" onSelect={onSelect} aria-label="Horizontal subnav local">
            <NavList>
              {sections.map((value) => {
                return (
                  <NavItem
                    preventDefault
                    key={value}
                    onClick={() => setActiveItem(value)}
                    itemId={value}
                    isActive={activeItem === value}
                    style={{ color: activeItem === value ? null : 'black' }}
                  >
                    {value}
                  </NavItem>
                );
              })}
            </NavList>
          </Nav>

          {getPage(activeItem)}
        </PageSection>
      </Page>
    </>
  );
}
