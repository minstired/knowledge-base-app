import { FC } from "react";
import { Menu as AntMenu, MenuProps } from "antd";

export interface MenuItem {
  key: React.Key;
  icon?: React.ReactNode;
  readonly style?: React.CSSProperties;
  onClick?: (info: { key: React.Key }) => void;
  isDisabled?: boolean;
  title: string;
}

interface MenuShared {
  readonly mode: "horizontal" | "inline";
  readonly style?: React.CSSProperties;
  readonly items: MenuItem[];
  readonly itemStyle?: React.CSSProperties;
  onClick?: (info: { key: React.Key }) => void;
  // readonly onSelect?: (key: string) => void;
}

export const Menu: FC<MenuShared> = ({
  mode,
  style,
  items,
  itemStyle,
  onClick,
  // onSelect,
}) => {
  const menuItems: MenuProps["items"] = items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.title,
    style: itemStyle,
    onClick: item.onClick,
    disabled: item.isDisabled,
  }));
  return (
    <AntMenu
      mode={mode}
      style={style}
      items={menuItems}
      onClick={onClick}
      // onSelect={({ key }) => onSelect?.(key)}
    />
  );
};
