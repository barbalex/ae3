// renders the MUI components the app uses most.
// Guards against silent breakage of the styled engine, e.g. when
// optional-looking @emotion peer dependencies go missing: the vite
// build succeeds but the app crashes at runtime
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Checkbox from '@mui/material/Checkbox'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'

describe('mui smoke', () => {
  it('renders the MUI components the app uses most', () => {
    render(
      <>
        <Button variant="contained">klick mich</Button>
        <IconButton>icon</IconButton>
        <Card>
          <CardActions>card actions</CardActions>
        </Card>
        <FormControl>
          <InputLabel id="sel-label">Auswahl</InputLabel>
          <Select labelId="sel-label" value={1} onChange={() => {}}>
            <MenuItem value={1}>eins</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Textfeld" defaultValue="inhalt" />
        <Checkbox defaultChecked />
        <Tabs value={0}>
          <Tab label="Tab eins" />
          <Tab label="Tab zwei" />
        </Tabs>
        <Collapse in>collapse inhalt</Collapse>
        <Snackbar open message="snackbar text" />
      </>,
    )
    expect(screen.getByText('klick mich')).toBeTruthy()
    expect(screen.getByText('card actions')).toBeTruthy()
    expect(screen.getByText('eins')).toBeTruthy()
    expect(screen.getByLabelText('Textfeld')).toBeTruthy()
    expect(screen.getByText('Tab zwei')).toBeTruthy()
    expect(screen.getByText('collapse inhalt')).toBeTruthy()
    expect(screen.getByText('snackbar text')).toBeTruthy()
  })
})
