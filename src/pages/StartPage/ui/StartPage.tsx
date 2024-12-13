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
  message,
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

interface OntologyObject {
  label: string;
  description: string;
  uri: string;
}

interface ObjectFact {
  label: string;
  description: string;
  uri: string;
}

interface MainContentProps {
  activeTab: "create" | "view";
}

const MainContent: React.FC<MainContentProps> = ({ activeTab }) => {
  const [ontologies, setOntologies] = useState<OntologyItem[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [displayType, setDisplayType] = useState<
    "cards" | "text" | "diagram" | "table"
  >("cards");
  const [modalVisible, setModalVisible] = useState(false);
  const [objects, setObjects] = useState<OntologyObject[]>([]);
  const [facts, setFacts] = useState<ObjectFact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOntology, setSelectedOntology] = useState<OntologyItem | null>(
    null,
  );
  const [selectedObject, setSelectedObject] = useState<OntologyObject | null>(
    null,
  );

  const itemsPerPage = 9;

  useEffect(() => {
    fetchOntologies();
  }, []);

  useEffect(() => {
    if (selectedOntology && activeTab === "view") {
      fetchOntologyObjects(selectedOntology.uri);
    }
  }, [selectedOntology, activeTab]);

  const fetchOntologies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://markiz.ml0.ru/api/ontology");
      const data = await response.json();
      setOntologies(data.ontologies || []);
    } catch (error) {
      setError("Failed to fetch ontologies");
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOntologyObjects = async (ontologyUri: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://markiz.ml0.ru/api/ontology/objects/?ontology_uri=${encodeURIComponent(ontologyUri)}`,
      );
      const data = await response.json();
      setObjects(data.objects || []);
    } catch (error) {
      setError("Failed to fetch ontology objects");
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOntology = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://markiz.ml0.ru/api/ontology/create-model/?ontology_uri=${encodeURIComponent("http://www.kg.ru/new-hyper-ontology")}`,
        { method: "POST" },
      );
      const result = await response.json();
      if (result.result) {
        message.success("Онтология успешно создана");
        const newOntology = {
          label: "Новая онтология",
          description: "Новое описание",
          uri: "http://www.kg.ru/new-hyper-ontology",
        };
        setSelectedOntology(newOntology);
        // setActiveTab("view");
        fetchOntologyObjects(newOntology.uri);
      }
    } catch (error) {
      console.error("Error creating ontology:", error);
      message.error("Произошла ошибка при создании онтологии");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item: OntologyItem | OntologyObject) => {
    if (activeTab === "create") {
      setSelectedOntology(item as OntologyItem);
      const updatedOntologies = [
        item as OntologyItem,
        ...ontologies.filter((ontology) => ontology.uri !== item.uri),
      ];
      setOntologies(updatedOntologies);
    } else if (activeTab === "view") {
      setSelectedObject(item as OntologyObject);
      fetchObjectFacts(item.uri);
    }
  };

  const fetchObjectFacts = async (objectUri: string) => {
    try {
      const response = await fetch(
        `https://markiz.ml0.ru/api/ontology/facts/?object_uri=${encodeURIComponent(objectUri)}`,
      );
      const result = await response.json();
      setFacts(result.facts || []);
      setModalVisible(true);
      const selectedObj = objects.find((obj) => obj.uri === objectUri);
      if (selectedObj) {
        setSelectedObject(selectedObj);
      }
    } catch (error) {
      console.error("Error fetching object facts:", error);
      message.error("Не удалось загрузить факты");
    } finally {
      setIsLoading(false);
    }
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

    const items = activeTab === "create" ? ontologies : objects;
    const currentItems = items.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );

    switch (displayType) {
      case "cards":
        return (
          <div className="grid grid-cols-3 gap-4">
            {currentItems.map((item) => (
              <Card
                key={item.uri}
                title={item.label}
                className={`text-xl cursor-pointer ${
                  (activeTab === "create"
                    ? selectedOntology?.uri
                    : selectedObject?.uri) === item.uri
                    ? "bg-green-100"
                    : ""
                }`}
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
                  className={`cursor-pointer hover:bg-gray-100 ${
                    (activeTab === "create"
                      ? selectedOntology?.uri
                      : selectedObject?.uri) === item.uri
                      ? "bg-green-100"
                      : ""
                  }`}
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
      <div className="flex justify-between items-center mb-4">
        {selectedOntology && activeTab === "create" && (
          <div className="mb-4 text-green-600">
            Вы выбрали онтологию! Посмотрите данные во вкладке "Просмотр ПрО"
          </div>
        )}
        <h1>
          {activeTab === "create"
            ? "Создание/Загрузка ПрО"
            : selectedOntology
              ? selectedOntology.label
              : "Просмотр ПрО"}
        </h1>
        {activeTab === "create" && (
          <Button
            type="primary"
            className="bg-green-500 hover:bg-green-600"
            onClick={handleCreateOntology}
          >
            Создать онто-модель
          </Button>
        )}
      </div>
      {activeTab === "view" && !selectedOntology && (
        <div className="text-center text-xl">
          Для начала выберите онтологию.
        </div>
      )}
      {activeTab === "view" && selectedOntology && isLoading && (
        <div className="text-center text-xl">
          Онтология еще не загружена полностью.
        </div>
      )}
      {activeTab === "view" && selectedOntology && !isLoading && (
        <div>
          <p className="mb-4">{selectedOntology.description}</p>
          {renderContent()}
        </div>
      )}
      {activeTab === "create" && renderContent()}
      {(activeTab === "create" ||
        (activeTab === "view" && selectedOntology && !isLoading)) && (
        <div className="mt-6 flex justify-between items-center">
          <Pagination
            current={currentPage}
            total={activeTab === "create" ? ontologies.length : objects.length}
            pageSize={itemsPerPage}
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
            className="space-x-2"
          >
            <Radio.Button value="cards">Cards</Radio.Button>
            <Radio.Button value="text">Text</Radio.Button>
            <Radio.Button value="table">Table</Radio.Button>
          </Radio.Group>
        </div>
      )}
      <Modal
        title={selectedObject ? selectedObject.label : selectedOntology?.label}
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        {selectedObject && (
          <div>
            <p>
              <strong>Онтология:</strong> {selectedOntology?.label}
            </p>
            <p>
              <strong>Описание:</strong> {selectedOntology?.description}
            </p>
            <p>
              <strong>Объект:</strong> {selectedObject.label}
            </p>
            <p>
              <strong>Описание объекта:</strong> {selectedObject.description}
            </p>
            <h3>Факты:</h3>
            {facts.length > 0 ? (
              <ul>
                {facts.map((fact) => (
                  <li key={fact.uri}>
                    <p>{fact.label}</p>
                    <p className="text-gray-600">{fact.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No facts available for this object.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

// Main Component
export const StartPage = () => {
  const [activeTab, setActiveTab] = useState<"create" | "view">("create");

  const handleTabChange = (tab: "create" | "view") => {
    setActiveTab(tab);
  };
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
            <SideMenu onTabChange={handleTabChange} />
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
              <MainContent activeTab={activeTab} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
