import { test } from 'vitest'
import { render } from '@testing-library/react'
import '../../i18n';
import Landing from '../pages/Landing';
import { BrowserRouter } from 'react-router-dom';

test('Checks if landing page renders correctly', () => {
    render(
        <BrowserRouter>
            <Landing />
        </BrowserRouter>)
})