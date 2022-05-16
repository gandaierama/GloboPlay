import { render, screen } from '@testing-library/react';
import App from './App';

test('Navegação', () => {
  render(<App />);
  const linkElement = screen.getByText(/Busca/i);
  expect(linkElement).toBeInTheDocument();
});
