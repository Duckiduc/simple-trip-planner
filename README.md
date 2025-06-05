# 🌍 Simple Trip Planner

A modern, responsive trip planning application built with React.js, Vite, and Ant Design. Plan your trips day by day with detailed activities, timestamps, and export your itinerary as a PDF.

## ✨ Features

- **Day-by-Day Planning**: Organize your trip with individual days and dates
- **Detailed Activities**: Add activities with:
  - Timestamps for scheduling
  - Categories (Food, Transport, Sightseeing, etc.)
  - Locations and descriptions
  - Additional notes
- **PDF Export**: Export your complete itinerary as a professional PDF
- **Modern UI**: Beautiful, responsive interface with Ant Design components
- **Real-time Editing**: Add, edit, and delete days and activities seamlessly

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or later)
- npm or yarn

### Installation

1. Clone the repository or download the project files
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Built With

- **React.js** - Frontend framework
- **Vite** - Fast build tool and development server
- **Ant Design** - UI component library
- **jsPDF & html2canvas** - PDF generation
- **date-fns & dayjs** - Date manipulation
- **@ant-design/icons** - Icon components

## 📱 How to Use

1. **Set Trip Title**: Click on the trip title to edit it
2. **Add Days**: Click "Add New Day" and select a date
3. **Add Activities**: For each day, add activities with:
   - Title (required)
   - Time (optional)
   - Category
   - Location
   - Description
   - Additional notes
4. **Organize**: Activities are automatically sorted by time
5. **Export PDF**: Click the "Export PDF" button to download your itinerary

## 🎨 Features Overview

### Day Management
- Add multiple days with specific dates
- Automatic chronological sorting
- Delete days with confirmation

### Activity Management
- Categorized activities with icons
- Time-based scheduling
- Rich text descriptions
- Location tracking
- Additional notes section

### PDF Export
- Professional formatting
- Automatic page breaks
- Clean, printable layout
- Custom filename generation

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Development

The project structure is organized as follows:

```
src/
├── components/
│   ├── TripPlanner.jsx    # Main trip planner component
│   └── DayCard.jsx        # Day and activity management
├── utils/
│   └── pdfExport.js       # PDF generation utility
├── App.jsx                # Main app component
└── main.jsx              # Entry point
```

## 🎯 Future Enhancements

- Local storage persistence
- Trip templates
- Collaborative planning
- Map integration
- Budget tracking
- Photo attachments

## 📄 License

This project is open source and available under the MIT License.
