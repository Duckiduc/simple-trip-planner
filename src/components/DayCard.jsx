import { useState } from 'react'
import { 
  Input, 
  Button, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Card,
  TimePicker,
  Select,
  Tag,
  Popconfirm,
  message,
  Empty
} from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { format } from 'date-fns'
import dayjs from 'dayjs'

const { TextArea } = Input
const { Text, Title } = Typography
const { Option } = Select

const ActivityCard = ({ activity, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: activity.title,
    description: activity.description,
    time: activity.time ? dayjs(activity.time) : null,
    category: activity.category,
    location: activity.location,
    notes: activity.notes
  })

  const handleSave = () => {
    if (!editData.title.trim()) {
      message.error('Activity title is required')
      return
    }

    onUpdate({
      ...activity,
      ...editData,
      time: editData.time ? editData.time.toDate() : null
    })
    setIsEditing(false)
    message.success('Activity updated!')
  }

  const handleCancel = () => {
    setEditData({
      title: activity.title,
      description: activity.description,
      time: activity.time ? dayjs(activity.time) : null,
      category: activity.category,
      location: activity.location,
      notes: activity.notes
    })
    setIsEditing(false)
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'orange',
      'Activity': 'blue',
      'Transport': 'green',
      'Accommodation': 'purple',
      'Sightseeing': 'cyan',
      'Shopping': 'magenta',
      'Other': 'default'
    }
    return colors[category] || 'default'
  }

  if (isEditing) {
    return (
      <Card 
        size="small" 
        style={{ marginBottom: 12, border: '2px dashed #1890ff' }}
        bodyStyle={{ padding: 16 }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Row gutter={16}>
            <Col span={12}>
              <Input
                placeholder="Activity title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </Col>
            <Col span={6}>
              <TimePicker
                format="HH:mm"
                value={editData.time}
                onChange={(time) => setEditData({ ...editData, time })}
                placeholder="Time"
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Category"
                value={editData.category}
                onChange={(category) => setEditData({ ...editData, category })}
                style={{ width: '100%' }}
              >
                <Option value="Food">🍽️ Food</Option>
                <Option value="Activity">🎯 Activity</Option>
                <Option value="Transport">🚗 Transport</Option>
                <Option value="Accommodation">🏨 Accommodation</Option>
                <Option value="Sightseeing">📸 Sightseeing</Option>
                <Option value="Shopping">🛍️ Shopping</Option>
                <Option value="Other">📌 Other</Option>
              </Select>
            </Col>
          </Row>
          
          <Input
            placeholder="Location (optional)"
            value={editData.location}
            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
          />
          
          <TextArea
            placeholder="Description"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            rows={2}
          />
          
          <TextArea
            placeholder="Additional notes (optional)"
            value={editData.notes}
            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            rows={2}
          />
          
          <Row justify="end">
            <Space>
              <Button icon={<SaveOutlined />} type="primary" onClick={handleSave}>
                Save
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Row>
        </Space>
      </Card>
    )
  }

  return (
    <Card 
      size="small" 
      style={{ marginBottom: 12 }}
      bodyStyle={{ padding: 16 }}
      extra={
        <Space>
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
          />
          <Popconfirm
            title="Delete activity?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="text" 
              size="small" 
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      }
    >
      <Row gutter={16} align="top">
        <Col span={18}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Row align="middle" gutter={8}>
              <Col>
                <Text strong style={{ fontSize: '16px' }}>{activity.title}</Text>
              </Col>
              {activity.time && (
                <Col>
                  <Tag icon={<ClockCircleOutlined />} color="blue">
                    {format(new Date(activity.time), 'HH:mm')}
                  </Tag>
                </Col>
              )}
              {activity.category && (
                <Col>
                  <Tag color={getCategoryColor(activity.category)}>
                    {activity.category}
                  </Tag>
                </Col>
              )}
            </Row>
            
            {activity.location && (
              <Text type="secondary">📍 {activity.location}</Text>
            )}
            
            {activity.description && (
              <Text>{activity.description}</Text>
            )}
            
            {activity.notes && (
              <Text type="secondary" italic>💡 {activity.notes}</Text>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

const DayCard = ({ day, onUpdate }) => {
  const [isAddingActivity, setIsAddingActivity] = useState(false)
  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    time: null,
    category: '',
    location: '',
    notes: ''
  })

  const addActivity = () => {
    if (!newActivity.title.trim()) {
      message.error('Activity title is required')
      return
    }

    const activity = {
      id: Date.now(),
      ...newActivity,
      time: newActivity.time ? newActivity.time.toDate() : null
    }

    onUpdate({
      activities: [...day.activities, activity]
    })

    setNewActivity({
      title: '',
      description: '',
      time: null,
      category: '',
      location: '',
      notes: ''
    })
    setIsAddingActivity(false)
    message.success('Activity added!')
  }

  const updateActivity = (activityId, updatedActivity) => {
    const updatedActivities = day.activities.map(activity =>
      activity.id === activityId ? updatedActivity : activity
    )
    onUpdate({ activities: updatedActivities })
  }

  const deleteActivity = (activityId) => {
    const updatedActivities = day.activities.filter(activity => activity.id !== activityId)
    onUpdate({ activities: updatedActivities })
    message.success('Activity deleted!')
  }

  const sortedActivities = [...day.activities].sort((a, b) => {
    if (!a.time && !b.time) return 0
    if (!a.time) return 1
    if (!b.time) return -1
    return new Date(a.time) - new Date(b.time)
  })

  return (
    <div>
      {/* Day Summary */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Text type="secondary">
            {day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'} planned
          </Text>
        </Col>
      </Row>

      {/* Activities */}
      {sortedActivities.length === 0 ? (
        <Empty 
          description="No activities planned"
          style={{ margin: '20px 0' }}
        />
      ) : (
        <div style={{ marginBottom: 16 }}>
          {sortedActivities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onUpdate={(updated) => updateActivity(activity.id, updated)}
              onDelete={() => deleteActivity(activity.id)}
            />
          ))}
        </div>
      )}

      {/* Add Activity */}
      {!isAddingActivity ? (
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setIsAddingActivity(true)}
          style={{ width: '100%' }}
        >
          Add Activity
        </Button>
      ) : (
        <Card 
          size="small" 
          style={{ border: '2px dashed #52c41a' }}
          bodyStyle={{ padding: 16 }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Row gutter={16}>
              <Col span={12}>
                <Input
                  placeholder="Activity title *"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                />
              </Col>
              <Col span={6}>
                <TimePicker
                  format="HH:mm"
                  value={newActivity.time}
                  onChange={(time) => setNewActivity({ ...newActivity, time })}
                  placeholder="Time"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={6}>
                <Select
                  placeholder="Category"
                  value={newActivity.category}
                  onChange={(category) => setNewActivity({ ...newActivity, category })}
                  style={{ width: '100%' }}
                >
                  <Option value="Food">🍽️ Food</Option>
                  <Option value="Activity">🎯 Activity</Option>
                  <Option value="Transport">🚗 Transport</Option>
                  <Option value="Accommodation">🏨 Accommodation</Option>
                  <Option value="Sightseeing">📸 Sightseeing</Option>
                  <Option value="Shopping">🛍️ Shopping</Option>
                  <Option value="Other">📌 Other</Option>
                </Select>
              </Col>
            </Row>
            
            <Input
              placeholder="Location (optional)"
              value={newActivity.location}
              onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
            />
            
            <TextArea
              placeholder="Description"
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              rows={2}
            />
            
            <TextArea
              placeholder="Additional notes (optional)"
              value={newActivity.notes}
              onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
              rows={2}
            />
            
            <Row justify="end">
              <Space>
                <Button type="primary" onClick={addActivity}>
                  Add Activity
                </Button>
                <Button onClick={() => {
                  setIsAddingActivity(false)
                  setNewActivity({
                    title: '',
                    description: '',
                    time: null,
                    category: '',
                    location: '',
                    notes: ''
                  })
                }}>
                  Cancel
                </Button>
              </Space>
            </Row>
          </Space>
        </Card>
      )}
    </div>
  )
}

export default DayCard
