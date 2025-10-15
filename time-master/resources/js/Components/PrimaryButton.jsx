import { Button } from '@/Components/Button';

export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <Button
            {...props}
            className={
                ` ${className}`
            }
            disabled={disabled}
        >
            {children}
        </Button>
    );
}
