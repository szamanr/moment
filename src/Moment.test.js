import React from 'react';
import { render } from '@testing-library/react';
import Moment from './Moment';

test('renders learn react link', () => {
  const { getByText } = render(<Moment />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
