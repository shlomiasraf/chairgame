import { useState } from "react";

const generateRoom = () => {
  const colors = ["אדום", "ירוק", "כחול"];
  const names = [
    "דני", "רון", "הילה", "יוסי", "נועה", "אמיר", "שירה",
    "לירון", "דפנה", "אורי", "תמר", "רן", "מאיה", "גיא", "רוני", "אור"
  ];
  const room = [];
  for (let i = 0; i < 16; i++) {
    const name = names[i];
    const comp = colors[Math.floor(Math.random() * colors.length)];
    const phone = colors[Math.floor(Math.random() * colors.length)];
    const tablet = Math.random() > 0.5;
    const infraComp = colors[Math.floor(Math.random() * colors.length)];
    const infraPhone = colors[Math.floor(Math.random() * colors.length)];
    const canConnectTablet = Math.random() > 0.5;
    room.push({
      id: i + 1,
      user: name,
      computer: comp,
      phone: phone,
      tablet: tablet,
      infrastructure: {
        computer: infraComp,
        phone: infraPhone,
        canConnectTablet: canConnectTablet
      }
    });
  }
  return room;
};

const generateRequirements = room => {
  const reqs = {};
  room.forEach(r => {
    reqs[r.user] = {
      computer: r.computer,
      phone: r.phone,
      tablet: r.tablet
    };
  });
  return reqs;
};

const Placeholder = () => (
  <div
    style={{
      minWidth: "160px",
      padding: "12px",
      borderRadius: "12px",
      border: "2px solid transparent",
      background: "transparent"
    }}
  ></div>
);

export default function App() {
  const [room, setRoom] = useState(generateRoom());
  const [userRequirements] = useState(generateRequirements(room));
  const [selectedUser, setSelectedUser] = useState(null);

  const getIssues = (user, position) => {
    const req = userRequirements[user];
    if (!req) return [];
    const issues = [];

    if (req.computer !== position.computer) {
      issues.push(`❌ מחשב שגוי (צריך ${req.computer}, יש ${position.computer})`);
    } else {
      issues.push("✔ מחשב תקין");
    }

    if (req.phone !== position.phone) {
      issues.push(`❌ טלפון שגוי (צריך ${req.phone}, יש ${position.phone})`);
    } else {
      issues.push("✔ טלפון תקין");
    }

    if (req.tablet !== position.tablet) {
      issues.push(
        `❌ טאבלט ${req.tablet ? "נדרש למשתמש אך לא נמצא בעמדה" : "לא נדרש למשתמש אך נמצא בעמדה"}`
      );
    } else {
      issues.push("✔ טאבלט תקין");
    }

    return issues;
  };

  const handleDragStart = (e, sourceId, itemType) => {
    e.dataTransfer.setData("sourceId", sourceId);
    e.dataTransfer.setData("itemType", itemType);
  };

  const handleDrop = (e, targetId) => {
    const sourceId = parseInt(e.dataTransfer.getData("sourceId"));
    const itemType = e.dataTransfer.getData("itemType");
    if (sourceId === targetId) return;

    const newRoom = [...room];
    const fromIndex = newRoom.findIndex(pos => pos.id === sourceId);
    const toIndex = newRoom.findIndex(pos => pos.id === targetId);

    const sourceValue = newRoom[fromIndex][itemType];

    // בדיקת התאמת תשתית
    if (itemType === "computer") {
      const targetInfra = newRoom[toIndex].infrastructure.computer;
      if (targetInfra !== sourceValue) {
        alert(`❌ לא ניתן להעביר מחשב מסוג ${sourceValue} לעמדה עם תשתית מסוג ${targetInfra}`);
        return;
      }
    }

    if (itemType === "tablet") {
      const canConnectTablet = newRoom[toIndex].infrastructure.canConnectTablet;
      if (!canConnectTablet) {
        alert(`❌ בעמדה זו אין תשתית לטאבלט – לא ניתן להעביר`);
        return;
      }
    }

    const temp = newRoom[fromIndex][itemType];
    newRoom[fromIndex][itemType] = newRoom[toIndex][itemType];
    newRoom[toIndex][itemType] = temp;

    setRoom(newRoom);
  };

  const layout = [
    [0, 1, 2, 3, 4, 5, 6],
    [7, null, null, null, null, null, 8],
    [9, 10, 11, 12, 13, 14, 15]
  ];

  return (
    <div style={{ padding: "20px", direction: "rtl" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            {row.map((index, colIndex) => {
              if (index === null) {
                return <Placeholder key={colIndex} />;
              }
              const position = room[index];
              const user = position.user;
              const hasInfraMismatch =
              position.computer !== position.infrastructure.computer ||
              (position.tablet && !position.infrastructure.canConnectTablet);
            
            const userMatch =
              user && userRequirements[user]
                ? userRequirements[user].computer === position.computer &&
                  userRequirements[user].phone === position.phone &&
                  userRequirements[user].tablet === position.tablet
                : true;
            
            const isInfraOnlyError = hasInfraMismatch && userMatch;
              return (
              <div
                key={colIndex}
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  border: "2px solid",
                  borderColor: isInfraOnlyError ? "purple" : userMatch ? "green" : "red",
                  background: isInfraOnlyError ? "#f3e6ff" : userMatch ? "#e6ffe6" : "#ffe6e6",
                  minWidth: "160px"
                }}
                  onDrop={e => handleDrop(e, position.id)}
                  onDragOver={e => e.preventDefault()}
                >
                  <h4>עמדה {position.id}</h4>
                  <p style={{ fontSize: "0.85em", color: "gray" }}>
                    תשתית 🖥️: {position.infrastructure.computer} | 📞: {position.infrastructure.phone} | 📱: {position.infrastructure.canConnectTablet ? "כן" : "לא"}
                  </p>
                  <p
                    draggable
                    onDragStart={e => handleDragStart(e, position.id, "computer")}
                    style={{ cursor: "grab" }}
                  >
                    🖥️ מחשב: {position.computer}
                  </p>
                  <p
                    draggable
                    onDragStart={e => handleDragStart(e, position.id, "phone")}
                    style={{ cursor: "grab" }}
                  >
                    📞 טלפון: {position.phone}
                  </p>
                  {position.tablet && (
                    <p
                      draggable
                      onDragStart={e => handleDragStart(e, position.id, "tablet")}
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
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        {user} <span role="img" aria-label="user">👤</span>
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
