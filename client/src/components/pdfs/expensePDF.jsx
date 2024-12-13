import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    color: '#333',
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2C3E50',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginTop: 20,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomColor: '#d1d5db',
    borderBottomWidth: 1,
  },
  tableRowHeader: {
    backgroundColor: '#007bff',
  },
  tableCol: {
    borderStyle: 'solid',
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
    padding: 8,
    width: '25%',
  },
  tableColLast: {
    borderRightWidth: 0, // No border on the last column
  },
  tableCellHeader: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 10,
    color: '#4A5568',
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    textAlign: 'center',
    color: '#6c757d',
  },
});

// Create a PDF document component
const ExpensePDF = ({ data }) => (
  <Document>
    <Page
      size="A4"
      style={styles.page}
    >
      {/* Header */}
      <Text style={styles.header}>Expense Report</Text>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableRowHeader]}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Expense Title</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Category</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCellHeader}>Date</Text>
          </View>
          <View style={[styles.tableCol, styles.tableColLast]}>
            <Text style={styles.tableCellHeader}>Amount</Text>
          </View>
        </View>

        {/* Table Rows */}
        {data.map((expense, index) => (
          <View
            key={index}
            style={[
              styles.tableRow,
              index % 2 === 0 && { backgroundColor: '#f9fafb' }, // Alternate row colors
            ]}
          >
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{expense.title}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{expense.category}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{expense.date}</Text>
            </View>
            <View style={[styles.tableCol, styles.tableColLast]}>
              <Text style={styles.tableCell}>${expense.amount.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Generated on {new Date().toLocaleDateString()} | Powered by Your App
      </Text>
    </Page>
  </Document>
);

export default ExpensePDF;
