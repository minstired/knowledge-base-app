import { Menu, MenuItem } from "../../../shared/ui/menu";
import {
  InfoCircleOutlined,
  SaveOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const headerMenuItems: MenuItem[] = [
  {
    key: "about",
    title: "О программе",
    icon: <InfoCircleOutlined />,
  },
  {
    key: "player",
    title: "Запуск/Остановка/Сброс",
  },
  {
    key: "save",
    title: "Сохранение БЗ",
    icon: <SaveOutlined />,
  },
  {
    key: "settings",
    title: "Настройки",
    icon: <SettingOutlined />,
  },
  {
    key: "help",
    title: "Помощь",
    icon: <QuestionCircleOutlined />,
  },
];

export const HeaderMenu = () => {
  return (
    <Menu
      mode="horizontal"
      items={headerMenuItems}
      style={{
        justifyContent: "flex-end",
        paddingRight: "3%",
        fontSize: "1.3em",
      }}
      itemStyle={{
        height: "4.5rem",
      }}
    />
  );
};
