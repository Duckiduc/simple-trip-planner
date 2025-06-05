import { useState, useRef } from 'react'
import { 
  Card, 
  Button, 
  Input, 
  DatePicker, 
  Space, 
  Typography, 
  Row, 
  Col, 
  message,
  Popconfirm,
  Empty,
  Divider
} from 'antd'
import { 
  PlusOutlined, 
  DownloadOutlined, 
  CalendarOutlined,
  DeleteOutlined 
} from '@ant-design/icons'
import { format } from 'date-fns'
import DayCard from './DayCard'
import { exportToPDF } from '../utils/pdfExport'

const { Title, Text } = Typography

const TripPlanner = () => {
  const [tripTitle, setTripTitle] = useState('My Amazing Trip')
  const [days, setDays] = useState([])
  const [isAddingDay, setIsAddingDay] = useState(false)
  const [newDayDate, setNewDayDate] = useState(null)
  const tripRef = useRef()

  const addDay = () => {
    if (!newDayDate) {
      message.error('Please select a date for the day')
      return
    }

    const newDay = {
      id: Date.now(),
      date: newDayDate.toDate(),
      title: `Day ${days.length + 1}`,
      activities: []
    }

    setDays([...days, newDay])
    setNewDayDate(null)
    setIsAddingDay(false)
    message.success('Day added successfully!')
  }

  const deleteDay = (dayId) => {
    setDays(days.filter(day => day.id !== dayId))
    message.success('Day deleted successfully!')
  }

  const updateDay = (dayId, updatedDay) => {
    setDays(days.map(day => day.id === dayId ? { ...day, ...updatedDay } : day))
  }

  const sortedDays = [...days].sort((a, b) => new Date(a.date) - new Date(b.date))

  const handleExportPDF = async () => {
    try {
      message.loading({ content: 'Generating PDF...', key: 'pdf' })
      await exportToPDF(tripRef.current, tripTitle)
      message.success({ content: 'PDF exported successfully!', key: 'pdf' })
    } catch (error) {
      message.error({ content: 'Failed to export PDF', key: 'pdf' })
      console.error('PDF export error:', error)
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Trip Header */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row align="middle" justify="space-between">
          <Col>
            <Input
              value={tripTitle}
              onChange={(e) => setTripTitle(e.target.value)}
              style={{ 
                fontSize: '24px', 
                fontWeight: 'bold',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                borderRadius: '8px',
                width: 'auto',
                minWidth: '300px'
              }}
              placeholder="Enter trip title"
            />
            <div style={{ marginTop: 8 }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px' }}>
                📅 {days.length} {days.length === 1 ? 'day' : 'days'} planned
              </Text>
            </div>
          </Col>
          <Col>
            <Space>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={handleExportPDF}
                disabled={days.length === 0}
                size="large"
              >
                Export PDF
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Trip Content */}
      <div ref={tripRef}>
        {/* Add New Day */}
        <Card style={{ marginBottom: 24 }}>
          {!isAddingDay ? (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setIsAddingDay(true)}
              style={{ width: '100%', height: '60px', fontSize: '16px' }}
            >
              Add New Day
            </Button>
          ) : (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row gutter={16} align="middle">
                <Col flex={1}>
                  <DatePicker
                    placeholder="Select date"
                    value={newDayDate}
                    onChange={setNewDayDate}
                    style={{ width: '100%' }}
                    size="large"
                  />
                </Col>
                <Col>
                  <Space>
                    <Button type="primary" onClick={addDay}>
                      Add Day
                    </Button>
                    <Button onClick={() => {
                      setIsAddingDay(false)
                      setNewDayDate(null)
                    }}>
                      Cancel
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Space>
          )}
        </Card>

        {/* Days List */}
        {sortedDays.length === 0 ? (
          <Card>
            <Empty 
              description="No days planned yet"
              image={<CalendarOutlined style={{ fontSize: 64, color: '#ccc' }} />}
            >
              <Text type="secondary">Start by adding your first day above!</Text>
            </Empty>
          </Card>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {sortedDays.map((day, index) => (
              <Card 
                key={day.id}
                title={
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Space>
                        <CalendarOutlined />
                        <Text strong>{format(new Date(day.date), 'EEEE, MMMM d, yyyy')}</Text>
                      </Space>
                    </Col>
                    <Col>
                      <Popconfirm
                        title="Delete this day?"
                        description="Are you sure you want to delete this day and all its activities?"
                        onConfirm={() => deleteDay(day.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          size="small"
                        />
                      </Popconfirm>
                    </Col>
                  </Row>
                }
                style={{ border: '2px solid #e8f4fd' }}
              >
                <DayCard 
                  day={day} 
                  onUpdate={(updatedDay) => updateDay(day.id, updatedDay)}
                  dayNumber={index + 1}
                />
              </Card>
            ))}
          </Space>
        )}
      </div>
    </div>
  )
}

export default TripPlanner
