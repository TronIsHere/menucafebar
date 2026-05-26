interface Props {
  tableNumber: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export default function TableCartLabel({ tableNumber, className, style }: Props) {
  if (!tableNumber) return null;

  return (
    <p className={className} style={{ margin: 0, ...style }}>
      شما در میز {tableNumber} هستید
    </p>
  );
}
