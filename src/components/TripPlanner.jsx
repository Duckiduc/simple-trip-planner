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
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons'
import { format } from 'date-fns'
import DayCard from './DayCard'
import { exportToPDF } from '../utils/pdfExport'
import { exportToCalendar, exportTripOverview } from '../utils/calendarExport'

const { Title, Text } = Typography

const TripPlanner = () => {
  const [tripTitle, setTripTitle] = useState('My Amazing Trip')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [tempTitle, setTempTitle] = useState(tripTitle)
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

  const handleTitleEdit = () => {
    setTempTitle(tripTitle)
    setIsEditingTitle(true)
  }

  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      setTripTitle(tempTitle.trim())
      setIsEditingTitle(false)
      message.success('Trip title updated!')
    } else {
      message.error('Trip title cannot be empty')
    }
  }

  const handleTitleCancel = () => {
    setTempTitle(tripTitle)
    setIsEditingTitle(false)
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

  const handleExportCalendar = async () => {
    console.log('Calendar export button clicked', { days: days.length, sortedDays })
    
    if (days.length === 0) {
      message.warning('Please add some days to your trip before exporting to calendar')
      return
    }

    try {
      message.loading({ content: 'Generating calendar file...', key: 'calendar' })
      await exportToCalendar(sortedDays, tripTitle)
      message.success({ content: 'Calendar exported successfully!', key: 'calendar' })
    } catch (error) {
      message.error({ content: 'Failed to export calendar', key: 'calendar' })
      console.error('Calendar export error:', error)
    }
  }

  const handleExportTripOverview = async () => {
    if (days.length === 0) {
      message.warning('Please add some days to your trip before exporting overview')
      return
    }

    try {
      message.loading({ content: 'Generating trip overview...', key: 'overview' })
      await exportTripOverview(sortedDays, tripTitle)
      message.success({ content: 'Trip overview exported successfully!', key: 'overview' })
    } catch (error) {
      message.error({ content: 'Failed to export trip overview', key: 'overview' })
      console.error('Trip overview export error:', error)
    }
  }

  return (
    <div className="trip-planner-container">
      {/* Trip Header */}
      <Card className="trip-header" style={{ marginBottom: 16 }}>
        <div className="trip-header-content">
          <div className="trip-title-section">
            {!isEditingTitle ? (
              <div className="trip-title-display" onClick={handleTitleEdit}>
                <Typography.Title level={3} className="trip-title" style={{ margin: 0 }}>
                  {tripTitle}
                </Typography.Title>
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  size="small"
                  className="edit-title-btn"
                />
              </div>
            ) : (
              <div className="trip-title-edit">
                <Input
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onPressEnter={handleTitleSave}
                  className="trip-title-input"
                  placeholder="Enter trip name"
                  autoFocus
                />
                <div className="title-edit-actions">
                  <Button 
                    type="primary" 
                    icon={<CheckOutlined />} 
                    size="small"
                    onClick={handleTitleSave}
                  />
                  <Button 
                    icon={<CloseOutlined />} 
                    size="small"
                    onClick={handleTitleCancel}
                  />
                </div>
              </div>
            )}
            <Text className="trip-summary">
              📅 {days.length} {days.length === 1 ? 'day' : 'days'} planned
            </Text>
          </div>
          
          <div className="trip-actions">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Button 
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleExportPDF}
                disabled={days.length === 0}
                className="export-btn"
                block
              >
                <span className="export-text">Export PDF</span>
              </Button>
              <Space.Compact style={{ width: '100%' }}>
                <Button 
                  icon={<CalendarOutlined />}
                  onClick={handleExportCalendar}
                  disabled={days.length === 0}
                  className="export-btn calendar-btn"
                  style={{ flex: 1 }}
                >
                  <span className="export-text">Add to Calendar</span>
                </Button>
                <Button 
                  icon={<CalendarOutlined />}
                  onClick={handleExportTripOverview}
                  disabled={days.length === 0}
                  className="export-btn overview-btn"
                  style={{ flex: 1 }}
                  title="Export trip overview"
                >
                  <span className="export-text">Overview</span>
                </Button>
              </Space.Compact>
            </Space>
          </div>
        </div>
      </Card>

      {/* Trip Content */}
      <div ref={tripRef}>
        {/* Add New Day */}
        <Card className="add-day-card" style={{ marginBottom: 16 }}>
          {!isAddingDay ? (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => setIsAddingDay(true)}
              className="add-day-btn"
            >
              Add New Day
            </Button>
          ) : (
            <div className="add-day-form">
              <div className="date-picker-container">
                <DatePicker
                  placeholder="Select date"
                  value={newDayDate}
                  onChange={setNewDayDate}
                  className="date-picker"
                />
              </div>
              <div className="add-day-actions">
                <Button type="primary" onClick={addDay} className="add-btn">
                  Add Day
                </Button>
                <Button onClick={() => {
                  setIsAddingDay(false)
                  setNewDayDate(null)
                }} className="cancel-btn">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Days List */}
        {sortedDays.length === 0 ? (
          <Card className="empty-state">
            <Empty 
              description="No days planned yet"
              image={<CalendarOutlined style={{ fontSize: 48, color: '#ccc' }} />}
            >
              <Text type="secondary">Start by adding your first day above!</Text>
            </Empty>
          </Card>
        ) : (
          <div className="days-container">
            {sortedDays.map((day) => (
              <Card 
                key={day.id}
                className="day-card"
                title={
                  <div className="day-card-header">
                    <div className="day-info">
                      <CalendarOutlined className="calendar-icon" />
                      <Text strong className="day-date">
                        {format(new Date(day.date), 'EEEE, MMM d, yyyy')}
                      </Text>
                    </div>
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
                        className="delete-day-btn"
                      />
                    </Popconfirm>
                  </div>
                }
              >
                <DayCard 
                  day={day} 
                  onUpdate={(updatedDay) => updateDay(day.id, updatedDay)}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TripPlanner
