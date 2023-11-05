import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

type BackButtonProps = {
    goBack: () => void
    actualRoute: string
}

const BackButton = ({ goBack, actualRoute }: BackButtonProps) => {
    return (
        <Button
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
            style={{ fontSize: 18, marginBottom: 16, color: '#000', backgroundColor: 'transparent' }}
        >
            {actualRoute}
        </Button>
    )
}

export default BackButton
