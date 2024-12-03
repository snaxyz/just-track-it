interface Props {
  children: React.ReactNode;
}

export function FabContainer({ children }: Props) {
  return <div className="fixed bottom-4 right-6 z-30">{children}</div>;
}
