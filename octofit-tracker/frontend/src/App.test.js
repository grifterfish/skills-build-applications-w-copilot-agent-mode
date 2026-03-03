import { render, screen } from '@testing-library/react';
import App from './App';

test('renders octofit overview heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/your octofit overview/i);
  expect(headingElement).toBeInTheDocument();
});
