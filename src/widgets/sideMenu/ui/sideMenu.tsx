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

const sideMenuItems: MenuItem[] = [
  {
    key: "create",
    title: "Создание/Загрузка ПрО",
    icon: <FileAddOutlined />,
  },
  {
    key: "view",
    title: "Просмотр ПрО",
    icon: <EyeOutlined />,
  },
  {
    key: "qa",
    title: "Вопросы и ответы",
    icon: <MessageOutlined />,
  },
  {
    key: "search",
    title: "Поиск и подписки",
    icon: <SearchOutlined />,
  },
  {
    key: "suggestions",
    title: "События и предложения",
    icon: <HistoryOutlined />,
  },
  {
    key: "eventLog",
    title: "Журнал событий и сеансов",
    icon: <HistoryOutlined />,
  },
  {
    key: "library",
    title: "Библиотека материалов",
    icon: <FolderOpenOutlined />,
  },
  {
    key: "reports",
    title: "Отчеты и радары",
    icon: <BarChartOutlined />,
  },
];

export const SideMenu = () => {
  return (
    <Menu
      mode="inline"
      items={sideMenuItems}
      style={{
        // minWidth: "25vw",
        width: "25vw",
        height: "100%",
        // borderRight: 0,
        fontSize: "1.3rem",
        // marginBlock: "0",
      }}
      itemStyle={{
        height: "4rem",
      }}
    />
  );
};
