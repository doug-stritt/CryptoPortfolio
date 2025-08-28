// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
  StyleSheet: {
    create: jest.fn((styles) => styles),
  },
  View: ({ children, ...props }) => {
    const React = require('react');
    return React.createElement('View', props, children);
  },
  Text: ({ children, ...props }) => {
    const React = require('react');
    return React.createElement('Text', props, children);
  },
  TouchableOpacity: ({ children, ...props }) => {
    const React = require('react');
    return React.createElement('TouchableOpacity', props, children);
  },
  ScrollView: ({ children, ...props }) => {
    const React = require('react');
    return React.createElement('ScrollView', props, children);
  },
  FlatList: ({ data, renderItem, ...props }) => {
    const React = require('react');
    return React.createElement('FlatList', { ...props, data, renderItem });
  },
}));

// Mock Expo modules
jest.mock('expo', () => ({}));

// Mock React for Zustand
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useCallback: jest.fn((fn) => fn),
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
