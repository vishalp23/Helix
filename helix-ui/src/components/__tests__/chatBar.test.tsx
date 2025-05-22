import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChatBar from '../chatBar'; // Corrected import path
import { ChatMessage } from '../chatBar'; // Corrected import path for ChatMessage if it's exported

// Mock the onSend function
const mockOnSend = jest.fn();

// Mock scrollIntoView
const mockScrollIntoView = jest.fn();
beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = mockScrollIntoView;
});

afterAll(() => {
  // Restore original scrollIntoView if necessary, or clear mock
  // For this case, clearing the mock is sufficient if no other tests rely on it.
  // If it were a global mock setup (e.g. in jest.setup.js), restoration would be more critical.
  mockScrollIntoView.mockClear(); 
  // Or if you had stored the original: delete HTMLElement.prototype.scrollIntoView;
});

const sampleMessages: ChatMessage[] = [
  { sender: 'User', text: 'Hello there!' },
  { sender: 'Helix', text: 'Hi! How can I help you today?' },
  { sender: 'User', text: 'Just testing the chat.' },
  { sender: 'Helix', text: 'Test received!' },
];

const theme = createTheme({ palette: { mode: 'light' } }); // Using a default theme for snapshot

describe('ChatBar Component', () => {
  it('renders correctly with messages', () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <ChatBar messages={sampleMessages} onSend={mockOnSend} />
      </ThemeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders correctly with no messages', () => {
    const { asFragment } = render(
      <ThemeProvider theme={theme}>
        <ChatBar messages={[]} onSend={mockOnSend} />
      </ThemeProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
