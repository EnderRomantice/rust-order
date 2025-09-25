import { useState, useEffect, useCallback } from 'react'
import { res } from './utils/res'
import type { OrderListModel } from './type/order'
import OrderList from './components/OrderList'
import CreateOrder from './components/CreateOrder'
import TabBar from './components/TabBar'
import WorkspacePage from './components/WorkspacePage'
import MenuManagePage from './components/MenuManagePage'
import HistoryOrdersPage from './components/HistoryOrdersPage'
import { useSmartRefresh } from './hooks/useUserActivity'
import {HeroUIProvider} from "@heroui/react";
import {  Modal,  ModalContent,  ModalHeader, Button, Navbar, NavbarBrand, NavbarContent, Spinner} from "@heroui/react";


function App() {
  const [orderList, setOrderList] = useState<OrderListModel>([])
  const [loading, setLoading] = useState(true)
  const [showCreateOrder, setShowCreateOrder] = useState(false)
  const [activeTab, setActiveTab] = useState('workspace')

  const getOrderList = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setLoading(true)
      }
      const data = await res('GET', '/api/admin/orders/queue')
      if (data) setOrderList(data)
    } catch (err) {
      console.error(err)
    } finally {
      if (isManualRefresh) {
        setLoading(false)
      }
    }
  }, [])

  // 使用智能刷新，避免在用户操作时打断
  const { isUserActive, manualRefresh } = useSmartRefresh(
    () => getOrderList(false), // 自动刷新时不显示loading
    30000, // 30秒间隔
    3000   // 用户停止操作3秒后才允许自动刷新
  )

  useEffect(() => {
    getOrderList(true) // 初始加载显示loading
  }, [])

  if (loading) {
    return (
      <HeroUIProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <Spinner size="lg" color="primary" />
            <p className="text-gray-600 text-lg">加载订单数据中...</p>
          </div>
        </div>
      </HeroUIProvider>
    )
  }

  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* 导航栏 */}
        <Navbar 
          className="bg-white/80 backdrop-blur-md border-b border-gray-200/50"
          maxWidth="full"
        >
          <NavbarBrand>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">锈蚀订单管理</h1>
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
          {activeTab === 'workspace' && (
            <WorkspacePage onOrderUpdate={() => getOrderList(true)} />
          )}
          {activeTab === 'menu' && (
            <MenuManagePage />
          )}
          {activeTab === 'history' && (
            <HistoryOrdersPage />
          )}
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
            body: "p-0"
          }}
        >
          <ModalContent className="bg-white/95 backdrop-blur-md max-h-none">
            <ModalHeader className="flex flex-col gap-1 border-b border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900">创建新订单</h2>
            </ModalHeader>
            
            <CreateOrder onOrderCreated={() => {
              getOrderList(true)
              setShowCreateOrder(false)
            }} />
            
          </ModalContent>
        </Modal>

        {/* 底部TabBar */}
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </HeroUIProvider>
  )
}

export default App
