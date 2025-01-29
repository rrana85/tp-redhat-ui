import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ExamplePage } from '../components/ExamplePage'

export const DynamicPage1 = () => {
  const { t } = useTranslation('plugin__console-demo-plugin');
  return <ExamplePage title={t('Welcome to NetApp Trident Protect')}/>;
};
