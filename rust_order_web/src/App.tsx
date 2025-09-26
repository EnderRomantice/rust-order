import { useState } from "react";

import CreateOrder from "./components/CreateOrder";
import TabBar from "./components/TabBar";
import WorkspacePage from "./components/WorkspacePage";
import MenuManagePage from "./components/MenuManagePage";
import HistoryOrdersPage from "./components/HistoryOrdersPage";
import { HeroUIProvider } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@heroui/react";

function App() {
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-blue-100">
        {/* 导航栏 */}
        <Navbar
          className="bg-white/80 backdrop-blur-md border-b border-gray-200/50"
          maxWidth="full"
        >
          <NavbarBrand>
            <div className="flex items-center space-x-3">
              <img src="../asstes/rust.png" className="w-12" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  锈蚀订单管理
                </h1>
                <p className="text-xs text-gray-500">现代化订单管理系统</p>
              </div>
            </div>
          </NavbarBrand>
          <NavbarContent justify="end">
            <Button
              color="primary"
              variant="shadow"
              onPress={() => setShowCreateOrder(true)}
              className="font-semibold"
            >
              + 创建订单
            </Button>
          </NavbarContent>
        </Navbar>

        {/* 主内容区域 */}
        <main className="container mx-auto px-4 py-8 pb-24">
          {activeTab === "workspace" && (
            <WorkspacePage onOrderUpdate={() => {}} />
          )}
          {activeTab === "menu" && <MenuManagePage />}
          {activeTab === "history" && <HistoryOrdersPage />}
        </main>

        {/* 创建订单模态框 */}
        <Modal
          isOpen={showCreateOrder}
          onClose={() => setShowCreateOrder(false)}
          size="5xl"
          scrollBehavior="outside"
          className="mx-4"
          classNames={{
            base: "max-h-[95vh]",
            wrapper: "overflow-y-auto",
            body: "p-0",
          }}
        >
          <ModalContent className="bg-white/95 backdrop-blur-md max-h-none">
            <ModalHeader className="flex flex-col gap-1 border-b border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900">创建新订单</h2>
            </ModalHeader>

            <CreateOrder
              onOrderCreated={() => {
                setShowCreateOrder(false);
              }}
            />
          </ModalContent>
        </Modal>

        {/* 底部TabBar */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </HeroUIProvider>
  );
}

export default App;
