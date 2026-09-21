import { renderHook, fireEvent, act, waitFor } from '@testing-library/react';
import { useIsOnline } from './index';
import { getConnection, getConnectionEstimate } from './getConnection';

const setNavigator = (key: string, value: unknown) => {
  Object.defineProperty(window.navigator, key, { configurable: true, value });
};

const createConnection = () =>
  Object.assign(new EventTarget(), {
    downlink: 10,
    effectiveType: '4g',
    rtt: 50,
    saveData: false,
    type: 'wifi',
  });

describe('useIsOnline', () => {
  const originalFetch = global.fetch;
  beforeEach(() => {
    setNavigator('onLine', true);
    for (const key of ['connection', 'mozConnection', 'webkitConnection']) {
      setNavigator(key, undefined);
    }
    // A pending fetch must never delay connectivity subscriptions.
    global.fetch = jest.fn(() => new Promise<Response>(() => {}));
  });
  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('returns browser status immediately while the fallback probe is pending', async () => {
    const { result } = renderHook(() => useIsOnline());
    expect(result.current).toEqual({
      isOnline: true,
      isOffline: false,
      connection: null,
      error: null,
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('initializes offline and handles immediate online/offline transitions', () => {
    setNavigator('onLine', false);
    const { result } = renderHook(() => useIsOnline());
    expect(result.current.isOffline).toBe(true);
    setNavigator('onLine', true);
    fireEvent(window, new Event('online'));
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
    setNavigator('onLine', false);
    fireEvent(window, new Event('offline'));
    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(true);
  });

  it.each(['connection', 'mozConnection', 'webkitConnection'])(
    'reads and updates %s on the connection object',
    async (key) => {
      const conn = createConnection();
      setNavigator(key, conn);
      const { result } = renderHook(() => useIsOnline());
      await waitFor(() => expect(result.current.connection).not.toBeNull());
      expect(result.current.connection).toEqual({
        downlink: 10,
        effectiveType: '4g',
        rtt: 50,
        saveData: false,
        type: 'wifi',
      });
      conn.downlink = 1.5;
      conn.effectiveType = '3g';
      conn.saveData = true;
      await act(async () => {
        conn.dispatchEvent(new Event('change'));
      });
      expect(result.current.connection).toEqual(
        expect.objectContaining({
          downlink: 1.5,
          effectiveType: '3g',
          saveData: true,
        })
      );
      expect(await getConnection()).toEqual(result.current.connection);
      expect(global.fetch).not.toHaveBeenCalled();
    }
  );

  it('supports partial information without inventing measurements', async () => {
    setNavigator('connection', { saveData: true });
    const { result } = renderHook(() => useIsOnline());
    await waitFor(() => expect(result.current.connection).not.toBeNull());
    expect(result.current.connection).toEqual({
      downlink: undefined,
      effectiveType: undefined,
      rtt: undefined,
      saveData: true,
      type: undefined,
    });
  });

  it('removes the exact subscribed window and connection listeners', () => {
    const conn = createConnection();
    setNavigator('connection', conn);
    const addWindow = jest.spyOn(window, 'addEventListener');
    const removeWindow = jest.spyOn(window, 'removeEventListener');
    const addConnection = jest.spyOn(conn, 'addEventListener');
    const removeConnection = jest.spyOn(conn, 'removeEventListener');
    const { unmount } = renderHook(() => useIsOnline());
    unmount();
    for (const event of ['online', 'offline']) {
      const subscription = addWindow.mock.calls.find(
        ([type]) => type === event
      );
      expect(subscription).toBeDefined();
      expect(removeWindow).toHaveBeenCalledWith(event, subscription![1]);
    }
    expect(addConnection).toHaveBeenCalledWith('change', expect.any(Function));
    expect(removeConnection).toHaveBeenCalledWith(
      'change',
      addConnection.mock.calls[0][1]
    );
  });
  it.each([
    [100, '4g', 10],
    [500, '3g', 1.5],
    [1500, '2g', 0.25],
    [2500, 'slow-2g', 0.05],
  ])(
    'restores estimates for %sms probes',
    async (latency, effectiveType, downlink) => {
      global.fetch = jest.fn().mockResolvedValue({});
      jest
        .spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(latency as number);
      expect(await getConnectionEstimate()).toEqual({
        effectiveType,
        downlink,
        rtt: latency,
        saveData: false,
      });
    }
  );

  it('populates hook connection details using the fallback', async () => {
    let now = 0;
    jest.spyOn(performance, 'now').mockImplementation(() => now);
    global.fetch = jest.fn().mockImplementation(() => {
      now = 500;
      return Promise.resolve({});
    });
    const { result } = renderHook(() => useIsOnline());
    await waitFor(() =>
      expect(result.current.connection).toEqual({
        effectiveType: '3g',
        downlink: 1.5,
        rtt: 500,
        saveData: false,
      })
    );
  });

  it('preserves browser online status when a fallback probe fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useIsOnline());
    await waitFor(() =>
      expect(result.current.connection).toEqual({
        effectiveType: undefined,
        downlink: undefined,
        rtt: undefined,
        saveData: false,
      })
    );
    expect(result.current.isOnline).toBe(true);
  });

  it('ignores a fallback result after unmounting', async () => {
    let resolveProbe!: (response: Response) => void;
    global.fetch = jest.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveProbe = resolve;
        })
    );
    const { result, unmount } = renderHook(() => useIsOnline());
    unmount();
    await act(async () => {
      resolveProbe({} as Response);
    });
    expect(result.current.connection).toBeNull();
  });
});
