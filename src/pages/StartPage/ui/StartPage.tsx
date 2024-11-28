import "./StartPage.scss";
import { useState, useEffect } from "react";
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

interface OntologyItem {
  label: string;
  description: string;
  uri: string;
}

const MainContent = () => {
  const [data, setData] = useState<OntologyItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayType, setDisplayType] = useState<
    "cards" | "text" | "diagram" | "table"
  >("cards");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OntologyItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 9;
  // Fetching data

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://markiz.ml0.ru/api/ontology");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);
  const totalItems = data.length;

  const handleItemClick = (item: OntologyItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="col-span-3 text-center text-blue-700">Loading...</div>
      );
    }

    if (error) {
      return (
        <div className="col-span-3 text-center text-red-600">
          Error: {error}
        </div>
      );
    }

    switch (displayType) {
      case "cards":
        return (
          <div className="grid grid-cols-3 gap-4">
            {currentItems.map((item) => (
              <Card
                key={item.uri}
                title={item.label}
                className="text-xl cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <p>{item.description}</p>
              </Card>
            ))}
          </div>
        );
      case "text":
        return (
          <div className="text-xl space-y-4">
            {currentItems.map((item) => (
              <div
                key={item.uri}
                onClick={() => handleItemClick(item)}
                className="cursor-pointer"
              >
                <h3 className="font-bold">{item.label}</h3>
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
          <table className="w-full border-collapse border border-gray-300 text-xl">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2 text-left">
                  Название
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Описание
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr
                  key={item.uri}
                  onClick={() => handleItemClick(item)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="border border-gray-300 p-2">{item.label}</td>
                  <td className="border border-gray-300 p-2">
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
      <h1></h1>
      <p className="descriptionArea"></p>
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
          total={totalItems}
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
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={1000}
      >
        <p>{selectedItem?.description}</p>
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
