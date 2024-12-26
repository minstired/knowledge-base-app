import { FC } from "react";
import { Menu, MenuItem } from "../../../shared/ui/menu";
import {
  FileAddOutlined,
  EyeOutlined,
  MessageOutlined,
  SearchOutlined,
  HistoryOutlined,
  FolderOpenOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

interface sideMenuProps {
  onTabChange: (tab: "create" | "view" | "qa") => void;
}

export const SideMenu: FC<sideMenuProps> = ({ onTabChange }) => {
  const sideMenuItems: MenuItem[] = [
    {
      key: "create",
      title: "Создание/Загрузка ПрО",
      icon: <FileAddOutlined />,
      isDisabled: false,
    },
    {
      key: "view",
      title: "Просмотр ПрО",
      icon: <EyeOutlined />,
      isDisabled: false,
    },
    {
      key: "qa",
      title: "Вопросы и ответы",
      icon: <MessageOutlined />,
      isDisabled: false,
    },
    {
      key: "search",
      title: "Поиск и подписки",
      icon: <SearchOutlined />,
      isDisabled: true,
    },
    {
      key: "suggestions",
      title: "События и предложения",
      icon: <HistoryOutlined />,
      isDisabled: true,
    },
    {
      key: "eventLog",
      title: "Журнал событий и сеансов",
      icon: <HistoryOutlined />,
      isDisabled: true,
    },
    {
      key: "library",
      title: "Библиотека материалов",
      icon: <FolderOpenOutlined />,
      isDisabled: true,
    },
    {
      key: "reports",
      title: "Отчеты и радары",
      icon: <BarChartOutlined />,
      isDisabled: true,
    },
  ];
  const handleMenuClick = (info: { key: React.Key }) => {
    if (info.key === "create" || info.key === "view" || info.key === "qa") {
      onTabChange(info.key as "create" | "view" | "qa");
    }
  };
  return (
    <Menu
      mode="inline"
      items={sideMenuItems}
      style={{
        width: "25vw",
        height: "100%",
        fontSize: "1.3rem",
      }}
      itemStyle={{
        height: "4rem",
      }}
      onClick={handleMenuClick}
    />
  );
};
