import { Layout, Typography, ConfigProvider } from 'antd'
import TripPlanner from './components/TripPlanner'
import './App.css'

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <Header className="app-header">
          <div className="header-content">
            <Title level={3} className="app-title">
              ✈️ Trip Planner
            </Title>
          </div>
        </Header>
        <Content className="app-content">
          <TripPlanner />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App
