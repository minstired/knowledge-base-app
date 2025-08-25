import { useState, useEffect, useRef } from "react";
import {
  Card,
  Pagination,
  Radio,
  Button,
  Modal,
  message,
  Input,
  Table,
  Tag,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Column, Pie } from "@antv/g2plot";

const { TextArea } = Input;

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

interface DocumentItem {
  label: string;
  URI: string;
  linkedRelations: [];
}

interface WebPage {
  URI: string;
  label: string;
  typeURI: string;
  linkedRelations: any[];
  status: "included" | "excluded";
}

interface MainContentProps {
  activeTab: "create" | "view" | "qa" | "search" | "reports" | "library";
}

export const MainContent: React.FC<MainContentProps> = ({ activeTab }) => {
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
  const [qaText, setQaText] = useState("");
  const barChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);
  const barChartInstanceRef = useRef<Column | null>(null);
  const pieChartInstanceRef = useRef<Pie | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [webPages, setWebPages] = useState<WebPage[]>([]);

  const itemsPerPage = 9;

  // Hooks

  useEffect(() => {
    fetchOntologies();
  }, []);

  useEffect(() => {
    if (selectedOntology && activeTab === "view") {
      fetchOntologyObjects(selectedOntology.uri);
      setFacts([]);
      setSelectedObject(null);
    }
  }, [selectedOntology, activeTab]);

  useEffect(() => {
    if (activeTab === "reports") {
      fetchChartData();
    }
    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }
    };
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "library" && selectedOntology) {
      fetchDocuments(selectedOntology.uri);
    }
  }, [activeTab, selectedOntology]);

  useEffect(() => {
    if (activeTab === "search" && selectedOntology) {
      fetchWebPages(selectedOntology.uri); ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    }
  }, [activeTab, selectedOntology]);

  // fetch functions

  const fetchOntologies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://markiz.ml0.ru/api/ontology");
      const data = await response.json();
      setOntologies(data.ontologies || []);
    } catch (error) {
      setError("Не удалось извлечь онтологии из БД");
      console.error("Ошибка: ", error);
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
      setError("Не удалось извлечь объекты онтологии из БД");
      console.error("Ошибка: ", error);
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
        fetchOntologyObjects(newOntology.uri);
      }
    } catch (error) {
      console.error("Ошибка при создании онтологии:", error);
      message.error("Произошла ошибка при создании онтологии");
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = (item: OntologyItem | OntologyObject) => {
    if (activeTab === "create") {
      setSelectedOntology(item as OntologyItem);
      message.success(
        'Вы выбрали онтологию! Посмотрите данные во вкладке "Просмотр ПрО"',
        3,
      );
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

  const handleQaSubmit = async () => {
    if (!qaText.trim()) {
      message.warning("Пожалуйста, введите текст перед отправкой");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch("https://markiz.ml0.ru/api/question", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          text: qaText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Текст успешно отправлен");
        console.log("Response:", data);
        setQaText("");
      } else {
        throw new Error(data.detail || "Failed to submit text");
      }
    } catch (error) {
      console.error("Error submitting QA text:", error);
      message.error("Произошла ошибка при отправке текста");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearQaText = () => {
    setQaText("");
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch("https://markiz.ml0.ru/api/statistics");
      const data = await response.json();

      // Bar chart
      if (barChartRef.current) {
        barChartInstanceRef.current = new Column(barChartRef.current, {
          data: Object.entries(data.bar_chart).map(([year, count]) => ({
            year,
            count,
          })),
          xField: "year",
          yField: "count",
          label: {
            position: "middle",
            style: {
              fill: "#FFFFFF",
              opacity: 0.6,
            },
          },
          xAxis: {
            label: {
              autoHide: true,
              autoRotate: false,
            },
          },
          meta: {
            year: {
              alias: "Год",
            },
            count: {
              alias: "Количество документов",
            },
          },
        });
        barChartInstanceRef.current.render();
      }

      // Pie chart
      if (pieChartRef.current) {
        pieChartInstanceRef.current = new Pie(pieChartRef.current, {
          data: Object.entries(data.pie_chart).map(([theme, value]) => ({
            theme,
            value,
          })),
          angleField: "value",
          colorField: "theme",
          radius: 0.8,
          label: {
            type: "outer",
            content: "{name} {percentage}",
          },
          interactions: [
            { type: "pie-legend-active" },
            { type: "element-active" },
          ],
        });
        pieChartInstanceRef.current.render();
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const renderQaContent = () => {
    return (
      <div>
        <h1
          style={{ fontSize: "24px", fontWeight: "600", paddingBottom: "3%" }}
        >
          Вопросы и ответы
        </h1>
        <TextArea
          value={qaText}
          onChange={(e) => setQaText(e.target.value)}
          placeholder="Введите ваш текст здесь..."
          autoSize={{ minRows: 6, maxRows: 12 }}
          className="text-lg"
        />
        <div
          style={{ paddingTop: "1.5%", display: "flex", gap: "1%" }}
          className="flex gap-4"
        >
          <Button
            type="primary"
            onClick={handleQaSubmit}
            loading={isLoading}
            size="large"
            className="bg-blue-500"
          >
            Отправить
          </Button>
          <Button onClick={handleClearQaText} size="large">
            Очистить
          </Button>
        </div>
      </div>
    );
  };

  const renderReportsContent = () => {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold">Отчеты и радары</h1>
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Количество документов по годам
          </h2>
          <div ref={barChartRef} style={{ height: "400px" }}></div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Количество документов по онтологиям
          </h2>
          <div ref={pieChartRef} style={{ height: "400px" }}></div>
        </div>
      </div>
    );
  };

  const fetchDocuments = async (ontologyUri: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://markiz.ml0.ru/api/documents/search/${encodeURIComponent(ontologyUri)}`,
      );
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
      message.error("Не удалось получить список документов");
    } finally {
      setIsLoading(false);
    }
  };

  const findDocumentsOnline = async () => {
    if (!selectedOntology) {
      message.warning("Сначала выберите онтологию");
      return;
    }
    try {
      setIsLoading(true);
      await fetch(
        `https://markiz.ml0.ru/api/documents/search/${encodeURIComponent(selectedOntology.uri)}`,
        {
          method: "POST",
        },
      );
      await fetchDocuments(selectedOntology.uri);
      message.success("Поиск документов завершён");
    } catch {
      message.error("Ошибка при поиске документов");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWebPages = async (ontologyUri: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://markiz.ml0.ru/api/web-page/search/${encodeURIComponent(ontologyUri)}`,
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWebPages(data.web_pages || []);
    } catch (err) {
      console.error("Error fetching web pages:", err);
      message.error("Не удалось получить список веб-страниц");
    } finally {
      setIsLoading(false);
    }
  };

  const findWebPagesOnline = async () => {
    if (!selectedOntology) {
      message.warning("Сначала выберите онтологию");
      return;
    }
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://markiz.ml0.ru/api/web-page/search/${encodeURIComponent(selectedOntology.uri)}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Ошибка при поиске веб-страниц");
      }

      const data = await response.json();
      setWebPages(data.web_pages || []);
      message.success("Поиск веб-страниц завершён");
    } catch (error) {
      console.error("Error searching web pages:", error);
      message.error(
        error instanceof Error
          ? error.message
          : "Ошибка при поиске веб-страниц",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addWebPageToTrainingSet = async (webPageUri: string) => {
    try {
      const response = await fetch(
        `https://markiz.ml0.ru/api/web-page/${encodeURIComponent(webPageUri)}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        throw new Error("Ошибка при добавлении веб-страницы");
      }

      const data = await response.json();
      if (data.result) {
        message.success("Веб-страница добавлена в обучающую выборку");
        // Обновляем список веб-страниц после добавления
        if (selectedOntology) {
          await fetchWebPages(selectedOntology.uri);
        }
      } else {
        message.error("Не удалось добавить веб-страницу в обучающую выборку");
      }
    } catch (error) {
      console.error("Error adding web page to training set:", error);
      message.error("Ошибка при добавлении веб-страницы");
    }
  };

  const addToTrainingSet = async (documentUri: string) => {
    try {
      await fetch(
        `https://markiz.ml0.ru/api/documents/${encodeURIComponent(documentUri)}`,
        {
          method: "POST",
        },
      );
      message.success("Документ добавлен в обучающую выборку");
    } catch {
      message.error("Ошибка при добавлении документа");
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="col-span-3 text-center text-blue-700">
          Загрузка данных. Пожалуйста, подождите
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-3 text-center text-red-600">
          Ошибка: {error}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {currentItems.map((item) => (
              <Card
                key={item.uri}
                title={item.label}
                hoverable
                style={{
                  minHeight: "180px",
                }}
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
            <p>Пока что нельзя посмотреть данные в виде Диаграмм</p>
          </div>
        );
      case "table":
        const tableData = currentItems.map((item) => ({
          key: item.uri,
          uri: item.uri,
          label: item.label,
          description: item.description,
          original: item,
        }));

        const columns = [
          {
            title: "Название",
            dataIndex: "label",
            key: "label",
            render: (text: string) => (
              <span className="font-medium">{text}</span>
            ),
          },
          {
            title: "Описание",
            dataIndex: "description",
            key: "description",
          },
        ];

        return (
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            rowClassName={(record) =>
              (activeTab === "create"
                ? selectedOntology?.uri
                : selectedObject?.uri) === record.uri
                ? "bg-green-100"
                : ""
            }
            onRow={(record) => ({
              onClick: () => handleItemClick(record.original),
              style: { cursor: "pointer" },
            })}
            rowKey="key"
            className="rounded-xl shadow-md"
            bordered
          />
        );
      default:
        return null;
    }
  };

  let content;
  if (activeTab === "qa") {
    content = renderQaContent();
  } else if (activeTab === "reports") {
    content = renderReportsContent();
  } else if (activeTab === "library") {
    content = (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            gap: "5%",
            paddingBottom: "3%",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>
            Библиотека материалов
          </h2>
          <Button
            type="primary"
            onClick={findDocumentsOnline}
            style={{
              textAlign: "center",
              padding: "1.1rem 1.1rem",
              borderRadius: "10px",
              fontWeight: "500",
              marginTop: "1%",
            }}
          >
            Найти документы в интернете
          </Button>
        </div>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {documents.map((doc) => (
              <Card title={doc.label} style={{ minHeight: "180px" }}>
                <p>URI: {doc.URI}</p>
                <Button type="link" onClick={() => addToTrainingSet(doc.URI)}>
                  Добавить в обучающую выборку
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  } else if (activeTab === "search") {
    content = (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "24px",
            gap: "5%",
            paddingBottom: "3%",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "600" }}>
            Поиск веб-страниц
          </h2>

          <Button
            type="primary"
            onClick={findWebPagesOnline}
            // loading = {isLoading}
            style={{
              textAlign: "center",
              padding: "1.1rem 1.1rem",
              borderRadius: "10px",
              fontWeight: "500",
              marginTop: "1%",
            }}
          >
            Найти веб-страницы в интернете
          </Button>
        </div>

        {!selectedOntology && (
          <p className="text-center text-gray-600 text-base">
            Для начала выберите онтологию в разделе "Создание/Загрузка ПрО".
          </p>
        )}

        {selectedOntology && (
          <>
            <p style={{ marginBottom: "20px", fontSize: "16px" }}>
              Выбранная онтология: <strong>{selectedOntology.label}</strong>
            </p>

            {webPages.length > 0 && (
              <div style={{ marginBottom: "32px" }}>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "16px",
                  }}
                >
                  Веб-страницы ({webPages.length})
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {webPages.map((webPage) => (
                    <Card
                      key={webPage.URI}
                      title={webPage.label}
                      style={{ minHeight: "180px" }}
                      extra={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <Tag
                            color={
                              webPage.status === "included" ? "green" : "orange"
                            }
                          >
                            {webPage.status === "included"
                              ? "Включено"
                              : "Исключено"}
                          </Tag>
                        </div>
                      }
                    >
                      <p style={{ color: "#666", fontSize: "14px" }}>
                        URI: {webPage.URI}
                      </p>
                      {/* <p style={{ color: "#666", fontSize: "14px" }}>
                        Тип: ...
                      </p> */}

                      {webPage.status !== "included" && (
                        <Button
                          type="link"
                          size="small"
                          onClick={() => addWebPageToTrainingSet(webPage.URI)}
                        >
                          Добавить в обучающую выборку
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  } else {
    content = (
      <div style={{ maxHeight: "100%" }}>
        {/* header - Заголовок (и кнопка для Создания) */}
        <div
          style={{
            display: "flex",
            justifyContent: "justify-between",
            alignItems: "center",
            gap: "5%",
            paddingBottom: "3%",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: 600 }}>
            {activeTab === "create"
              ? "Создание/Загрузка ПрО"
              : selectedOntology?.label || "Просмотр ПрО"}
          </span>

          {activeTab === "create" && (
            <Button
              type="primary"
              style={{
                textAlign: "center",
                padding: "1.1rem 1.1rem",
                borderRadius: "10px",
                fontWeight: "500",
                marginTop: "1%",
              }}
              onClick={handleCreateOntology}
            >
              Создать онто-модель
            </Button>
          )}
        </div>

        {/* Сообщения при загрузке / отсутствии онтологии */}

        {activeTab === "view" && !selectedOntology && (
          <p className="text-center text-gray-600 text-base">
            Для начала выберите онтологию.
          </p>
        )}

        {activeTab === "view" && selectedOntology && isLoading && (
          <div className="text-center text-gray-600 text-base">
            Онтология еще не загружена полностью.
          </div>
        )}

        {/* Описание + контент */}

        {activeTab === "view" && selectedOntology && !isLoading && (
          <div>
            <p style={{ marginBottom: "5%" }}>
              Описание онтологии: {selectedOntology.description}
            </p>
            {renderContent()}
          </div>
        )}
        {activeTab === "create" && renderContent()}

        {/* Пагинация и Radio — в одну строку */}

        {(activeTab === "create" ||
          (activeTab === "view" && selectedOntology && !isLoading)) && (
          <div
            style={{
              display: "flex",
              justifyContent: "justify-between",
              alignItems: "center",
              gap: "5%",
              marginTop: "3%",
            }}
          >
            <div className="pagination-wrapper">
              <Pagination
                current={currentPage}
                total={
                  activeTab === "create" ? ontologies.length : objects.length
                }
                pageSize={itemsPerPage}
                onChange={setCurrentPage}
                showSizeChanger={false}
                itemRender={(page, type) => {
                  if (type === "prev")
                    return <Button icon={<LeftOutlined />} />;
                  if (type === "next")
                    return <Button icon={<RightOutlined />} />;
                  return page;
                }}
              />
            </div>
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
      </div>
    );
  }

  return (
    <div style={{}}>
      <div
        style={{
          padding: "24px 32px",
        }}
      >
        {content}
      </div>
      <Modal
        title={selectedObject ? selectedObject.label : selectedOntology?.label}
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        width={800}
        style={{
          margin: "1vw 2vw 0vw 10vw",
          //   width: "70vw",
        }}
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
              <p>У этого объекта нет доступных фактов.</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
