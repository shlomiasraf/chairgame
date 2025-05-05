import { useState } from "react";

const initialRoom = [
  {
    id: 1,
    user: "דני",
    computer: "red",
    phone: "green",
    tablet: true
  },
  {
    id: 2,
    user: "רון",
    computer: "blue",
    phone: "green",
    tablet: false
  },
  {
    id: 3,
    user: "הילה",
    computer: "red",
    phone: "blue",
    tablet: true
  }
];

const userRequirements = {
  "דני": { computer: "red", phone: "green", tablet: true },
  "רון": { computer: "red", phone: "green", tablet: false },
  "הילה": { computer: "red", phone: "blue", tablet: true }
};

export default function App() {
  const [room, setRoom] = useState(initialRoom);

  const isMatch = (user, position) => {
    const req = userRequirements[user];
    if (!req) return false;
    return (
      req.computer === position.computer &&
      req.phone === position.phone &&
      req.tablet === position.tablet
    );
  };

  const handleDragStart = (e, user) => {
    e.dataTransfer.setData("user", user);
  };

  const handleDrop = (e, targetId) => {
    const draggedUser = e.dataTransfer.getData("user");
    const newRoom = room.map(pos => {
      if (pos.user === draggedUser) return { ...pos, user: null };
      return pos;
    });
    const targetIndex = newRoom.findIndex(pos => pos.id === targetId);
    newRoom[targetIndex].user = draggedUser;
    setRoom(newRoom);
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", direction: "rtl" }}>
      {room.map(position => {
        const match = isMatch(position.user, position);
        return (
          <div
            key={position.id}
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "2px solid",
              borderColor: match ? "green" : "red",
              background: match ? "#e6ffe6" : "#ffe6e6",
              width: "200px"
            }}
            onDrop={e => handleDrop(e, position.id)}
            onDragOver={e => e.preventDefault()}
          >
            <h3>עמדה {position.id}</h3>
            <p>מחשב: {position.computer}</p>
            <p>טלפון: {position.phone}</p>
            <p>טאבלט: {position.tablet ? "כן" : "לא"}</p>
            <div style={{ marginTop: "10px" }}>
              {position.user ? (
                <div
                  draggable
                  onDragStart={e => handleDragStart(e, position.user)}
                  style={{
                    background: "white",
                    padding: "6px",
                    border: "1px solid gray",
                    borderRadius: "6px",
                    cursor: "grab"
                  }}
                >
                  👤 {position.user}
                </div>
              ) : (
                <div style={{ color: "gray", fontStyle: "italic" }}>עמדה ריקה</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
