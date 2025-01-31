import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Page,
  PageSection,
  Text,
  TextContent,
  Title,
  TextInput,
} from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, sortable } from '@patternfly/react-table';
import { ArrowLeftIcon, SyncIcon, WindowRestoreIcon } from '@patternfly/react-icons';
import { MdOutlineRestore } from 'react-icons/md';

import { K8sResourceCommon, k8sCreate, k8sList } from '@openshift-console/dynamic-plugin-sdk';
import {
  ApplicationModel,
  AppvaultModel,
  BackupModel,
  NamespaceModel,
  BackupRestoreModel,
} from '../Modals/TridentProtectModels';
import { formatDistanceToNow, set } from 'date-fns';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { Nav, NavItem, NavList } from '@patternfly/react-core';
import { Modal, Select, SelectOption, SelectVariant, Alert } from '@patternfly/react-core';
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  Divider,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { group } from '../Modals/TridentProtectModels';
import { version } from '../Modals/TridentProtectModels';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function Backups({ appName, namespace }) {
  const { t } = useTranslation('plugin__console-plugin-template');

  const [apps, setApps] = React.useState([]);
  const [appvaults, setAppvaults] = React.useState([]);
  const [selectedAppVault, setSelectedAppVault] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const [openRestoreDialog, setOpenRestoreDialog] = React.useState(false);
  const [selectedBackup, setSelectedBackup] = React.useState(null);
  const [destinationNamespace, setDestinationNamespace] = React.useState('');
  const [restoreTriggered, setRestoreTriggered] = React.useState(false);

  const [loading, setLoading] = React.useState(true);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAppVaultSelect = (event, selection) => {
    setSelectedAppVault(selection);
  };

  const [colDefs, setColDefs] = React.useState([
    { field: 'Name' },
    { field: 'Namespace' },
    { field: 'Status' },
    { field: 'Age' },
    {
      field: '',
      sortable: false,
      filter: false,
      cellRenderer: (value) => {
        return (
          <Button
            onClick={() => {
              // show dialog with dorpdown to select appvault
              setSelectedBackup(value.data.app);
              setOpenRestoreDialog(true);
            }}
            variant="plain"
            icon={<MdOutlineRestore size={25} />}
            state="read"
          />
        );
      },
    },
  ]);

  // k8sList(ApplicationModal);

  const myTheme = themeQuartz.withParams({
    wrapperBorder: false,
    headerRowBorder: false,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      k8sList({
        model: BackupModel,
        requestInit: {},
        queryParams: { namespace: namespace, '.spec.applicationRef': appName },
      }).then((response) => {
        // update status if apps and response are not same do deep comparison
        if (JSON.stringify(apps) !== JSON.stringify(response)) {
          setApps(response);
        }
        setLoading(false);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      k8sList({
        model: AppvaultModel,
        requestInit: {},
      }).then((response) => {
        // update status if apps and response are not same do deep comparison
        if (JSON.stringify(appvaults) !== JSON.stringify(response)) {
          setAppvaults(response);
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const columnNames = {
    name: 'Name',
    namespace: 'Namespace',
    status: 'Status',
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

  const createBackup = () => {
    k8sCreate({
      model: BackupModel,
      data: {
        apiVersion: `${group}/${version}`,

        kind: 'Backup',
        metadata: {
          name: 'backup-' + new Date().getTime(),
          namespace: namespace,
        },
        spec: {
          applicationRef: appName,
          appVaultRef: selectedAppVault.metadata.name,
        },
      },
    }).then((response) => {
      console.log('Backup created successfully');
    });
  };

  const createRestore = async () => {
    try {
      await k8sCreate({
        model: NamespaceModel,
        data: {
          apiVersion: 'v1',
          kind: 'Namespace',
          metadata: {
            name: destinationNamespace,
          },
        },
      });
    } catch (e) {
      console.log('Error creating namespace', e);
    } finally {
      await k8sCreate({
        model: BackupRestoreModel,
        data: {
          apiVersion: `${group}/${version}`,

          kind: 'BackupRestore',
          metadata: {
            name: 'backuprestore-' + new Date().getTime(),
            namespace: destinationNamespace,
          },
          spec: {
            appVaultRef: selectedBackup.spec.appVaultRef,
            appArchivePath: selectedBackup.status.appArchivePath,
            applicationRef: appName,
            namespaceMapping: [
              {
                source: namespace,
                destination: destinationNamespace,
              },
            ],
          },
        },
      });
      setRestoreTriggered(true);
      // after timeout reset the restore triggered
      setTimeout(() => {
        setRestoreTriggered(false);
      }, 3000);
    }
  };

  return (
    <>
      <Helmet>
        <title data-test="example-page-title">{'Dashboard'}</title>
      </Helmet>

      <div style={{ marginTop: 0 }}>
        <div variant="light">
          <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <Button
              onClick={() => {
                // show dialog with dorpdown to select appvault
                handleModalToggle();
              }}
            >
              Create New Backup
            </Button>
          </div>
          <div style={{ height: 500 }}>
            <AgGridReact
              theme={myTheme}
              loading={loading}
              gridOptions={{ defaultColDef: { sortable: true, filter: true } }}
              rowData={apps.map((repo) => {
                return {
                  Name: repo.metadata.name,
                  Namespace: repo.metadata.namespace,
                  Status: repo.status.state,
                  Age: formatDistanceToNow(new Date(repo.metadata.creationTimestamp), {
                    addSuffix: true,
                  }),
                  app: repo,
                };
              })}
              defaultColDef={defaultColDef}
              columnDefs={colDefs}
            />
          </div>
        </div>
      </div>

      <div>
        {restoreTriggered && (
          <Alert
            variant="success"
            title="Success triggered restore operation"
            ouiaId="SuccessAlert"
          />
        )}
        <Modal
          width={500}
          title="Select AppVault"
          isOpen={isModalOpen}
          onClose={() => {
            handleModalToggle();
          }}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={() => {
                createBackup();
                handleModalToggle();
              }}
            >
              Confirm
            </Button>,
            <Button
              key="cancel"
              variant="link"
              onClick={() => {
                handleModalToggle();
              }}
            >
              Cancel
            </Button>,
          ]}
        >
          <Dropdown
            isOpen={isOpen}
            onSelect={() => {}}
            onOpenChange={(isOpen) => setIsOpen(isOpen)}
            toggle={(toggleRef) => (
              <MenuToggle
                ref={toggleRef}
                onClick={() => {
                  setIsOpen(true);
                }}
                isExpanded={isOpen}
              >
                {selectedAppVault == null ? 'Appvault' : selectedAppVault.metadata.name}
              </MenuToggle>
            )}
            ouiaId="BasicDropdown"
            shouldFocusToggleOnSelect
          >
            <DropdownList>
              {appvaults.map((appvault) => (
                <DropdownItem
                  key={appvault.metadata.name}
                  onClick={(event) => {
                    handleAppVaultSelect(event, appvault);
                    setIsOpen(false);
                  }}
                >
                  {appvault.metadata.name}
                </DropdownItem>
              ))}
            </DropdownList>
          </Dropdown>
        </Modal>

        <Modal
          width={500}
          title="Enter Namespace"
          isOpen={openRestoreDialog}
          onClose={() => {
            setOpenRestoreDialog(false);
          }}
          actions={[
            <Button
              key="confirm"
              variant="primary"
              onClick={() => {
                createRestore();
                setOpenRestoreDialog(false);
              }}
            >
              Confirm
            </Button>,
            <Button
              key="cancel"
              variant="link"
              onClick={() => {
                setOpenRestoreDialog(false);
              }}
            >
              Cancel
            </Button>,
          ]}
        >
          <TextInput
            type="text"
            id="namespace"
            name="namespace"
            placeholder="Destination Namespace"
            onChange={(event) => {
              setDestinationNamespace(event.target.value);
              // handle namespace change
            }}
          />
        </Modal>
      </div>
    </>
  );
}
