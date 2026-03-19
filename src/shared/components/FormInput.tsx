import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

type FormInputProps = TextFieldProps & { label: string };

export default function FormInput({ label, ...props }: FormInputProps) {
  return <TextField label={label} fullWidth variant="outlined" {...props} />;
}
