import { test, vi } from 'vitest'
import { render } from '@testing-library/react'
import '../../i18n';
import Landing from '../pages/Landing';
import { BrowserRouter } from 'react-router-dom';

// Mocks firebase auth
vi.mock("../config/authConfig", () => ({
  useAuth: () => ({ user: null, logout: vi.fn() }),
}));

test('Checks if landing page renders correctly', () => {
    render(
        <BrowserRouter>
            <Landing />
        </BrowserRouter>)
})