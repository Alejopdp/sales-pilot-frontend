import React from 'react'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material'
import {Paper as MuiPaper} from "@mui/material"

const Paper = (props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined }) => {
    const {palette} = useTheme()

  return (
    <MuiPaper elevation={2} style={{padding: 48, backgroundColor: palette.background.paper, margin: 32}}>
        {props.children}
    </MuiPaper>
  )
}

export default Paper