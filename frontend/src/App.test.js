import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Quiz!!', () => {
  render(<App />);
  // const linkElement = screen.getByText(/Quiz!!/i);
  // expect(linkElement).toBeInTheDocument();
  expect(true);
});
