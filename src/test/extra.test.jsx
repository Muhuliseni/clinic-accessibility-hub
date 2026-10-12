import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'

const openForm = async u => { await u.click(screen.getAllByRole('button', { name: /^Book /i })[0]) }
const submit = u => u.click(screen.getByRole('button', { name: /confirm appointment/i }))

describe('directory', () => {
  test('search narrows results and announces the count', async () => {
    const u = userEvent.setup(); render(<App />)
    await u.type(screen.getByLabelText(/search by name/i), 'nurse')
    expect(screen.getByRole('status')).toHaveTextContent('2 services shown')
  })
  test('no matches shows a helpful message and a count of 0', async () => {
    const u = userEvent.setup(); render(<App />)
    await u.type(screen.getByLabelText(/search by name/i), 'zzz')
    expect(screen.getByRole('status')).toHaveTextContent('0 services shown')
    expect(screen.getByText(/no services match/i)).toBeInTheDocument()
  })
  test('clear filters resets aria-pressed and is disabled when nothing is active', async () => {
    const u = userEvent.setup(); render(<App />)
    await u.click(screen.getByRole('button', { name: /triage level/i }))
    const clear = screen.getByRole('button', { name: /clear filters/i })
    expect(clear).toBeDisabled()
    const routine = screen.getByRole('button', { name: 'Routine' })
    await u.click(routine); expect(routine).toHaveAttribute('aria-pressed', 'true')
    await u.click(clear); expect(routine).toHaveAttribute('aria-pressed', 'false')
  })
  test('availability refresh sets aria-busy, announces, and keeps focus', async () => {
    const u = userEvent.setup(); render(<App />)
    const btn = screen.getByRole('button', { name: /refresh availability/i })
    const list = screen.getByRole('list', { name: 'Services' })
    expect(list).toHaveAttribute('aria-busy', 'false')
    await u.click(btn)
    expect(list).toHaveAttribute('aria-busy', 'true')
    expect(btn).toHaveAttribute('aria-disabled', 'true')
    expect(btn).toHaveFocus()
    expect(screen.getByText('Updating availability...')).toBeInTheDocument()
    await waitFor(() => expect(list).toHaveAttribute('aria-busy', 'false'), { timeout: 3000 })
    expect(screen.getByText(/availability updated/i)).toBeInTheDocument()
    expect(screen.getByText(/2 slots left today/i)).toBeInTheDocument()
  })
})

describe('booking form validation (negative paths)', () => {
  test('invalid email gives a fix suggestion and aria-invalid on blur', async () => {
    const u = userEvent.setup(); render(<App />); await openForm(u)
    const email = screen.getByLabelText('Email')
    await u.type(email, 'not-an-email'); await u.tab()
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/enter an email like name@example.com/i)).toBeInTheDocument()
  })
  test('weekend and past dates are rejected with specific messages', async () => {
    const u = userEvent.setup(); render(<App />); await openForm(u)
    const date = screen.getByLabelText('Preferred date')
    await u.type(date, '2030-01-05'); await u.tab()
    expect(screen.getByText(/open on weekdays/i)).toBeInTheDocument()
    await u.clear(date); await u.type(date, '2020-01-06'); await u.tab()
    expect(screen.getByText(/today or a future date/i)).toBeInTheDocument()
  })
  test('an error clears live as soon as the value becomes valid', async () => {
    const u = userEvent.setup(); render(<App />); await openForm(u); await submit(u)
    const name = screen.getByLabelText('Full name')
    expect(name).toHaveAttribute('aria-invalid', 'true')
    await u.type(name, 'Amara Nkosi')
    expect(name).toHaveAttribute('aria-invalid', 'false')
    expect(name).toHaveAccessibleDescription('As it appears on your health card.')
  })
})

describe('navigation and focus', () => {
  test('nav marks the current page with aria-current', async () => {
    const u = userEvent.setup(); render(<App />)
    expect(screen.getByRole('button', { name: 'Find a service' })).toHaveAttribute('aria-current', 'page')
    await u.click(screen.getByRole('button', { name: 'Book an appointment' }))
    expect(screen.getByRole('button', { name: 'Book an appointment' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus()
  })
  test('Shift+Tab from the first modal button wraps to the last (no escape, no trap on Esc)', async () => {
    const u = userEvent.setup(); render(<App />); await openForm(u)
    await u.type(screen.getByLabelText('Full name'), 'Amara Nkosi')
    await u.type(screen.getByLabelText('Email'), 'a@b.co')
    await u.type(screen.getByLabelText('Preferred date'), '2030-01-08')
    await submit(u)
    expect(screen.getByRole('button', { name: /back to services/i })).toHaveFocus()
    await u.tab({ shift: true })
    expect(screen.getByRole('button', { name: /^close$/i })).toHaveFocus()
  })
})
