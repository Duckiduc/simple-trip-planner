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
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <Header style={{ 
          background: '#fff', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            🌍 Simple Trip Planner
          </Title>
        </Header>
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <TripPlanner />
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default App
