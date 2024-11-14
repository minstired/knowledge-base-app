import { FC } from "react";
import { Menu as AntMenu } from "antd";
import { MenuProps } from "antd";

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  readonly style?: React.CSSProperties;
  title: string;
}

interface MenuShared {
  readonly mode: "horizontal" | "inline";
  readonly style?: React.CSSProperties;
  readonly items: MenuItem[];
  readonly itemStyle?: React.CSSProperties;
}

export const Menu: FC<MenuShared> = ({ mode, style, items, itemStyle }) => {
  const menuItems: MenuProps["items"] = items.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.title,
    style: itemStyle,
  }));
  return <AntMenu mode={mode} style={style} items={menuItems} />;
};
