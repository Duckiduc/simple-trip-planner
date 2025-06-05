import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const exportToPDF = async (element, tripTitle) => {
  try {
    // Create a temporary container for PDF rendering
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = '210mm' // A4 width
    tempContainer.style.backgroundColor = 'white'
    tempContainer.style.padding = '20px'
    tempContainer.style.fontFamily = 'Arial, sans-serif'
    
    // Clone the element
    const clonedElement = element.cloneNode(true)
    
    // Clean up the cloned element for PDF
    const cards = clonedElement.querySelectorAll('.ant-card')
    cards.forEach(card => {
      card.style.boxShadow = 'none'
      card.style.border = '1px solid #d9d9d9'
      card.style.marginBottom = '16px'
    })
    
    // Remove action buttons from cloned element
    const buttons = clonedElement.querySelectorAll('button')
    buttons.forEach(button => {
      if (button.textContent.includes('Add') || 
          button.textContent.includes('Edit') || 
          button.textContent.includes('Delete') ||
          button.textContent.includes('Cancel') ||
          button.textContent.includes('Save')) {
        button.remove()
      }
    })
    
    // Remove empty states and add buttons
    const emptyElements = clonedElement.querySelectorAll('.ant-empty')
    emptyElements.forEach(empty => empty.remove())
    
    const addButtons = clonedElement.querySelectorAll('[class*="dashed"]')
    addButtons.forEach(button => button.remove())
    
    tempContainer.appendChild(clonedElement)
    document.body.appendChild(tempContainer)
    
    // Generate canvas from the cleaned element
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempContainer.offsetWidth,
      height: tempContainer.offsetHeight
    })
    
    // Remove temporary container
    document.body.removeChild(tempContainer)
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // Calculate dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pdfWidth - 20 // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    let heightLeft = imgHeight
    let position = 10 // 10mm top margin
    
    // Add title page
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text(tripTitle, pdfWidth / 2, 30, { align: 'center' })
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Trip Itinerary', pdfWidth / 2, 40, { align: 'center' })
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pdfWidth / 2, 50, { align: 'center' })
    
    // Add the main content
    if (heightLeft <= pdfHeight - 70) {
      // Content fits on first page
      pdf.addImage(imgData, 'PNG', 10, 70, imgWidth, imgHeight)
    } else {
      // Content needs multiple pages
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= (pdfHeight - position)
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }
    }
    
    // Save the PDF
    const fileName = `${tripTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_itinerary.pdf`
    pdf.save(fileName)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}
