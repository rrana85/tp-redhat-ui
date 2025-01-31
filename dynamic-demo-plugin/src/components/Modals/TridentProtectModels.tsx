import { K8sKind, K8sModel } from "@openshift-console/dynamic-plugin-sdk";

export var group = 'protect.trident.netapp.io';
export var version = 'v1';

export const ApplicationModel: K8sKind = {
    label: 'Applications',
    // t('public~Application')
    labelKey: 'public~Application',
    labelPlural: 'Applications',
    // t('public~Applications')
    labelPluralKey: 'public~Applications',
    apiVersion: version,
    apiGroup: group,
    plural: 'applications',
    abbr: 'apps',
    namespaced: true,
    kind: 'Application',
    id: 'application',
    crd: true,
  };

  export const AppvaultModel: K8sKind = {
    label: 'Appvaults',
    // t('public~Application')
    labelKey: 'public~Appvault',
    labelPlural: 'Appvaults',
    // t('public~Applications')
    labelPluralKey: 'public~Appvaults',
    apiVersion: version,
    apiGroup: group,
    plural: 'appvaults',
    abbr: 'av',
    namespaced: true,
    kind: 'Appvault',
    id: 'appvault',
    crd: true,
  };

  export const BackupModel: K8sModel = {
    label: 'Backups',
    // t('public~Backup')
    labelKey: 'public~Backup',
    labelPlural: 'Backup',
    // t('public~Backups')
    labelPluralKey: 'public~backups',
    apiVersion: version,
    apiGroup: group,
    plural: 'backups',
    abbr: 'bu',
    namespaced: true,
    kind: 'Backup',
    id: 'backup',
    crd: true,
  };

  export const BackupRestoreModel: K8sModel = {
    label: 'BackupRestores',
    // t('public~Backup')
    labelKey: 'public~BackupRestores',
    labelPlural: 'BackupRestores',
    // t('public~Backups')
    labelPluralKey: 'public~backuprestores',
    apiVersion: version,
    apiGroup: group,
    plural: 'backuprestores',
    abbr: 'br',
    namespaced: true,
    kind: 'BackupRestore',
    id: 'backuprestore',
    crd: true,
  };

  export const SnapshotModel: K8sKind = {
    label: 'Snapshots',
    // t('public~Snapshots')
    labelKey: 'public~Snapshot',
    labelPlural: 'Snapshot',
    // t('public~Snapshots')
    labelPluralKey: 'public~snapshots',
    apiVersion: version,
    apiGroup: group,
    plural: 'snapshots',
    abbr: 'snaps',
    namespaced: true,
    kind: 'Snapshot',
    id: 'snapshot',
    crd: true,
  };

  export const NamespaceModel: K8sKind = {
    apiVersion: 'v1',
    label: 'Namespace',
    // t('public~Namespace')
    labelKey: 'public~Namespace',
    plural: 'namespaces',
    abbr: 'NS',
    kind: 'Namespace',
    id: 'namespace',
    labelPlural: 'Namespaces',
    // t('public~Namespaces')
    labelPluralKey: 'public~Namespaces',
  };