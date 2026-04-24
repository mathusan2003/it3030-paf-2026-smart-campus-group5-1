/**
 * PDF export loads jspdf only when invoked (dynamic import) to keep Vite dev
 * memory use low — static imports of jspdf/jspdf-autotable can trigger OOM on
 * constrained Windows machines.
 */
export async function exportBookingsToPDF(bookings, format = 'summary') {
  const { default: JsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new JsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94);
  doc.text('Booking Management Report', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;

  if (format === 'summary') {
    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.text('Summary Statistics', 20, yPosition);

    yPosition += 12;

    const totalBookings = bookings.length;
    const approved = bookings.filter((b) => b.status === 'APPROVED').length;
    const pending = bookings.filter((b) => b.status === 'PENDING').length;
    const rejected = bookings.filter((b) => b.status === 'REJECTED').length;
    const cancelled = bookings.filter((b) => b.status === 'CANCELLED').length;

    const stats = [
      { label: 'Total Bookings', value: totalBookings },
      { label: 'Approved', value: approved },
      { label: 'Pending', value: pending },
      { label: 'Rejected', value: rejected },
      { label: 'Cancelled', value: cancelled },
    ];

    doc.setFontSize(10);
    stats.forEach((stat) => {
      doc.setTextColor(100, 116, 139);
      doc.text(`${stat.label}:`, 30, yPosition);
      doc.setTextColor(15, 23, 42);
      doc.setFont(undefined, 'bold');
      doc.text(String(stat.value), pageWidth - 40, yPosition, { align: 'right' });
      doc.setFont(undefined, 'normal');
      yPosition += 8;
    });
  } else if (format === 'detailed') {
    const tableData = bookings.map((booking) => {
      const purpose = String(booking.purpose || '');
      return [
        `#BK-${booking.id}`,
        booking.userId,
        booking.bookingDate,
        `${booking.startTime} - ${booking.endTime}`,
        booking.status,
        purpose.substring(0, 20) + (purpose.length > 20 ? '...' : ''),
      ];
    });

    doc.autoTable({
      head: [['Booking ID', 'User ID', 'Date', 'Time', 'Status', 'Purpose']],
      body: tableData,
      startY: yPosition,
      theme: 'grid',
      headerStyles: { fillColor: [22, 242, 139], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      margin: { left: 15, right: 15 },
    });
  }

  doc.save(`bookings_${format}_${new Date().toISOString().split('T')[0]}.pdf`);
}

const countBy = (items, key) =>
  items.reduce((acc, item) => {
    const value = String(item?.[key] || 'UNKNOWN');
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

const tableRowsFromCounts = (counts) =>
  Object.entries(counts).map(([label, value]) => [label.replaceAll('_', ' '), String(value)]);

export async function exportCampusReportToPDF({ bookings = [], tickets = [], resources = [], aiSuggestion = '' } = {}) {
  const { default: JsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new JsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  doc.setFontSize(20);
  doc.setTextColor(29, 78, 216);
  doc.text('Smart Campus Analytics Report', pageWidth / 2, y, { align: 'center' });

  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: 'center' });

  y += 14;
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Executive Summary', 14, y);

  y += 6;
  doc.autoTable({
    startY: y,
    head: [['Metric', 'Value']],
    body: [
      ['Total resources', String(resources.length)],
      ['Total bookings', String(bookings.length)],
      ['Approved bookings', String(bookings.filter((b) => b.status === 'APPROVED').length)],
      ['Pending approvals', String(bookings.filter((b) => b.status === 'PENDING').length)],
      ['Open tickets', String(tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length)],
      ['Resolved tickets', String(tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length)],
    ],
    theme: 'striped',
    headStyles: { fillColor: [29, 78, 216] },
  });

  y = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.text('Booking Status Breakdown', 14, y);
  doc.autoTable({
    startY: y + 5,
    head: [['Status', 'Count']],
    body: tableRowsFromCounts(countBy(bookings, 'status')),
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129] },
  });

  y = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.text('Resource Status Breakdown', 14, y);
  doc.autoTable({
    startY: y + 5,
    head: [['Status', 'Count']],
    body: tableRowsFromCounts(countBy(resources, 'status')),
    theme: 'grid',
    headStyles: { fillColor: [245, 158, 11] },
  });

  y = doc.lastAutoTable.finalY + 12;
  doc.setFontSize(12);
  doc.text('Ticket Status Breakdown', 14, y);
  doc.autoTable({
    startY: y + 5,
    head: [['Status', 'Count']],
    body: tableRowsFromCounts(countBy(tickets, 'status')),
    theme: 'grid',
    headStyles: { fillColor: [14, 165, 233] },
  });

  if (aiSuggestion) {
    y = doc.lastAutoTable.finalY + 12;
    if (y > 245) {
      doc.addPage();
      y = 18;
    }
    doc.setFontSize(12);
    doc.text('AI Booking Suggestions', 14, y);
    y += 7;
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const lines = doc.splitTextToSize(aiSuggestion, pageWidth - 28);
    doc.text(lines, 14, y);
  }

  doc.save(`campus_report_${new Date().toISOString().split('T')[0]}.pdf`);
}
