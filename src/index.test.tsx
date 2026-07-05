import { renderHook, waitFor, fireEvent } from '@testing-library/react';
import { useIsOnline } from './index';

if (!global.fetch) {
  global.fetch = (() => Promise.resolve({} as Response)) as any;
}

describe('useIsOnline in browser', () => {
  let mockFetch: jest.SpyInstance;
  let mockPerformanceNow: jest.SpyInstance;

  const setOnLine = (onLine: boolean) => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: onLine,
    });
  };

  const setConnection = (connection: any) => {
    Object.defineProperty(window.navigator, 'connection', {
      configurable: true,
      value: connection,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setOnLine(true);
    setConnection(undefined);

    // Mock fetch to simulate getConnectionEstimate calls
    mockFetch = jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.resolve({
        status: 204,
        ok: true,
      } as Response)
    );

    // Mock performance.now to simulate deterministic latency
    let perfTime = 1000;
    mockPerformanceNow = jest
      .spyOn(performance, 'now')
      .mockImplementation(() => {
        const current = perfTime;
        perfTime += 100; // default 100ms diff
        return current;
      });
  });

  afterEach(() => {
    mockFetch.mockRestore();
    mockPerformanceNow.mockRestore();
  });

  it('should return true when it is connected to the internet', async () => {
    setOnLine(true);
    const { result } = renderHook(() => useIsOnline());
    await waitFor(() => {
      expect(result.current.connection).not.toBeNull();
    });
    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });

  it('should return false when it is not connected to the internet', async () => {
    setOnLine(false);
    const { result } = renderHook(() => useIsOnline());
    await waitFor(() => {
      expect(result.current.connection).not.toBeNull();
    });
    expect(result.current.isOffline).toBe(true);
    expect(result.current.isOnline).toBe(false);
  });

  it('should update isOffline when it becomes disconnected from the internet', async () => {
    setOnLine(true);
    const { result } = renderHook(() => useIsOnline());

    await waitFor(() => {
      expect(result.current.connection).not.toBeNull();
    });

    expect(result.current.isOffline).toBe(false);

    setOnLine(false);

    fireEvent(window, new Event('offline'));
    
    expect(result.current.isOnline).toBe(false);
  });

  it('should update isOnline when it becomes re-connected to the internet', async () => {
    setOnLine(false);
    const { result } = renderHook(() => useIsOnline());

    await waitFor(() => {
      expect(result.current.connection).not.toBeNull();
    });

    expect(result.current.isOnline).toBe(false);

    setOnLine(true);

    fireEvent(window, new Event('online'));

    expect(result.current.isOnline).toBe(true);
    expect(result.current.isOffline).toBe(false);
  });

  it('should register and clean up window event listeners', async () => {
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount, result } = renderHook(() => useIsOnline());

    await waitFor(() => {
      expect(result.current.connection).not.toBeNull();
    });

    expect(addSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(addSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('should return connection details when connection API is supported', async () => {
    const mockConnection = new EventTarget() as any;
    mockConnection.downlink = 10;
    mockConnection.effectiveType = '4g';
    mockConnection.rtt = 50;
    mockConnection.saveData = false;
    mockConnection.type = 'wifi';

    setConnection(mockConnection);

    const { result } = renderHook(() => useIsOnline());

    await waitFor(() => {
      expect(result.current.connection).toEqual(
        expect.objectContaining({
          effectiveType: '4g',
          downlink: 10,
          type: 'wifi',
        })
      );
    });
  });

  it('should update connection details when change event is fired', async () => {
    const mockConnection = new EventTarget() as any;
    mockConnection.downlink = 10;
    mockConnection.effectiveType = '4g';
    mockConnection.rtt = 50;
    mockConnection.saveData = false;
    mockConnection.type = 'wifi';

    setConnection(mockConnection);

    const { result } = renderHook(() => useIsOnline());

    await waitFor(() => {
      expect(result.current.connection?.effectiveType).toBe('4g');
    });

    mockConnection.effectiveType = '4g';
    mockConnection.downlink = 10;

    fireEvent(window, new Event('change'));

    await waitFor(() => {
      expect(result.current.connection?.effectiveType).toBe('4g');
      expect(result.current.connection?.downlink).toBe(10);
    });
  });

  it('should return fallback connection estimate when connection API is not supported', async () => {
    setConnection(undefined);

    const { result } = renderHook(() => useIsOnline());

    await waitFor(() => {
      expect(result.current.connection).toEqual(
        expect.objectContaining({
          effectiveType: '4g',
          downlink: 10,
        })
      );
    });
  });

  it('should return offline connection estimate when fetch fails', async () => {
    setConnection(undefined);
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useIsOnline());

    await waitFor(() => {
      expect(result.current.connection).toEqual(
        expect.objectContaining({
          effectiveType: undefined,
          rtt: undefined,
          downlink: undefined,
        })
      );
    });
  });

  it('should classify connection based on latency correctly', async () => {
    setConnection(undefined);

    // Test slow-2g classification: RTT > 2000
    let perfTime = 1000;
    mockPerformanceNow.mockImplementation(() => {
      const current = perfTime;
      perfTime += 2500;
      return current;
    });

    const { result } = renderHook(() => useIsOnline());

    await waitFor(() => {
      expect(result.current.connection).toEqual(
        expect.objectContaining({
          effectiveType: 'slow-2g',
          downlink: 0.05,
        })
      );
    });
  });
});

describe('useIsOnline in non-browser environment', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should default states when window is missing', () => {
    jest.mock('./getConnection', () => ({
      missingWindow: true,
      getConnection: jest.fn(),
    }));

    const { useIsOnline: useIsOnlineMock } = require('./index');
    const { result } = renderHook(() => useIsOnlineMock());

    expect(result.current.error).toContain(
      'only works in a browser environment'
    );
    expect(result.current.isOnline).toBe(false);
    expect(result.current.isOffline).toBe(false);
    expect(result.current.connection).toBeNull();
  });
});
