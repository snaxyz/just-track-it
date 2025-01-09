import { LucideProps } from "lucide-react";

type IconProps = Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>;

interface Props extends IconProps {
  Icon: React.ForwardRefExoticComponent<IconProps>;
}

export function SpinOnceIcon({ Icon, ...props }: Props) {
  return (
    <Icon
      className="hover:animate-spin-once transition-transform duration-300"
      {...props}
    />
  );
}
