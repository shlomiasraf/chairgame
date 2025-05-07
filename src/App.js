import { useEffect, useState } from "react";
import axios from "axios";

const Placeholder = () => (
  <div style={{ minWidth: "160px", padding: "12px", border: "2px solid transparent" }} />
);

export default function App() {
  const [room, setRoom] = useState([]);
  const [userRequirements, setUserRequirements] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  const getColorFromStatus = (status_colors) => {
    if (!status_colors) return "gray";
    if (status_colors.includes("green")) return "green";
    if (status_colors.includes("red")) return "red";
    if (status_colors.includes("purple")) return "purple";
    if (status_colors.includes("orange")) return "orange";
    return "gray";
  };
  
  const layout = [
    [6, 5, 4, 3, 2, 1, 0],
    [13, 12, 11, null, 10, 9, 8, null, 7],
    [14, 17, null, null, 20, 23, null, 26],
    [15, 18, null, null, 21, 24, null, 27],
    [16, 19, null, null, 22, 25, null, 28],
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/api/stations");
  
        const mappedRoom = data.map((s, index) => {
          const toBool = val => Boolean(Number(val)); // המרה בטוחה
  
          const computers = [];
          if (toBool(s.has_pc_red)) computers.push("אדום");
          if (toBool(s.has_pc_green)) computers.push("ירוק");
          if (toBool(s.has_pc_blue)) computers.push("כחול");
  
          const infraComputers = [];
          if (toBool(s.supports_pc_red)) infraComputers.push("אדום");
          if (toBool(s.supports_pc_green)) infraComputers.push("ירוק");
          if (toBool(s.supports_pc_blue)) infraComputers.push("כחול");
  
          let phone = "אין";
          if (toBool(s.has_phone_red)) phone = "אדום";
          else if (toBool(s.has_phone_green)) phone = "ירוק";
          else if (toBool(s.has_phone_blue)) phone = "כחול";
  
          let infraPhone = "אין";
          if (toBool(s.supports_phone_red)) infraPhone = "אדום";
          else if (toBool(s.supports_phone_green)) infraPhone = "ירוק";
          else if (toBool(s.supports_phone_blue)) infraPhone = "כחול";
  
          return {
            id: index,
            user: s.employee_name,
            computers,
            phone,
            tablet: toBool(s.has_tablet),
            infrastructure: {
              computers: infraComputers,
              phone: infraPhone,
              canConnectTablet: toBool(s.supports_tablet)
            },
             status_colors: s.status_colors
          };
        });
  
        const mappedReqs = {};
        data.forEach(s => {
          const toBool = val => Boolean(Number(val));
  
          const comps = [];
          if (toBool(s.need_pc_red)) comps.push("אדום");
          if (toBool(s.need_pc_green)) comps.push("ירוק");
          if (toBool(s.need_pc_blue)) comps.push("כחול");
  
          mappedReqs[s.employee_name] = {
            computers: comps,
            phone: toBool(s.need_phone_red) ? "אדום" : toBool(s.need_phone_green) ? "ירוק" : toBool(s.need_phone_blue) ? "כחול" : "אין",
            tablet: toBool(s.need_tablet)
          };
        });
  
        setRoom(mappedRoom);
        setUserRequirements(mappedReqs);
      } catch (err) {
        console.error("שגיאה בטעינת הנתונים מהשרת:", err);
      }
    };
  
    fetchData();
  }, []);
  

  const handleDragStart = (e, sourceId, computerIndex) => {
    e.dataTransfer.setData("sourceId", sourceId);
    e.dataTransfer.setData("computerIndex", computerIndex);
  };

  const handleDrop = (e, targetId) => {
    const sourceId = parseInt(e.dataTransfer.getData("sourceId"));
    const computerIndex = e.dataTransfer.getData("computerIndex");
    if (sourceId === targetId) return;

    const newRoom = [...room];
    const source = newRoom.find(pos => pos.id === sourceId);
    const target = newRoom.find(pos => pos.id === targetId);

    const dragged = computerIndex === "phone" ? "phone" :
                    computerIndex === "tablet" ? "tablet" :
                    source.computers[parseInt(computerIndex)];

    if (computerIndex !== "phone" && computerIndex !== "tablet") {
      if (!target.infrastructure.computers.includes(dragged)) {
        alert(`❌ אין תשתית למחשב מסוג ${dragged}`);
        return;
      }

      source.computers.splice(parseInt(computerIndex), 1);
      target.computers.push(dragged);
    } else if (computerIndex === "phone") {
      if (!target.infrastructure.phone.includes(source.phone)) {
        alert(`❌ אין תשתית לטלפון בצבע ${source.phone}`);
        return;
      }
      const tmp = source.phone;
      source.phone = target.phone;
      target.phone = tmp;
    } else if (computerIndex === "tablet") {
      if (!target.infrastructure.canConnectTablet) {
        alert("❌ אין תשתית לטאבלט");
        return;
      }
      const tmp = source.tablet;
      source.tablet = target.tablet;
      target.tablet = tmp;
    }

    setRoom(newRoom);
  };

  const getIssues = (user, pos) => {
    const req = userRequirements[user];
    if (!req) return [];

    const issues = [];
    const match = req.computers.every(c => pos.computers.includes(c));
    if (!match) {
      issues.push(`❌ מחשבים חסרים: ${req.computers.join(", ")}`);
    } else {
      issues.push("✔ מחשבים תקינים");
    }

    if (req.phone !== pos.phone) {
      issues.push(`❌ טלפון לא תואם: נדרש ${req.phone}`);
    } else {
      issues.push("✔ טלפון תקין");
    }

    if (req.tablet !== pos.tablet) {
      issues.push(`❌ טאבלט ${req.tablet ? "נדרש אך חסר" : "קיים אך לא נדרש"}`);
    } else {
      issues.push("✔ טאבלט תקין");
    }

    return issues;
  };

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            {row.map((index, colIndex) => {
              if (index === null) return <Placeholder key={colIndex} />;
              const pos = room[index];
              if (!pos) return <Placeholder key={colIndex} />;
              
              const user = pos.user; 
              const color = getColorFromStatus(pos.status_colors);
              const bgColor = {
                green: "#e6ffe6",
                red: "#ffe6e6",
                purple: "#f0e6ff",
                orange: "#fff4e6",
              }[color] || "#f0f0f0";

              return (
                <div
                  key={colIndex}
                  onDrop={e => handleDrop(e, pos.id)}
                  onDragOver={e => e.preventDefault()}
                  style={{
                    padding: "12px",
                    borderRadius: "12px",
                    border: `2px solid ${color}`,
                    background: bgColor,
                    minWidth: "110px"
                  }}
                >
                  <h4>עמדה {pos.id + 1}</h4>
                  <p>תשתית 🖥️: {pos.infrastructure.computers.join(", ")} | 📞: {pos.infrastructure.phone} | 📱: {pos.infrastructure.canConnectTablet ? "כן" : "לא"}</p>
                  <p style={{ fontWeight: "bold" }}>מחשבים: {pos.computers.join(", ")}</p>
                  {pos.computers.map((c, i) => (
                    <p
                      key={i}
                      draggable
                      onDragStart={e => handleDragStart(e, pos.id, i)}
                      style={{ cursor: "grab" }}
                    >
                      🖥️ {c}
                    </p>
                  ))}
                  <p
                    draggable
                    onDragStart={e => handleDragStart(e, pos.id, "phone")}
                    style={{ cursor: "grab" }}
                  >
                    📞 טלפון: {pos.phone}
                  </p>
                  {pos.tablet && (
                    <p
                      draggable
                      onDragStart={e => handleDragStart(e, pos.id, "tablet")}
                      style={{ cursor: "grab" }}
                    >
                      📱 טאבלט
                    </p>
                  )}
                  <div style={{ marginTop: "10px" }}>
                    {user ? (
                      <div
                        onClick={() => setSelectedUser(user)}
                        style={{
                          background: "white",
                          padding: "6px",
                          border: "1px solid gray",
                          borderRadius: "6px",
                          cursor: "pointer"
                        }}
                      >
                        {user} 👤
                      </div>
                    ) : (
                      <div style={{ color: "gray", fontStyle: "italic" }}>עמדה ריקה</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {selectedUser && (
        <div style={{ marginTop: "30px" }}>
          <h3>פירוט עבור: {selectedUser}</h3>
          <ul>
            {room
              .filter(pos => pos.user === selectedUser)
              .flatMap(pos => getIssues(selectedUser, pos))
              .map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
