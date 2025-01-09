interface Props {
  children: React.ReactNode;
}

export function CenterContainer({ children }: Props) {
  return <div className="grid place-items-center h-full">{children}</div>;
}
