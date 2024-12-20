import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [username, setUsername] = useState(""); 
  const router = useRouter();

  // Fetch username from localStorage.
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");

    if (!storedUsername) {
      // If no username is found, redirect to the login page.
      router.push("/");
    } else {
      setUsername(storedUsername); 
    }
  }, [router]);

  const handleLogout = () => {
    // Clear the username from localStorage and redirect to login.
    localStorage.removeItem("username");
    router.push("/");
  };

  const goToCourseGrades = () => {
    const studentId = "admin"; 
    const courseId = "02360780";  

    router.push({
      pathname: "/coursegrades",
      query: { studentId, courseId },
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.welcome}>Welcome, {username}!</h1>
      <div style={styles.gridContainer}>
        <div style={styles.card}>
          <h2>Student Profile</h2>
        </div>
        <div
          style={styles.clickableCard} 
          onClick={goToCourseGrades}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") goToCourseGrades(); }}
          role="button"
          tabIndex="0"
        >
          <h2>Courses</h2>
        </div>
        <div style={styles.card}>
          <h2>Grades</h2>
        </div>
        <div style={styles.card}>
          <h2>Tips</h2>
        </div>
      </div>
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to bottom, black, gray, white)",
  },
  welcome: {
    color: "white",
    fontSize: "2rem",
    marginBottom: "20px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    width: "80%",
    maxWidth: "600px",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid gray",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    color: "white",
    fontSize: "1.2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
  },
  clickableCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid gray",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "center",
    color: "white",
    fontSize: "1.2rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.5)",
    cursor: "pointer", 
    outline: "none",   
  },
  button: {
    marginTop: "30px",
    padding: "10px 20px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    cursor: "pointer",
  },
};
