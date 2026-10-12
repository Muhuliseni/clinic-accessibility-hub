import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import App from '../App.jsx'

test('directory has no axe violations', async () => {
  const { container } = render(<App />)
  expect((await axe(container)).violations).toEqual([])
})

test('filter accordion and toggles update ARIA state and live count', async () => {
  const u = userEvent.setup(); render(<App />)
  const acc = screen.getByRole('button', { name: /triage level/i })
  expect(acc).toHaveAttribute('aria-expanded', 'false')
  await u.click(acc); expect(acc).toHaveAttribute('aria-expanded', 'true')
  const urgent = screen.getByRole('button', { name: 'Urgent' })
  await u.click(urgent)
  expect(urgent).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByRole('status')).toHaveTextContent('2 services shown, filtered by Urgent')
})

test('booking form: errors linked, announced, focused; passes axe', async () => {
  const u = userEvent.setup(); const { container } = render(<App />)
  await u.click(screen.getAllByRole('button', { name: /^Book /i })[0])
  expect(screen.getByRole('heading', { level: 1 })).toHaveFocus()
  await u.click(screen.getByRole('button', { name: /confirm appointment/i }))
  const name = screen.getByLabelText('Full name')
  expect(name).toHaveAttribute('aria-invalid', 'true')
  expect(name).toHaveAccessibleDescription(/health card.*Enter your full name/s)
  expect(name).toHaveFocus()
  expect(screen.getByRole('alert')).toHaveTextContent('3 problems found')
  expect((await axe(container)).violations).toEqual([])
})

test('modal moves focus in, contains Tab, closes on Escape and restores focus', async () => {
  const u = userEvent.setup(); render(<App />)
  await u.click(screen.getAllByRole('button', { name: /^Book /i })[0])
  await u.type(screen.getByLabelText('Full name'), 'Amara Nkosi')
  await u.type(screen.getByLabelText('Email'), 'a@b.co')
  await u.type(screen.getByLabelText('Preferred date'), '2030-01-08')
  const confirm = screen.getByRole('button', { name: /confirm appointment/i })
  await u.click(confirm)
  const dlg = screen.getByRole('dialog')
  expect(within(dlg).getByRole('button', { name: /back to services/i })).toHaveFocus()
  await u.tab(); await u.tab()
  expect(dlg).toContainElement(document.activeElement)
  await u.keyboard('{Escape}')
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(confirm).toHaveFocus()
})
