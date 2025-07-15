import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Overview.module.css";
import { useNavigate } from "react-router-dom";

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  Legend,
} from "recharts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const varsColors = [
  "var(--color-primary-1)",
  "var(--color-primary-2)",
  "var(--color-primary-3)",
  "var(--color-primary-4)",
  "var(--color-primary-5)",
  "var(--color-primary-6)",
];

const Overview = () => {
  const [conditions, setConditions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [barSummary, setBarSummary] = useState({});
  const [pieSummary, setPieSummary] = useState({});

  const [totalAbandon, setTotalAbandon] = useState(0);
  const [doctorAbandon, setDoctorAbandon] = useState(0);

  const navigate = useNavigate();
  

  const currentUser = {
    nama: sessionStorage.getItem("nama_lengkap"),
    role: sessionStorage.getItem("role"),
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [condRes, appRes] = await Promise.all([
        axios.get("/api/Condition"),
        axios.get("/api/Appointment"),
      ]);

      if (!condRes.data.success || !appRes.data.success) {
        throw new Error("Gagal mengambil data");
      }

      const condData = condRes.data.data;
      const appData = appRes.data.data;

      const abandonAll = appData.filter((app) => app.abandon === "ya");
      const abandonByDoctor = abandonAll.filter(
        (app) => app.nama_dokter === currentUser.nama
      );

      setTotalAbandon(new Set(abandonAll.map((a) => a.no_rekam_medis)).size);
      setDoctorAbandon(new Set(abandonByDoctor.map((a) => a.no_rekam_medis)).size);


      const allPatientMap = {};
      const doctorPatientMap = {};

      const appointmentMap = {};
      appData.forEach((app) => {
        appointmentMap[app.no_rekam_medis] = app;
      });

      condData.forEach((item) => {
        const subgroup = item.subgroup || "Tidak diketahui";
        const rekamMedis = item.no_rekam_medis;

        if (!allPatientMap[rekamMedis]) {
          allPatientMap[rekamMedis] = subgroup;
        }

        const isDokter =
          currentUser.role === "dokter" &&
          appData.some(
            (app) =>
              app.no_rekam_medis === rekamMedis &&
              app.nama_dokter === currentUser.nama
          );

        if (isDokter && !doctorPatientMap[rekamMedis]) {
          doctorPatientMap[rekamMedis] = subgroup;
        }
      });

      const barGroup = {};
      Object.values(allPatientMap).forEach((subgroup) => {
        barGroup[subgroup] = (barGroup[subgroup] || 0) + 1;
      });
      setBarSummary(barGroup);

      const pieGroup = {};
      Object.values(doctorPatientMap).forEach((subgroup) => {
        pieGroup[subgroup] = (pieGroup[subgroup] || 0) + 1;
      });
      setPieSummary(pieGroup);

      setAppointments(appData);
      setConditions(condData);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPatients = new Set(conditions.map((c) => c.no_rekam_medis)).size;
  const doctorPatients = new Set(
    Object.keys(pieSummary)
  ).size;

  const barData = Object.entries(barSummary).map(([name, value]) => ({
    name,
    value,
  }));

  const pieTotal = Object.values(pieSummary).reduce((a, b) => a + b, 0);
  const getPercent = (val) =>
    pieTotal ? ((val / pieTotal) * 100).toFixed(0) : 0;

  const pieData = Object.entries(pieSummary).map(([name, value], index) => ({
    name,
    value,
    color: varsColors[index % varsColors.length],
  }));

  const handleExport = async (type = "png") => {
    const chartEl = document.getElementById("chartArea");
    if (!chartEl) return;
    const canvas = await html2canvas(chartEl);
    const imgData = canvas.toDataURL("image/png");
    if (type === "png") {
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = imgData;
      link.click();
    } else {
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 160);
      pdf.save("chart.pdf");
    }
  };

  if (loading) return <div className={styles.overviewContainer}>Loading...</div>;
  if (error) return <div className={styles.overviewContainer}>Error: {error}</div>;

  return (
    <div className={styles.overviewContainer}>
      <h2 className={styles.header}>Overview</h2>

      <div className={styles.filterBar}>
        <button onClick={fetchData}>Refresh</button>
        <button onClick={() => handleExport("png")}>Export PNG</button>
        <button onClick={() => handleExport("pdf")}>Export PDF</button>
      </div>

      <div className={styles.statGrid}>
        <Card title="Total Pasien" value={totalPatients.toLocaleString()} />
        {currentUser.role === "dokter" && (
          <Card
            title={"Total Pasien (" + currentUser.nama + ")"}
            value={doctorPatients.toLocaleString()}
          />
        )}
        <Card title="Total Pasien Abandon" value={totalAbandon.toLocaleString()} />
        {currentUser.role === "dokter" && (
          <Card
            title={"Total Pasien Abandon (" + currentUser.nama + ")"}
            value={doctorAbandon.toLocaleString()}
          />
        )}
      </div>

      <div className={styles.summaryBox}>
        <h3 className={styles.summaryTitle}>Total Pasien per Subgroup</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" style={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="var(--color-primary-1)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {currentUser.role === "dokter" && (
        <div className={styles.summaryBox}>
          <h3 className={styles.summaryTitle}>Total Pasien ({currentUser.nama}) per Subgroup</h3>
          <div className={styles.chartContainer} id="chartArea">
            <PieChart data={pieData} />
            <div className={styles.subgroupList}>
              {pieData.map(({ name, value, color }) => (
                <p key={name} className={styles.subgroupItem}>
                  <span style={{ color }}>{getPercent(value)}%</span> {name}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    <button className={styles.backButton} onClick={() => navigate(-1)}>← Kembali</button>

    </div>
  );
};

const Card = ({ title, value }) => (
  <div className={styles.card}>
    <p className={styles.cardTitle}>{title}</p>
    <p className={styles.cardValue}>{value}</p>
  </div>
);

const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 12; // jarak label → aman & tidak keluar
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#333"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChart = ({ data }) => (
  <div className={styles.pieChartWrapper}>
    <ResponsiveContainer width={260} height={260}>
      <RechartsPieChart margin={{ top: 20, bottom: 20, left: 20, right: 20 }}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={95} // dikurangi dari 80 → supaya label tidak keluar container
          label={renderCustomizedLabel}
          isAnimationActive={true}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    </ResponsiveContainer>  
  </div>
);

export default Overview;
