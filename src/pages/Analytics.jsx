import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Users,
  Target,
  Award,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckSquare,
  AlertCircle,
  BarChart2,
  PieChart as PieChartIcon,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  RefreshCw,
  Mail,
  SchoolIcon,
} from "lucide-react";
import _ from "lodash";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#FF6B6B",
];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper component for dynamic stats
const StatCard = ({
  title,
  value,
  icon,
  change,
  changeType = "positive",
  bgColor,
}) => {
  return (
    <div
      className={`${bgColor} rounded-lg p-6 border border-${
        changeType === "positive" ? "green" : "red"
      }-500/20`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        {icon}
      </div>
      {change && (
        <div className="flex items-center mt-4">
          {changeType === "positive" ? (
            <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
          )}
          <span
            className={`text-sm ${
              changeType === "positive" ? "text-green-400" : "text-red-400"
            }`}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
};

const AnalyticsDashboard = () => {
  // State hooks for different data sets
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);

  // Dashboard metrics
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalClubs, setTotalClubs] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  // Chart data
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [eventDistributionData, setEventDistributionData] = useState([]);
  const [clubsByDepartmentData, setClubsByDepartmentData] = useState([]);
  const [studentsByYearData, setStudentsByYearData] = useState([]);
  const [eventAttendanceData, setEventAttendanceData] = useState([]);
  const [studentsByGenderData, setStudentsByGenderData] = useState([]);
  const [eventsTimelineData, setEventsTimelineData] = useState([]);
  const [venueStats, setVenueStats] = useState([]);
  const [srmStudentPercentage, setSrmStudentPercentage] = useState(0);
  const [userTypeDistribution, setUserTypeDistribution] = useState([]);

  // UI state
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    clubs: true,
    events: true,
    users: true,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch all data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch data function
  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    setIsRefreshing(true);

    try {
      // Fetch total counts
      await Promise.all([
        fetchTotalCounts(),
        fetchUserGrowth(),
        fetchEventDistribution(),
        fetchClubsByDepartment(),
        fetchStudentsByYear(),
        fetchEventAttendanceData(),
        fetchStudentsByGender(),
        fetchEventsTimeline(),
        fetchVenueStats(),
        fetchSRMStudentData(),
        fetchUserTypeDistribution(),
      ]);

      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchUserTypeDistribution = async () => {
    try {
      // Get counts by user type
      const { data, error } = await supabase
        .from("profiles")
        .select("user_type");

      if (error) throw error;

      if (data && data.length > 0) {
        // Count users by type
        const userTypeCounts = _.countBy(data, "user_type");

        const distributionData = [
          { name: "Students", value: userTypeCounts["student"] || 0 },
          { name: "Club Incharges", value: userTypeCounts["incharge"] || 0 },
          // Add any other user types you have
          { name: "Unknown", value: data.filter((u) => !u.user_type).length },
        ].filter((item) => item.value > 0); // Remove types with zero users

        setUserTypeDistribution(distributionData);
      }
    } catch (error) {
      console.error("Error fetching user type distribution:", error);
      // Fallback data
      setUserTypeDistribution([
        { name: "Students", value: totalStudents || 0 },
        {
          name: "Club Incharges",
          value: Math.max(0, totalUsers - totalStudents),
        },
      ]);
    }
  };

  // Individual data fetching functions
  const fetchTotalCounts = async () => {
    try {
      // Fetch total users
      const { count: usersCount, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (usersError) throw usersError;
      setTotalUsers(usersCount || 0);

      // Fetch total clubs
      const { count: clubsCount, error: clubsError } = await supabase
        .from("Clubs")
        .select("*", { count: "exact", head: true });

      if (clubsError) throw clubsError;
      setTotalClubs(clubsCount || 0);

      // Fetch total events
      const { count: eventsCount, error: eventsError } = await supabase
        .from("Events")
        .select("*", { count: "exact", head: true });

      if (eventsError) throw eventsError;
      setTotalEvents(eventsCount || 0);

      // Fetch total students
      const { count: studentsCount, error: studentsError } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      if (studentsError) throw studentsError;
      setTotalStudents(studentsCount || 0);
    } catch (error) {
      console.error("Error fetching total counts:", error);
      throw error;
    }
  };

  const fetchVenueStats = async () => {
    try {
      const { data, error } = await supabase.from("Events").select("location");

      if (error) throw error;

      if (data && data.length > 0) {
        // Count events by location
        const locationCounts = _.countBy(data, "location");

        // Calculate percentages and sort
        const totalEvents = data.length;
        const venueData = Object.entries(locationCounts)
          .map(([venue, count]) => ({
            venue: venue || "Unknown",
            count,
            percentage: Math.round((count / totalEvents) * 100),
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4); // Top 4 venues

        setVenueStats(venueData);
      }
    } catch (error) {
      console.error("Error fetching venue statistics:", error);
      throw error;
    }
  };

  const fetchSRMStudentData = async () => {
    try {
      // Count total students
      const { count: totalCount, error: totalError } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true });

      if (totalError) throw totalError;

      // Count SRM students
      const { count: srmCount, error: srmError } = await supabase
        .from("students")
        .select("*", { count: "exact", head: true })
        .eq("is_srm_vadaplani", true);

      if (srmError) throw srmError;

      // Calculate percentage
      const percentage =
        totalCount > 0 ? Math.round((srmCount / totalCount) * 100) : 0;
      setSrmStudentPercentage(percentage);
    } catch (error) {
      console.error("Error fetching SRM student data:", error);
      throw error;
    }
  };

  const fetchUserGrowth = async () => {
    try {
      // Fetch user creation timestamps
      const { data, error } = await supabase
        .from("profiles")
        .select("created_at")
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Group users by month and year
        const groupedByMonth = _.groupBy(data, (item) => {
          const date = new Date(item.created_at);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
        });

        // Transform data for chart
        const userGrowth = Object.entries(groupedByMonth).map(
          ([yearMonth, users]) => {
            const [year, month] = yearMonth.split("-");
            return {
              date: `${MONTHS[parseInt(month) - 1]} ${year}`,
              users: users.length,
            };
          }
        );

        // Add cumulative count
        let runningTotal = 0;
        const growthWithTotal = userGrowth.map((item) => {
          runningTotal += item.users;
          return {
            ...item,
            total: runningTotal,
          };
        });

        setUserGrowthData(growthWithTotal);
      }
    } catch (error) {
      console.error("Error fetching user growth data:", error);
      throw error;
    }
  };

  const fetchEventDistribution = async () => {
    try {
      // Get all events with club names
      const { data, error } = await supabase.from("Events").select("club_name");

      if (error) throw error;

      if (data && data.length > 0) {
        // Count events by club
        const clubEventCounts = _.countBy(data, "club_name");

        // Transform to chart data
        const distribution = Object.entries(clubEventCounts)
          .map(([club, count]) => ({ club, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Top 10 clubs with most events

        setEventDistributionData(distribution);
      }
    } catch (error) {
      console.error("Error fetching event distribution:", error);
      throw error;
    }
  };

  const fetchClubsByDepartment = async () => {
    try {
      // Get clubs with departments
      const { data, error } = await supabase.from("Clubs").select("dept");

      if (error) throw error;

      if (data && data.length > 0) {
        // Count clubs by department
        const deptCounts = _.countBy(data, "dept");

        // Transform to chart data format
        const clubsByDept = Object.entries(deptCounts)
          .map(([dept, count]) => ({
            name: dept || "Uncategorized",
            value: count,
          }))
          .filter((item) => item.name !== "null");

        setClubsByDepartmentData(clubsByDept);
      }
    } catch (error) {
      console.error("Error fetching clubs by department:", error);
      throw error;
    }
  };

  const fetchStudentsByYear = async () => {
    try {
      // Get students with their year
      const { data, error } = await supabase.from("students").select("year");

      if (error) throw error;

      if (data && data.length > 0) {
        // Count students by year
        const yearCounts = _.countBy(data, "year");

        // Transform to chart data format
        const studentsByYear = Object.entries(yearCounts)
          .map(([year, count]) => ({
            name: year ? `Year ${year}` : "Unknown",
            value: count,
          }))
          .filter((item) => item.name !== "Unknown");

        setStudentsByYearData(studentsByYear);
      }
    } catch (error) {
      console.error("Error fetching students by year:", error);
      throw error;
    }
  };

  const fetchEventAttendanceData = async () => {
    // This is a mock function as we don't actually have attendance data
    // In a real scenario, you would fetch actual registrations per event
    try {
      const { data, error } = await supabase
        .from("Events")
        .select("event_name")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) throw error;

      if (data && data.length > 0) {
        // Create mock data based on event names
        const mockAttendanceData = data.map((event) => ({
          name: event.event_name,
          registered: Math.floor(Math.random() * 150) + 50,
          attended: Math.floor(Math.random() * 100) + 30,
        }));

        setEventAttendanceData(mockAttendanceData);
      }
    } catch (error) {
      console.error("Error creating mock event attendance data:", error);
      throw error;
    }
  };

  const fetchStudentsByGender = async () => {
    try {
      const { data, error } = await supabase.from("students").select("gender");
  
      if (error) throw error;
  
      if (data && data.length > 0) {
        // Normalize gender values to handle case differences
        const normalizedData = data.map(item => ({
          gender: item.gender ? item.gender.toLowerCase() : null
        }));
        
        // Count with normalized values
        const genderCounts = _.countBy(normalizedData, 'gender');
        
        // Transform with proper display names
        const genderData = [
          { name: "Male", value: genderCounts["male"] || 0 },
          { name: "Female", value: genderCounts["female"] || 0 },
          { name: "Other", value: genderCounts["other"] || 0 },
          { name: "Unknown", value: data.filter(s => !s.gender).length },
        ].filter(item => item.value > 0);
  
        setStudentsByGenderData(genderData);
      }
    } catch (error) {
      console.error("Error fetching students by gender:", error);
      throw error;
    }
  };

  const fetchEventsTimeline = async () => {
    try {
      // Get events with dates
      const { data, error } = await supabase
        .from("Events")
        .select("start_date");

      if (error) throw error;

      if (data && data.length > 0) {
        // Group events by month
        const groupedByMonth = _.groupBy(data, (item) => {
          if (!item.start_date) return "Unknown";
          const date = new Date(item.start_date);
          return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}`;
        });

        // Transform to timeline data
        const timelineData = Object.entries(groupedByMonth)
          .filter(([key]) => key !== "Unknown")
          .map(([yearMonth, events]) => {
            const [year, month] = yearMonth.split("-");
            return {
              date: `${MONTHS[parseInt(month) - 1]} ${year}`,
              events: events.length,
            };
          })
          .sort((a, b) => {
            // Extract year and month for proper sorting
            const [aMonth, aYear] = a.date.split(" ");
            const [bMonth, bYear] = b.date.split(" ");
            if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
            return MONTHS.indexOf(aMonth) - MONTHS.indexOf(bMonth);
          });

        setEventsTimelineData(timelineData);
      }
    } catch (error) {
      console.error("Error fetching events timeline:", error);
      throw error;
    }
  };

  // Toggle section expand/collapse
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded-md shadow-md">
          <p className="font-medium text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom legend for pie charts
  const renderCustomLegend = (props) => {
    const { payload } = props;

    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: entry.color }}
            ></div>
            <span className="text-xs text-gray-300">
              {entry.value}: {entry.payload.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Helper to get gradient IDs for area charts
  const getGradientId = (id) => `colorGradient${id}`;

  // Loading state
  if (isLoading && !dataFetched) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl">Loading dashboard data...</h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !dataFetched) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Dashboard Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      {/* Dashboard Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              ClubSphere Analytics
            </h1>
            <p className="text-gray-400">
              Insights and metrics from your campus community platform
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Users Card */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg p-6 border border-blue-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-white">{totalUsers}</h3>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-green-400">
                +
                {userGrowthData.length > 0
                  ? userGrowthData[userGrowthData.length - 1]?.users || 0
                  : 0}{" "}
                new this month
              </span>
            </div>
          </div>

          {/* Clubs Card */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg p-6 border border-purple-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Clubs</p>
                <h3 className="text-3xl font-bold text-white">{totalClubs}</h3>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex items-center mt-4">
              <div className="w-full bg-gray-700 h-1 rounded-full">
                <div
                  className="bg-purple-500 h-1 rounded-full"
                  style={{
                    width: `${Math.min((totalClubs / 50) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Events Card */}
          <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-lg p-6 border border-pink-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Events</p>
                <h3 className="text-3xl font-bold text-white">{totalEvents}</h3>
              </div>
              <Calendar className="w-8 h-8 text-pink-400" />
            </div>
            <div className="flex items-center mt-4">
              <Activity className="w-4 h-4 text-pink-400 mr-1" />
              <span className="text-sm text-gray-300">
                {eventsTimelineData.length > 0
                  ? `${
                      eventsTimelineData[eventsTimelineData.length - 1]
                        ?.events || 0
                    } in ${
                      eventsTimelineData[eventsTimelineData.length - 1]?.date
                    }`
                  : "No recent events"}
              </span>
            </div>
          </div>

          {/* Students Card */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg p-6 border border-green-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 mb-1">Total Students</p>
                <h3 className="text-3xl font-bold text-white">
                  {totalStudents}
                </h3>
              </div>
              <Award className="w-8 h-8 text-green-400" />
            </div>
            <div className="flex items-center mt-4">
              <CheckSquare className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-sm text-gray-300">
                {studentsByYearData.length > 0
                  ? `Most common: ${
                      studentsByYearData.sort((a, b) => b.value - a.value)[0]
                        ?.name
                    }`
                  : "No student data"}
              </span>
            </div>
          </div>
        </div>

        {/* Core Metrics Section */}
        <div className="space-y-6 mb-8">
          {/* Overview Section */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
              onClick={() => toggleSection("overview")}
            >
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">Platform Overview</h2>
              </div>
              {expandedSections.overview ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedSections.overview && (
              <div className="p-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    User Growth Over Time
                  </h3>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={userGrowthData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorUsers"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8884d8"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8884d8"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorTotal"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#82ca9d"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#82ca9d"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="date"
                          tick={{ fill: "#9CA3AF" }}
                          tickLine={{ stroke: "#4B5563" }}
                        />
                        <YAxis
                          tick={{ fill: "#9CA3AF" }}
                          tickLine={{ stroke: "#4B5563" }}
                        />
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                          name="New Users"
                        />
                        <Area
                          type="monotone"
                          dataKey="total"
                          stroke="#82ca9d"
                          fillOpacity={1}
                          fill="url(#colorTotal)"
                          name="Total Users"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      Event Timeline
                    </h3>
                    <div className="w-full h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={eventsTimelineData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#4B5563"
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: "#9CA3AF" }}
                            tickLine={{ stroke: "#4B5563" }}
                          />
                          <YAxis
                            tick={{ fill: "#9CA3AF" }}
                            tickLine={{ stroke: "#4B5563" }}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="events" name="Events" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      Student Demographics by Year
                    </h3>
                    <div className="w-full h-72 flex items-center justify-center">
                      {studentsByYearData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={studentsByYearData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name} (${(percent * 100).toFixed(0)}%)`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {studentsByYearData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={renderCustomLegend} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400">
                          No student year data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clubs Section */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
              onClick={() => toggleSection("clubs")}
            >
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold">Clubs Analytics</h2>
              </div>
              {expandedSections.clubs ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedSections.clubs && (
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      Clubs by Department
                    </h3>
                    <div className="w-full h-80 flex items-center justify-center">
                      {clubsByDepartmentData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={clubsByDepartmentData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name} (${(percent * 100).toFixed(0)}%)`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {clubsByDepartmentData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={renderCustomLegend} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400">
                          No club department data available
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      Top Clubs by Event Count
                    </h3>
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={eventDistributionData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#4B5563"
                          />
                          <XAxis
                            type="number"
                            tick={{ fill: "#9CA3AF" }}
                            tickLine={{ stroke: "#4B5563" }}
                          />
                          <YAxis
                            dataKey="club"
                            type="category"
                            tick={{ fill: "#9CA3AF" }}
                            tickLine={{ stroke: "#4B5563" }}
                            width={120}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="count" name="Events" fill="#8884d8">
                            {eventDistributionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Club Member Engagement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* These could be real metrics if you collected member engagement data */}
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white">Average Members</h4>
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {totalClubs > 0
                          ? Math.round(totalStudents / totalClubs)
                          : 0}
                      </p>
                      <p className="text-sm text-gray-400">per club</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white">Average Events</h4>
                        <Calendar className="w-4 h-4 text-pink-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {totalClubs > 0
                          ? (totalEvents / totalClubs).toFixed(1)
                          : 0}
                      </p>
                      <p className="text-sm text-gray-400">per club</p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-white">Most Active Dept.</h4>
                        <Target className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-2xl font-bold text-white truncate">
                        {clubsByDepartmentData.length > 0
                          ? clubsByDepartmentData.sort(
                              (a, b) => b.value - a.value
                            )[0]?.name || "None"
                          : "None"}
                      </p>
                      <p className="text-sm text-gray-400">by club count</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
              onClick={() => toggleSection("events")}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-400" />
                <h2 className="text-xl font-bold">Events Analytics</h2>
              </div>
              {expandedSections.events ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedSections.events && (
              <div className="p-4">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Recent Event Attendance
                  </h3>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={eventAttendanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#9CA3AF" }}
                          tickLine={{ stroke: "#4B5563" }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          tick={{ fill: "#9CA3AF" }}
                          tickLine={{ stroke: "#4B5563" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="registered"
                          name="Registered"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="attended"
                          name="Attended"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Event Performance Metrics - These would be based on real data in a complete system */}
                  <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-4">
                      Registration Rate
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-3xl font-bold text-white">78%</p>
                        <p className="text-sm text-gray-400">
                          Average attendance
                        </p>
                      </div>
                      <div className="w-16 h-16 relative">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#4B5563"
                            strokeWidth="3"
                            strokeDasharray="100, 100"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#8884d8"
                            strokeWidth="3"
                            strokeDasharray="78, 100"
                            className="animate-dash"
                          />
                          <text
                            x="18"
                            y="20.5"
                            textAnchor="middle"
                            fill="white"
                            fontSize="8.5"
                          >
                            78%
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-4">
                      Popular Venues
                    </h4>
                    <ul className="space-y-3">
                      {venueStats.length > 0 ? (
                        venueStats.map((venue, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-gray-300">{venue.venue}</span>
                            <span
                              className={`text-${COLORS[
                                index % COLORS.length
                              ].replace("#", "")}`}
                            >
                              {venue.percentage}%
                            </span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">
                          No venue data available
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-4">
                      Event Stats
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Workshops</span>
                          <span className="text-white">45%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: "45%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Competitions</span>
                          <span className="text-white">28%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: "28%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Seminars</span>
                          <span className="text-white">17%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: "17%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400">Social Events</span>
                          <span className="text-white">10%</span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full"
                            style={{ width: "10%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Users Section */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden">
            <div
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-700/50 transition-colors"
              onClick={() => toggleSection("users")}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold">Users Analytics</h2>
              </div>
              {expandedSections.users ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>

            {expandedSections.users && (
              <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Students by Gender */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      Students by Gender
                    </h3>
                    <div className="w-full h-72 flex items-center justify-center">
                      {studentsByGenderData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={studentsByGenderData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {studentsByGenderData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={renderCustomLegend} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400">
                          No gender data available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Type Distribution */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      User Type Distribution
                    </h3>
                    <div className="w-full h-72 flex items-center justify-center">
                      {userTypeDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={userTypeDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {userTypeDistribution.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend content={renderCustomLegend} />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="text-gray-400">
                          No user type data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Engagement Metrics */}
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-2">
                    Student Engagement Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-white">Profile Completion</h4>
                        <CheckSquare className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-white">
                          {totalStudents > 0
                            ? Math.floor(
                                (studentsByGenderData.reduce(
                                  (total, current) => total + current.value,
                                  0
                                ) /
                                  totalStudents) *
                                  100
                              )
                            : 0}
                          %
                        </p>
                        <div className="w-12 h-12 relative">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#4B5563"
                              strokeWidth="3"
                              strokeDasharray="100, 100"
                            />
                            <path
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#10B981"
                              strokeWidth="3"
                              strokeDasharray={`${
                                totalStudents > 0
                                  ? Math.floor(
                                      (studentsByGenderData.reduce(
                                        (total, current) =>
                                          total + current.value,
                                        0
                                      ) /
                                        totalStudents) *
                                        100
                                    )
                                  : 0
                              }, 100`}
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-white">Students to Users Ratio</h4>
                        <Target className="w-4 h-4 text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {totalUsers > 0
                          ? Math.round((totalStudents / totalUsers) * 100)
                          : 0}
                        %
                      </p>
                      <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${
                              totalUsers > 0
                                ? Math.round((totalStudents / totalUsers) * 100)
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-white">SRM Students</h4>
                        <SchoolIcon className="w-4 h-4 text-yellow-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {srmStudentPercentage}%
                      </p>
                      <p className="text-sm text-gray-400">
                        of registered students
                      </p>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-white">Club Membership</h4>
                        <Activity className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-2xl font-bold text-white">1.8</p>
                      <p className="text-sm text-gray-400">
                        clubs per student avg.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Analytics Section */}
          <div className="bg-gray-800/50 backdrop-blur-md rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-400" />
                Real-time Activity
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg p-4 border border-green-500/30">
                  <h3 className="text-sm text-gray-400 mb-1">Active Now</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-2xl font-bold">
                      {Math.floor(Math.random() * 20) + 5}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/30">
                  <h3 className="text-sm text-gray-400 mb-1">Today's Logins</h3>
                  <p className="text-2xl font-bold">
                    {Math.floor(Math.random() * 100) + 50}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30">
                  <h3 className="text-sm text-gray-400 mb-1">Events Today</h3>
                  <p className="text-2xl font-bold">
                    {Math.floor(Math.random() * 3)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-lg p-4 border border-pink-500/30">
                  <h3 className="text-sm text-gray-400 mb-1">
                    New Registrations
                  </h3>
                  <p className="text-2xl font-bold">
                    {Math.floor(Math.random() * 15)}
                  </p>
                </div>
              </div>

              <div className="mt-4 bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                <h3 className="text-sm font-medium text-gray-300 mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[...Array(5)].map((_, index) => {
                    const actions = [
                      "logged in",
                      "created an event",
                      "joined a club",
                      "updated profile",
                      "registered for an event",
                    ];
                    const users = [
                      "Sidhanth B.",
                      "Adorn S.",
                      "Lenny D.",
                      "Arindam J.",
                      "Ananya J.",
                      "Ashish R.",
                      "Arpita B.",
                    ];
                    const times = [
                      "just now",
                      "2 minutes ago",
                      "5 minutes ago",
                      "10 minutes ago",
                      "15 minutes ago",
                    ];

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {users[
                              Math.floor(Math.random() * users.length)
                            ].charAt(0)}
                          </div>
                          <span className="text-white">
                            <span className="font-medium">
                              {users[Math.floor(Math.random() * users.length)]}
                            </span>{" "}
                            <span className="text-gray-400">
                              {
                                actions[
                                  Math.floor(Math.random() * actions.length)
                                ]
                              }
                            </span>
                          </span>
                        </div>
                        <span className="text-gray-500">
                          {times[Math.floor(Math.random() * times.length)]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            ClubSphere Analytics Dashboard • Last updated:{" "}
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
