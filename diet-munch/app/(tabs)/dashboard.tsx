import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { apiUrls } from "../constants/api"; // adjust path as per your folder
const SHEET_API_URL = apiUrls.memberUrl; // Use the memberUrl for saving expenses
export default function Dashboard() {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [monthlyTotals, setMonthlyTotals] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎨 Colors for each month
  const monthColors = [
    "#FF5733", "#FFC300", "#4CAF50", "#2196F3", "#9C27B0", "#FF9800",
    "#E91E63", "#00BCD4", "#8BC34A", "#FF5722", "#3F51B5", "#795548"
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
 const res = await fetch(SHEET_API_URL+ "?requestName=showBill");
      const data = await res.json();
      console.log(data)
      setMonthlyTotals(getMonthlyTotals(data));
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyTotals = (data: { bill_date: string; bill_amount: number }[]) => {
    const monthlyTotals = Array(12).fill(0);
    data.forEach((item) => {
      const monthIndex = new Date(item.bill_date).getMonth();
      monthlyTotals[monthIndex] += Number(item.bill_amount) || 0;
    });
    return monthlyTotals;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Collection</Text>

      <Button title="🔄 Refresh Data" onPress={fetchData} color="#2196F3" />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={{ marginTop: 10 }}>Loading data...</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          <BarChart
                          data={{
                              labels: labels,
                              datasets: [{
                                  data: monthlyTotals,
                                  colors: monthColors.map(color => () => color)
                              }],
                          }}
                          width={labels.length * 90}
                          height={300}
                          fromZero
                          showValuesOnTopOfBars
                          yAxisLabel="₹"
                          withCustomBarColorFromData={true}
                          flatColor={true}
                          chartConfig={{
                              backgroundGradientFrom: "#ffffff",
                              backgroundGradientTo: "#ffffff",
                              decimalPlaces: 0,
                              barPercentage: 0.6,
                              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                              propsForLabels: { fontSize: 12 },
                          }}
                          style={styles.chart} yAxisSuffix={""}          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});
