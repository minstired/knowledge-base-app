import { FC } from "react";
import { Menu, MenuItem } from "../../../shared/ui/menu";
import {
  FileAddOutlined,
  EyeOutlined,
  MessageOutlined,
  SearchOutlined,
//  HistoryOutlined,
  FolderOpenOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

interface sideMenuProps {
  onTabChange: (tab: "create" | "view" | "qa" | "search" | "reports" | "library") => void;
}

export const SideMenu: FC<sideMenuProps> = ({ onTabChange }) => {
  const sideMenuItems: MenuItem[] = [
    {
      key: "create",
      title: "Прикладные онтологии",
      icon: <FileAddOutlined />,
      isDisabled: false,
    },
    {
      key: "view",
      title: "Просмотр онтомодели",
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
      key: "library",
      title: "Поиск в библиотеке",
      icon: <FolderOpenOutlined />,
      isDisabled: false,
    },
    {
      key: "search",
      title: "Поиск в интернете",
      icon: <SearchOutlined />,
      isDisabled: false,
    },
//    {
//      key: "suggestions",
//      title: "События и предложения",
//      icon: <HistoryOutlined />,
//      isDisabled: true,
//    },
//    {
//     key: "eventLog",
//      title: "Журнал событий и сеансов",
//      icon: <HistoryOutlined />,
//      isDisabled: true,
//    },
    {
      key: "reports",
      title: "Статистика",
      icon: <BarChartOutlined />,
      isDisabled: false,
    },
  ];
  const handleMenuClick = (info: { key: React.Key }) => {
    if (
      info.key === "create" ||
      info.key === "view" ||
      info.key === "qa" ||
      info.key === "search" ||
      info.key === "reports" ||
      info.key === "library"
    ) {
      onTabChange(info.key as "create" | "view" | "qa" | "search" | "reports" | "library");
    }
  };
  return (
    <Menu
      mode="inline"
      items={sideMenuItems}
      style={{
        // width: "22vw",
        height: "100%",
        fontSize: "1.3em",
      }}
      itemStyle={{
        height: "4rem",
      }}
      onClick={handleMenuClick}
    />
  );
};
