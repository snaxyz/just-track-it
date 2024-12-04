interface Props {
  children: React.ReactNode;
}

export function Title({ children }: Props) {
  return <div className="text-xl mb-3">{children}</div>;
}
