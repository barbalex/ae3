import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import { MdDeleteSweep } from 'react-icons/md'
import { useAtom } from 'jotai'

import { docFilterAtom } from '../../../jotaiStore/index.ts'
import styles from './Filter.module.css'

export const Filter = () => {
  const [docFilter, setDocFilter] = useAtom(docFilterAtom)
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
              <MdDeleteSweep className={styles.deleteFilterIcon} />
            </InputAdornment>
          : null
        }
        className={styles.input}
      />
    </FormControl>
  )
}
