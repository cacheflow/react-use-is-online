/** @jest-environment node */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { useIsOnline, IsOnlineValues } from './index';
import { getConnection } from './getConnection';

it('renders on the server without accessing browser globals', async () => {
  let snapshot: IsOnlineValues | undefined;
  const Component = () => {
    snapshot = useIsOnline();
    return <span>Connectivity</span>;
  };
  expect(renderToString(<Component />)).toBe('<span>Connectivity</span>');
  expect(snapshot).toEqual({
    error: expect.stringContaining('only works in a browser environment'),
    isOnline: false,
    isOffline: false,
    connection: null,
  });
  expect(await getConnection()).toBeNull();
});
