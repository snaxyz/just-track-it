import { Button, ButtonProps } from "@nextui-org/react";

interface Props extends Omit<ButtonProps, "isIconOnly" | "radius"> {}

export function IconButton(props: Props) {
  const { children, variant = "light", size = "md", ...restProps } = props;
  return (
    <Button
      {...restProps}
      isIconOnly
      radius="full"
      variant={variant}
      size={size}
    >
      {children}
    </Button>
  );
}
