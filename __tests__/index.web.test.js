import 'react-native';
import React from 'react';
import Index from '../app/web/index';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
    const tree = renderer.create(<Index />);
});

it('It should be run in the test env', () => {
    expect(process.env.NODE_ENV).toBe('test');
});
