import 'jsdom-global/register';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { useIsOnline } from './index';
import { is } from '@babel/types';

const map: Record<any, any> = {};

beforeEach(() => {
  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });
  window.removeEventListener = jest.fn((event) => {
    map[event] = undefined;
  });
});

describe('useIsOnline in browser', () => {
  it('should return true when it is connected to the internet', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });

    const Component = () => {
      const { isOnline } = useIsOnline();
      return <div>{isOnline}</div>;
    };

    const wrapper = mount(<Component />);
    const errorText = wrapper.find('div');
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.unmount();
    expect(errorText.props().children).toBe(true);
    expect(window.addEventListener).toBeCalledTimes(2);
    expect(window.removeEventListener).toBeCalledTimes(2);
  });

  it('should return false when it is not connected to the internet', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });

    const Component = () => {
      const { isOffline } = useIsOnline();
      return <div>{isOffline}</div>;
    };

    const wrapper = mount(<Component />);
    const errorText = wrapper.find('div');
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.unmount();
    expect(errorText.props().children).toBe(false);
    expect(window.addEventListener).toBeCalledTimes(2);
    expect(window.removeEventListener).toBeCalledTimes(2);
  });

  it('should update isOffline when it becomes disconnected from the internet', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });

    const Component = () => {
      const { isOffline } = useIsOnline();
      return <div>{isOffline}</div>;
    };

    const wrapper = mount(<Component />);
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    });
    wrapper.unmount();
    wrapper.mount();
    expect(wrapper.find('div').props().children).toBe(true);
  });

  it('should update isOnline when it becomes re-connected to the internet', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: false,
    });

    const Component = () => {
      const { isOnline, isOffline } = useIsOnline();
      return <div>{isOnline}</div>;
    };

    const wrapper = mount(<Component />);
    Object.defineProperty(window.navigator, 'onLine', {
      configurable: true,
      value: true,
    });
    wrapper.unmount();
    wrapper.mount();
    expect(wrapper.find('div').props().children).toBe(true);
  });

  it('should return null connection when connection API is not supported', () => {
    Object.defineProperty(window.navigator, 'connection', {
      configurable: true,
      value: null,
    });
    Object.defineProperty(window.navigator, 'mozConnection', {
      configurable: true,
      value: null,
    });
    Object.defineProperty(window.navigator, 'webkitConnection', {
      configurable: true,
      value: null,
    });

    const Component = () => {
      const { connection } = useIsOnline();
      return <div>{connection === null ? 'null' : 'not null'}</div>;
    };

    const wrapper = mount(<Component />);
    expect(wrapper.find('div').text()).toBe('null');
    wrapper.unmount();
  });

  it('should return connection details when connection API is supported', () => {
    const mockConnection = {
      downlink: 10,
      effectiveType: '4g',
      rtt: 50,
      saveData: false,
      type: 'wifi',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    Object.defineProperty(window.navigator, 'connection', {
      configurable: true,
      value: mockConnection,
    });

    const Component = () => {
      const { connection } = useIsOnline();
      return (
        <div>
          {connection
            ? `${connection.effectiveType}-${connection.downlink}-${connection.type}`
            : 'null'}
        </div>
      );
    };

    const wrapper = mount(<Component />);
    expect(wrapper.find('div').text()).toBe('4g-10-wifi');
    wrapper.unmount();
  });

  it('should update connection details when change event is fired', () => {
    const connectionEventMap: Record<string, any> = {};
    const mockConnection = {
      downlink: 10,
      effectiveType: '4g',
      rtt: 50,
      saveData: false,
      type: 'wifi',
      addEventListener: jest.fn((event, cb) => {
        connectionEventMap[event] = cb;
      }),
      removeEventListener: jest.fn((event) => {
        connectionEventMap[event] = undefined;
      }),
    };
    Object.defineProperty(window.navigator, 'connection', {
      configurable: true,
      value: mockConnection,
    });

    const Component = () => {
      const { connection } = useIsOnline();
      return (
        <div>
          {connection
            ? `${connection.effectiveType}-${connection.downlink}`
            : 'null'}
        </div>
      );
    };

    const wrapper = mount(<Component />);
    expect(wrapper.find('div').text()).toBe('4g-10');

    // Simulate change in connection speed/type
    mockConnection.effectiveType = '3g';
    mockConnection.downlink = 1.5;

    // Trigger the change event listener
    if (connectionEventMap['change']) {
      act(() => {
        connectionEventMap['change']();
      });
    }

    wrapper.update();
    expect(wrapper.find('div').text()).toBe('3g-1.5');

    wrapper.unmount();
    expect(mockConnection.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });
});
