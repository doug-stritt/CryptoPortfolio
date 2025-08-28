# Testing Documentation

This document provides comprehensive information about the testing setup and test coverage for the CryptoPortfolio application.

## Overview

The project uses Jest as the primary testing framework with React Testing Library for component testing. The test suite covers:

- **Unit Tests**: Individual functions, selectors, and utilities
- **Integration Tests**: API interactions and data flow
- **Component Tests**: React Native component rendering and interactions
- **Type Tests**: TypeScript interface validation

## Test Structure

```
src/
├── __tests__/                    # Integration tests
│   └── integration.test.ts
├── components/
│   └── __tests__/               # Component tests
│       └── CryptoAssetItem.test.tsx
├── services/
│   └── __tests__/               # API service tests
│       ├── api.test.ts
│       └── usePortfolioData.test.ts
├── store/
│   └── __tests__/               # Store and selector tests
│       ├── portfolioStore.test.ts
│       └── selectors.test.ts
└── types/
    └── __tests__/               # Type definition tests
        └── types.test.ts
```

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Files
```bash
npm test -- --testPathPattern=portfolioStore
npm test -- --testPathPattern=selectors
npm test -- --testPathPattern=api
```

## Test Coverage

The test suite aims for 80% coverage across:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Current Coverage Areas

#### Store Tests (`src/store/__tests__/`)
- **portfolioStore.test.ts**: Tests Zustand store state management
  - Initial state validation
  - Synchronous actions (setHoldings, setPrices, etc.)
  - Asynchronous actions (fetchHoldings, fetchPrices, fetchPortfolioData)
  - Error handling and edge cases

- **selectors.test.ts**: Tests computed selectors
  - Basic selectors (useHoldings, usePrices, etc.)
  - Computed selectors (usePortfolioData, useComputedCryptoAssets)
  - Edge cases (missing data, zero values, large numbers)

#### API Tests (`src/services/__tests__/`)
- **api.test.ts**: Tests API service functions
  - HTTP request handling
  - Error responses and network failures
  - Data transformation and validation
  - Portfolio service integration

- **usePortfolioData.test.ts**: Tests custom hook
  - Hook state management
  - Data flow and updates
  - Error state handling

#### Component Tests (`src/components/__tests__/`)
- **CryptoAssetItem.test.tsx**: Tests React Native component
  - Rendering with different data scenarios
  - Currency formatting
  - Profit/loss calculations
  - Edge cases and error states

#### Type Tests (`src/types/__tests__/`)
- **types.test.ts**: Tests TypeScript interfaces
  - Interface validation
  - Type compatibility
  - Edge cases and boundary conditions

#### Integration Tests (`src/__tests__/`)
- **integration.test.ts**: Tests complete application flow
  - End-to-end data flow from API to UI
  - Store and selector integration
  - Error handling across layers
  - Data consistency validation

## Mocking Strategy

### API Mocking
- **fetch**: Globally mocked to simulate HTTP requests
- **API Services**: Mocked using Jest to isolate unit tests
- **Error Scenarios**: Network failures, API errors, and malformed responses

### Store Mocking
- **Zustand Store**: Mocked for selector tests to provide controlled state
- **State Updates**: Simulated to test reactive behavior

### Component Mocking
- **React Native**: Platform-specific modules mocked
- **Navigation**: React Navigation mocked for component isolation

## Test Data

### Mock Data Files
- `src/mockData/mockHoldings.json`: Sample portfolio holdings
- `src/mockData/mockPrices.json`: Sample market prices

### Test Scenarios
- **Happy Path**: Successful API calls and data processing
- **Error Cases**: Network failures, API errors, malformed data
- **Edge Cases**: Zero values, very large numbers, missing data
- **Boundary Conditions**: Empty arrays, null values, undefined data

## Best Practices

### Test Organization
1. **Describe blocks**: Group related tests logically
2. **Clear test names**: Use descriptive test names that explain the scenario
3. **Setup and teardown**: Use `beforeEach` and `afterEach` for test isolation
4. **Mock cleanup**: Clear mocks between tests to prevent interference

### Assertions
1. **Specific assertions**: Test exact values rather than just truthiness
2. **Edge cases**: Include tests for boundary conditions
3. **Error scenarios**: Test both success and failure paths
4. **Async testing**: Use proper async/await patterns for asynchronous code

### Code Coverage
1. **Critical paths**: Ensure all business logic is covered
2. **Error handling**: Test error scenarios and edge cases
3. **Integration points**: Test data flow between components
4. **Type safety**: Validate TypeScript interfaces and types

## Debugging Tests

### Common Issues
1. **Mock not working**: Ensure mocks are properly set up and cleaned up
2. **Async timing**: Use `waitFor` for asynchronous operations
3. **State isolation**: Reset store state between tests
4. **Type errors**: Ensure test data matches TypeScript interfaces

### Debug Commands
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debugging
npm test -- --testNamePattern="should handle API errors"

# Run tests with coverage and watch
npm run test:coverage -- --watch
```

## Continuous Integration

The test suite is designed to run in CI/CD pipelines:
- **Fast execution**: Tests run quickly for rapid feedback
- **Deterministic**: Tests produce consistent results
- **Isolated**: Tests don't depend on external services
- **Comprehensive**: Covers all critical application paths

## Future Improvements

1. **E2E Testing**: Add end-to-end tests using Detox
2. **Performance Testing**: Add performance benchmarks
3. **Visual Regression**: Add visual regression testing
4. **Accessibility Testing**: Add accessibility test coverage
5. **Load Testing**: Add API load testing scenarios

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve coverage thresholds
4. Update this documentation if needed
5. Add integration tests for new data flows
