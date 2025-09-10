import React from 'react'
import {Card, CardContent, Typography} from '@mui/material'

const InfoBox = ({title, cases, total}) => {
  return (
    <Card className='infoBox'>
      <CardContent>
        {/* title */}
        <Typography className='infoBox__title' color='textSecondary'>
            {title}
        </Typography>
        {/* No of cases */}

        <h2 className='infoBox__cases'>{cases}</h2>
        {/* total */}

         <Typography className='infoBox__total' color='textSecondary'>
            {total} Total
        </Typography>
      </CardContent>
    </Card>
  )
}

export default InfoBox
