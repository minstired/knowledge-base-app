import { useState } from "react";
import { Layout, Menu, Card, Pagination, Radio, Button } from "antd";
import {
  InfoCircleOutlined,
  SaveOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  FileAddOutlined,
  EyeOutlined,
  MessageOutlined,
  SearchOutlined,
  HistoryOutlined,
  FolderOpenOutlined,
  BarChartOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

// TopMenu Component
const TopMenu = () => (
  <Menu
    mode="horizontal"
    style={{
      lineHeight: "5rem",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingRight: "3%",
      fontSize: "1.3em",
      height: "5rem",
    }}
  >
    <Menu.Item
      key="about"
      icon={<InfoCircleOutlined style={{ fontSize: "1rem" }} />}
    >
      О программе
    </Menu.Item>
    <Menu.Item key="player">Запуск/Остановка/Сброс</Menu.Item>
    <Menu.Item key="save" icon={<SaveOutlined style={{ fontSize: "1rem" }} />}>
      Сохранение БЗ
    </Menu.Item>
    <Menu.Item
      key="settings"
      icon={<SettingOutlined style={{ fontSize: "1rem" }} />}
    >
      Настройки
    </Menu.Item>
    <Menu.Item
      key="help"
      icon={<QuestionCircleOutlined style={{ fontSize: "1rem" }} />}
    >
      Помощь
    </Menu.Item>
  </Menu>
);

// LeftMenu Component
const LeftMenu = () => (
  <Menu
    mode="inline"
    style={{
      minWidth: "25vw",
      width: "25vw",
      //   flex: "0 0 30vw",
      height: "100%",
      borderRight: 0,
      fontSize: "1.3rem",
      marginBlock: "0",
    }}
  >
    <Menu.Item
      style={{ paddingLeft: "24px", height: "4rem" }}
      key="create"
      icon={<FileAddOutlined style={{ fontSize: "1rem" }} />}
    >
      Создание/Загрузка ПрО
    </Menu.Item>
    <Menu.Item
      style={{ height: "4rem" }}
      key="view"
      icon={<EyeOutlined style={{ fontSize: "1.1rem" }} />}
    >
      Просмотр ПрО
    </Menu.Item>
    <Menu.Item
      style={{ height: "4rem" }}
      key="qa"
      icon={<MessageOutlined style={{ fontSize: "1rem" }} />}
    >
      Вопросы и ответы
    </Menu.Item>
    <Menu.Item
      style={{ height: "4rem" }}
      key="search"
      icon={<SearchOutlined style={{ fontSize: "1rem" }} />}
    >
      Поиск и подписки
    </Menu.Item>
    <Menu.Item
      style={{ height: "4rem" }}
      key="suggestions"
      icon={<HistoryOutlined style={{ fontSize: "1rem" }} />}
    >
      События и предложения
    </Menu.Item>
    <Menu.Item
      style={{ height: "4rem" }}
      key="eventlog"
      icon={<HistoryOutlined style={{ fontSize: "1rem" }} />}
    >
      Журнал событий и сеансов
    </Menu.Item>
    <Menu.Item
      style={{ height: "4rem" }}
      key="library"
      icon={<FolderOpenOutlined style={{ fontSize: "1rem" }} />}
    >
      Библиотека материалов
    </Menu.Item>
    <Menu.Item
      style={{ height: "4rem" }}
      key="reports"
      icon={<BarChartOutlined style={{ fontSize: "1rem" }} />}
    >
      Отчеты и радары
    </Menu.Item>
  </Menu>
);

// MainContent Component
// MainContent Component
const MainContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayType, setDisplayType] = useState("cards");

  // Static data for two pages
  const info = "";
  const staticData = [
    { id: 1, title: "Item 1", content: "Content for item 1" },
    { id: 2, title: "Item 2", content: "Content for item 2" },
    { id: 3, title: "Item 3", content: "Content for item 3" },
    { id: 4, title: "Item 4", content: "Content for item 4" },
    { id: 5, title: "Item 5", content: "Content for item 5" },
    { id: 6, title: "Item 6", content: "Content for item 6" },
    { id: 7, title: "Item 7", content: "Content for item 7" },
    { id: 8, title: "Item 8", content: "Content for item 8" },
    { id: 9, title: "Item 9", content: "Content for item 9" },
    { id: 10, title: "Item 10", content: "Content for item 10" },
    { id: 11, title: "Item 11", content: "Content for item 11" },
    { id: 12, title: "Item 12", content: "Content for item 12" },
    { id: 13, title: "Item 13", content: "Content for item 13" },
    { id: 14, title: "Item 14", content: "Content for item 14" },
    { id: 15, title: "Item 15", content: "Content for item 15" },
    { id: 16, title: "Item 16", content: "Content for item 16" },
    { id: 17, title: "Item 17", content: "Content for item 17" },
    { id: 18, title: "Item 18", content: "Content for item 18" },
  ];

  const renderContent = () => {
    const startIndex = (currentPage - 1) * 9;
    const pageData = staticData.slice(startIndex, startIndex + 9);

    switch (displayType) {
      case "cards":
        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
            }}
          >
            {pageData.map((item) => (
              <Card
                key={item.id}
                title={item.title}
                style={{ fontSize: "1.3rem" }}
              >
                <p>{item.content}</p>
              </Card>
            ))}
          </div>
        );
      case "text":
        return (
          <div style={{ fontSize: "1.3rem" }}>
            {pageData.map((item) => (
              <div key={item.id}>
                <h3>{item.title}</h3>
                <p>{item.content}</p>
              </div>
            ))}
          </div>
        );
      case "diagram":
        return (
          <div>
            <p>Diagram view is not implemented in this example.</p>
          </div>
        );
      case "table":
        return (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
              fontSize: "1.3rem",
            }}
          >
            <thead>
              <tr style={{ background: "#ddd" }}>
                <th>ID</th>
                <th>Title</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item) => (
                <tr key={item.id}>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {item.id}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {item.title}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {item.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderContent()}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Pagination
          current={currentPage}
          total={staticData.length}
          pageSize={9}
          onChange={setCurrentPage}
          showSizeChanger={false}
          itemRender={(page, type) => {
            if (type === "prev") return <Button icon={<LeftOutlined />} />;
            if (type === "next") return <Button icon={<RightOutlined />} />;
            return page;
          }}
        />
        <Radio.Group
          value={displayType}
          onChange={(e) => setDisplayType(e.target.value)}
        >
          <Radio.Button value="text">Text</Radio.Button>
          <Radio.Button value="diagram">Diagram</Radio.Button>
          <Radio.Button value="cards">Cards</Radio.Button>
          <Radio.Button value="table">Table</Radio.Button>
        </Radio.Group>
      </div>
    </div>
  );
};

// Main Component
export const StartPage = () => {
  return (
    <Layout style={{ minHeight: "100vh", minWidth: "95vw" }}>
      <Header style={{ background: "white", padding: 0, height: "100%" }}>
        <TopMenu />
      </Header>
      <Layout style={{ display: "flex", justifyContent: "space-between" }}>
        <Sider>
          <LeftMenu />
        </Sider>
        <Layout
          style={{
            justifySelf: "flex-end",
            // width: "60vw",
            // minWidth: "60vw",
            maxWidth: "70vw",
            // paddingLeft: "40vw",
            margin: "2.5vw",
            marginBottom: "0",
            marginTop: "1vw",
            background: "grey",
          }}
        >
          <Content
            style={{
              background: "#fff",
              padding: 24,
              margin: 0,
              minHeight: "60vh",
            }}
          >
            <MainContent />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
