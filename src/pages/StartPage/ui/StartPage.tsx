import "./StartPage.scss";
import { useState } from "react";
import {
  Layout,
  Card,
  Pagination,
  Radio,
  Button,
  ConfigProvider,
  Modal,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { HeaderMenu } from "../../../widgets/headerMenu";
import { SideMenu } from "../../../widgets/sideMenu";

const { Header, Sider, Content } = Layout;

interface DataItem {
  id: number;
  label: string;
  uri: string;
  factsNum: number;
  description: string;
  additionalInfo: string;
}

const MainContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayType, setDisplayType] = useState<
    "cards" | "text" | "diagram" | "table"
  >("cards");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);

  // Static data for two pages
  const ontologyName = "Lorem";
  const ontologyDescription =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.v";
  const staticData: DataItem[] = [
    {
      id: 1,
      label: "Организации",
      uri: "https://example.com/item1",
      factsNum: 245,
      description: "Последний поиск: 14.11.15",
      additionalInfo: "Additional info for item 1",
    },
    {
      id: 2,
      label: "Персоналии",
      uri: "https://example.com/item1",
      factsNum: 37,
      description: "Последний поиск: 14.11.15",
      additionalInfo: "Additional info for item 2",
    },
    {
      id: 3,
      label: "Проекты",
      uri: "https://example.com/item1",
      factsNum: 17,
      description: "Последний поиск: 14.11.15",
      additionalInfo: "Additional info for item 3",
    },
    {
      id: 4,
      label: "Изделия",
      uri: "https://example.com/item1",
      factsNum: 14,
      description: "Последний поиск: 14.11.15",
      additionalInfo: "Additional info for item 4",
    },
    {
      id: 5,
      label: "Применения",
      uri: "https://example.com/item1",
      factsNum: 46,
      description: "Последний поиск: 14.11.15",
      additionalInfo: "Additional info for item 5",
    },
    {
      id: 6,
      label: "Результаты",
      uri: "https://example.com/item1",
      factsNum: 7,
      description: "Последний поиск: 14.11.15",
      additionalInfo: "Additional info for item 6",
    },
    {
      id: 7,
      label: "Item 1",
      uri: "https://example.com/item1",
      factsNum: 10,
      description: "This is item 1",
      additionalInfo: "Additional info for item 1",
    },
    {
      id: 8,
      label: "Item 1",
      uri: "https://example.com/item1",
      factsNum: 10,
      description: "This is item 1",
      additionalInfo: "Additional info for item 1",
    },
    {
      id: 9,
      label: "Item 1",
      uri: "https://example.com/item1",
      factsNum: 10,
      description: "This is item 1",
      additionalInfo: "Additional info for item 1",
    },
    {
      id: 10,
      label: "Item 1",
      uri: "https://example.com/item1",
      factsNum: 10,
      description: "This is item 1",
      additionalInfo: "Additional info for item 1",
    },
    {
      id: 11,
      label: "Item 1",
      uri: "https://example.com/item1",
      factsNum: 10,
      description: "This is item 1",
      additionalInfo: "Additional info for item 1",
    },
    {
      id: 12,
      label: "Item 1",
      uri: "https://example.com/item1",
      factsNum: 10,
      description: "This is item 1",
      additionalInfo: "Additional info for item 1",
    },
  ];

  const handleItemClick = (item: DataItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

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
                title={item.label}
                style={{ fontSize: "1.3rem", cursor: "pointer" }}
                onClick={() => handleItemClick(item)}
              >
                <p>{`(${item.factsNum})`}</p>
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        );
      case "text":
        return (
          <div style={{ fontSize: "1.3rem" }}>
            {pageData.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                style={{ cursor: "pointer" }}
              >
                <h3>{item.label}</h3>
                <p>{`(${item.factsNum})`}</p>
                <p>{item.description}</p>
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
                <th>Название</th>
                <th>Кол-во фактов</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  style={{ cursor: "pointer" }}
                >
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
                    {item.label}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {item.factsNum}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {item.description}
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
      <h1>{ontologyName}</h1>
      <p className="descriptionArea">{ontologyDescription}</p>
      {renderContent()}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          height: "4rem", //change that
        }}
      >
        <Pagination
          current={currentPage}
          total={staticData.length}
          pageSize={9}
          size="default"
          onChange={setCurrentPage}
          showSizeChanger={false}
          itemRender={(page, type) => {
            if (type === "prev")
              return (
                <Button
                  style={{ width: 38, height: 38 }}
                  icon={<LeftOutlined style={{ fontSize: 16 }} />}
                />
              );
            if (type === "next")
              return (
                <Button
                  style={{ width: 38, height: 38 }}
                  icon={<RightOutlined style={{ fontSize: 16 }} />}
                />
              );
            return page;
          }}
        />
        <Radio.Group
          value={displayType}
          size="large"
          onChange={(e) => setDisplayType(e.target.value)}
        >
          <Radio.Button value="text">Text</Radio.Button>
          <Radio.Button value="diagram">Diagram</Radio.Button>
          <Radio.Button value="cards">Cards</Radio.Button>
          <Radio.Button value="table">Table</Radio.Button>
        </Radio.Group>
      </div>
      <Modal
        title={selectedItem?.label}
        visible={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={1000}
      >
        <p>{selectedItem?.description}</p>
        <p>{selectedItem?.additionalInfo}</p>
      </Modal>
    </div>
  );
};

// Main Component
export const StartPage = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Pagination: {
            itemSize: 38,
            fontSize: 16,
          },
          Menu: {
            iconSize: 17,
          },
          Card: {
            headerFontSize: 23,
            headerBg: "#EDEDED",
          },
        },
        token: {
          // fontFamily: "Montserrat",
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", minWidth: "95vw" }}>
        <Header style={{ background: "white", padding: 0, height: "100%" }}>
          <HeaderMenu />
        </Header>
        <Layout style={{ display: "flex", justifyContent: "space-between" }}>
          <Sider>
            <SideMenu />
          </Sider>
          <Layout
            style={{
              justifySelf: "flex-end",
              maxWidth: "70vw",
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
    </ConfigProvider>
  );
};
