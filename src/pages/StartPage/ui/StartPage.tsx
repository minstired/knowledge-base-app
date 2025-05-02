import "./StartPage.scss";
import { useState } from "react";
import { Layout, ConfigProvider } from "antd";
import { HeaderMenu } from "../../../widgets/headerMenu";
import { SideMenu } from "../../../widgets/sideMenu";
import { MainContent } from "../../../widgets/mainContent";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

// Main Component
export const StartPage = () => {
  const [activeTab, setActiveTab] = useState<
    "create" | "view" | "qa" | "reports"
  >("create");
  const [collapsed, setCollapsed] = useState(false);

  const handleTabChange = (tab: "create" | "view" | "qa" | "reports") => {
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
            headerFontSize: 20,
            headerBg: "#EDEDED",
          },
        },
        token: {
          // fontFamily: "Montserrat",
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", minWidth: "98vw" }}>
        <Header
          style={{
            background: "white",
            padding: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: "16px",
          }}
        >
          <div
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "1.5em", cursor: "pointer" }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <HeaderMenu />
        </Header>
        <Layout style={{ minHeight: "100vh", minWidth: "98vw" }}>
          <Sider
            width={"22vw"}
            breakpoint="md"
            collapsedWidth={80}
            collapsed={collapsed}
            onBreakpoint={(broken) => setCollapsed(broken)}
            style={{
              background: "#fff",
              minHeight: "100vh",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <SideMenu onTabChange={handleTabChange} />
          </Sider>
          <Content
            style={{
              background: "#fff",
              // width: "100%",
              padding: 24,
              // margin: "1vw 2vw 0vw 10vw",
              // minHeight: "60vh",
            }}
          >
            <MainContent activeTab={activeTab} />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
