import { useContext } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { MdDeleteSweep } from 'react-icons/md'
import { observer } from 'mobx-react-lite'

import { storeContext } from '../../../storeContext.js'
import { input, deleteFilterIcon } from './Filter.module.css'

export const Filter = observer(() => {
  const store = useContext(storeContext)
  const { docFilter, setDocFilter } = store
  const onChange = (e) => setDocFilter(e.target.value)
  const onClickEmptyFilter = () => setDocFilter('')

  return (
    <FormControl
      fullWidth
      variant="standard"
    >
      <InputLabel htmlFor="filterInput">filtern</InputLabel>
      <Input
        id="filterInput"
        value={docFilter}
        onChange={onChange}
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        endAdornment={
          docFilter ?
            <InputAdornment
              position="end"
              onClick={onClickEmptyFilter}
              title="Filter entfernen"
            >
              <MdDeleteSweep className={deleteFilterIcon} />
            </InputAdornment>
          : null
        }
        className={input}
      />
    </FormControl>
  )
})
