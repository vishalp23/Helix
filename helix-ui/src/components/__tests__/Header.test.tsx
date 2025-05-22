import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from '../Header';

// Mock the onToggleTheme function
const mockOnToggleTheme = jest.fn();

const lightTheme = createTheme({ palette: { mode: 'light' } });
const darkTheme = createTheme({ palette: { mode: 'dark' } });

describe('Header Component', () => {
  it('renders correctly in light mode', () => {
    const { asFragment } = render(
      <ThemeProvider theme={lightTheme}>
        <Header onToggleTheme={mockOnToggleTheme} isDarkMode={false} />
      </ThemeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly in dark mode', () => {
    const { asFragment } = render(
      <ThemeProvider theme={darkTheme}>
        <Header onToggleTheme={mockOnToggleTheme} isDarkMode={true} />
      </ThemeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
