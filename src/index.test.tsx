import 'jsdom-global/register';
import React from 'react';
import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import { useIsOnline } from './index';
import { is } from '@babel/types';

const map: Record<any, any> = {};


beforeEach(() => {
  window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
  });
  window.removeEventListener = jest.fn(event => {
    map[event] = undefined;
  });
});


describe('useIsOnline in browser', () => {

  it('should return true when it is connected to the internet', () => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true
    });

    const Component = () => {
      const { isOnline } = useIsOnline();
      return (
        <div>
          {isOnline}
        </div>
      )
    }

    const wrapper = mount(<Component />);
    const errorText = wrapper.find('div');
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.unmount()
    expect(errorText.props().children).toBe(true)
    expect(window.addEventListener).toBeCalledTimes(2)
    expect(window.removeEventListener).toBeCalledTimes(2)
  })

  it('should return false when it is not connected to the internet', () => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true
    });

    const Component = () => {
      const { isOffline } = useIsOnline();
      return (
        <div>
          {isOffline}
        </div>
      )
    }

    const wrapper = mount(<Component />);
    const errorText = wrapper.find('div');
    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.unmount()
    expect(errorText.props().children).toBe(false)
    expect(window.addEventListener).toBeCalledTimes(2)
    expect(window.removeEventListener).toBeCalledTimes(2)
  })

  it('should update isOffline when it becomes disconnected from the internet', () => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true
    });

    const Component = () => {
      const { isOffline } = useIsOnline();
      return (
        <div>
          {isOffline}
        </div>
      )
    }

    const wrapper = mount(<Component />);
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false
    });
    wrapper.unmount()
    wrapper.mount()
    expect(wrapper.find('div').props().children).toBe(true)
  })

  it('should update isOnline when it becomes re-connected to the internet', () => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: false
    });

    const Component = () => {
      const { isOnline, isOffline } = useIsOnline();
      return (
        <div>
          {isOnline}
        </div>
      )
    }

    const wrapper = mount(<Component />);
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      value: true
    });
    wrapper.unmount()
    wrapper.mount()
    expect(wrapper.find('div').props().children).toBe(true)
  })


})


